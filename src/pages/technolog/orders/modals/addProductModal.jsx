import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import SelectProductTable from '../components/SelectProductTable';
import Input from '../../../../components/ui/inputs/input';
import Button from '../../../../components/ui/button';
import NumInput from '../../../../components/ui/inputs/numInput';
import { useDispatch, useSelector } from 'react-redux';
import { getSizesList } from '../../../../store/technolog/size';
import { toast } from 'react-toastify';

const AddProductModal = ({ modals, setModals, setOrder, order, products, status, size_category_list }) => {

  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizes, setSizes] = useState([])
  const [product, setProduct] = useState({
    nomenclature: '',
    price: '',
    amounts: []
  })

  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (selectedProduct) => {
    setSelectedProduct(selectedProduct);
    const index = size_category_list?.findIndex(item => item.id === selectedProduct?.category?.id); 
    const category_sizes = size_category_list[index]?.sizes;
    setSizes(category_sizes || []);
    const product_amounts = category_sizes?.map(item => ({
        size: item.id,
        amount: 0
    }))
    setProduct({
        ...product,
        nomenclature: selectedProduct.id,
        amounts: product_amounts || []
    })
  };

  const validateFields = () => {
    return product.nomenclature && product.amounts.every(item => item.amount > 0) && product.price
  }

  const handleAddToOrder = () => {
    if(validateFields()) {
      setOrder({
        ...order,
        ['products']: [...order.products, product]
      });

      setProduct({
        nomenclature: '',
        price: '',
        amounts: []
      })
      setSelectedProduct(null);
      setSizes([])

      setModals({ ...modals, add: false})
    } else {
      toast('Заполните все поля!');
    }
  };

  const getSizeValue = (e) => {
    const { value, id } = e.target;
    setProduct({
        ...product,
        amounts: product.amounts.map(amount => {
          // Проверяем, соответствует ли `id` нужному объекту
          if (amount.size === id) {
            return {
              ...amount,
              amount: Number(value) // Обновляем количество в нужном объекте
            };
          }
          return amount;
        })
    })
  }

  return (
    <Modal size='lg' open={modals.add} onClose={() => setModals({ ...modals, add: false })}>
        <Modal.Header>
            <Modal.Title>Добавление товара</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='px-1'>
                <Input
                    placeholder="Поиск по названию товара"
                    type='text'
                    value={searchTerm}
                    onChange={(value) => setSearchTerm(value.target.value)}
                />
            </div>

            <SelectProductTable
                products={filteredProducts}
                selectedProduct={selectedProduct}
                onSelectProduct={handleSelectProduct}
            />

            {selectedProduct && (
            <div className='flex flex-col my-3 gap-y-4'>
                <NumInput
                    width='50%'
                    label="Цена"
                    type="number"
                    value={`${product.price}`}
                    onChange={(e) => setProduct({ ...product, ['price']: e })}
                    placeholder="Введите цену"
                />
                <div className='grid grid-cols-3 gap-x-4'>
                    {
                        sizes && sizes?.map((item, index) => (
                            <NumInput
                                label={`Количество размеров ${item.title}`}
                                type="number"
                                value={`${product.amounts.find(amount => amount.size === item.id)?.amount}` || ''}
                                onChange={(e) => getSizeValue({ target: { value: e, id: item.id }})}
                                placeholder={`Введите количество ${item.title}`}
                            />
                        ))
                    }
                </div>
            </div>
            )}
        </Modal.Body>

      <Modal.Footer>
        <div className='flex justify-end items-center gap-x-6'>
            <Button variant='white' onClick={() => setModals({ ...modals, add: false })} appearance="subtle">
                Отмена
            </Button>
            <Button width='100px' onClick={handleAddToOrder} appearance="primary" disabled={!selectedProduct}>
                Добавить
            </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default AddProductModal
