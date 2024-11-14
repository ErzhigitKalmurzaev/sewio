import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import SelectProductTable from '../components/SelectProductTable';
import Input from '../../../../components/ui/inputs/input';
import Button from '../../../../components/ui/button';
import NumInput from '../../../../components/ui/inputs/numInput';
import { useDispatch, useSelector } from 'react-redux';
import { getSizeCategoryList } from '../../../../store/technolog/size';
import { toast } from 'react-toastify';

const EditProductModal = ({ modals, setModals, setOrder, order, products, editProd, setEditProd, size_category_list }) => {

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sizes, setSizes] = useState([])
  const [product, setProduct] = useState({
    nomenclature: editProd?.nomenclature,
    price: editProd?.price,
    amounts: editProd.amounts
  })

  useEffect(() => {
    setSelectedProduct({
      id: editProd?.nomenclature
    });
    if(editProd?.nomenclature) {
      setProduct({
        nomenclature: editProd?.nomenclature,
        price: Number(editProd?.price),
        amounts: editProd?.amounts
      })
      const outerIndex = size_category_list.findIndex(outerObj =>
        outerObj.sizes.some(innerObj => innerObj.id === editProd?.amounts[0]?.size)
      );
      setSizes(size_category_list[outerIndex]?.sizes);
    }
  }, [editProd])

  const filteredProducts = products?.filter((product) =>
    product?.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
      const newProducts = [...order?.products];
      const index = newProducts?.findIndex(item => item.nomenclature === product?.nomenclature);
      if(index !== -1) {
        newProducts[index] = product;
      } else {
        newProducts.push(product);
      }
      setOrder({...order, products: newProducts});

      setProduct({
        nomenclature: '',
        price: '',
        amounts: []
      })
      setSelectedProduct(null);
      setSizes([])

      setModals({ ...modals, edit: false})
    } else {
      toast("Заполните все поля!");
    }
  };

  const getSizeValue = (e) => {
    const { value, id } = e.target;
    setProduct({
        ...product,
        amounts: product.amounts.map(amount => {
          if (amount.size === id) {
            return {
              ...amount,
              amount: Number(value)
            };
          }
          return amount;
        })
    })
  }

  const handleCloseModal = () => {
    setProduct({
      nomenclature: '',
      price: '',
      amounts: []
    })
    setSelectedProduct(null);
    setSizes([])

    setModals({ ...modals, edit: false})
  }

  return (
    <Modal size='lg' open={modals.edit} onClose={handleCloseModal}>
        <Modal.Header>
            <Modal.Title>Редактирование товара</Modal.Title>
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
                products={[products?.find(item => item.id === editProd?.nomenclature)] || []}
                selectedProduct={products?.find(item => item.id === editProd?.nomenclature)}
                onSelectProduct={handleSelectProduct}
            />

            {selectedProduct && editProd.price && (
            <div className='flex flex-col my-3 gap-y-4'>
                <NumInput
                    width='50%'
                    label="Цена"
                    type="number"
                    value={product?.price || editProd.price}
                    onChange={(e) => setProduct({ ...product, ['price']: e })}
                    placeholder="Введите цену"
                />
                <div className='grid grid-cols-3 gap-x-4'>
                    {
                        sizes && sizes?.map((item, index) => (
                            <NumInput
                                label={`Количество размеров ${item.title}`}
                                type="number"
                                value={product?.amounts?.find(amount => amount.size === item.id)?.amount || ''}
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
            <Button variant='white' onClick={handleCloseModal} appearance="subtle">
                Отмена
            </Button>
            <Button width='100px' onClick={handleAddToOrder} appearance="primary" disabled={!selectedProduct}>
                Сохранить
            </Button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default EditProductModal
