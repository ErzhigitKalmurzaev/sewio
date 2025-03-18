import React from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../../components/ui/inputs/input'
import Button from '../../../../../components/ui/button'
import { toast } from 'react-toastify'

const CreateProductModal = ({ modals, setModals, product, setProduct, onSubmit, clientData }) => {

  const [errors, setErrors] = React.useState({
    title: false,
    vendor_code: false
  });

  const validateFields = () => {
    const newErrors = {
      title: !product.title,
      vendor_code: !product.vendor_code
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = () => {
    if (validateFields() && clientData.title !== product.title && clientData.vendor_code !== product.vendor_code) {
      onSubmit(modals.name);
    } else {
        toast.error('Заполните правильно данные о товаре! Название товара и артикул должны быть уникальными!');
    }
  }

  return (
    <Modal open={modals.product} onClose={() => setModals({ ...modals, product: false })}>
        <Modal.Header>
            <Modal.Title>Создание товара</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-4'>
                <Input
                    label='Название'
                    type='text'
                    placeholder={'Введите название'}
                    value={product.title}
                    error={errors.title}
                    onChange={(e) => setProduct({ ...product, title: e.target.value })}
                />
                <Input
                    label='Артикул'
                    type='text'
                    placeholder={'Введите артикул'}
                    value={product.vendor_code}
                    error={errors.vendor_code}
                    onChange={(e) => setProduct({ ...product, vendor_code: e.target.value })}
                />
                <Toggle 
                    checked={product?.is_active}
                    onChange={(e) => setProduct({ ...product, is_active: e })}
                >
                    Активный
                </Toggle>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='flex justify-center gap-x-4'>
                <Button
                    width='150px'
                    onClick={() => setModals({ ...modals, product: false })}
                    variant='white'
                >
                    Отмена
                </Button>
                <Button
                    width='150px'
                    onClick={handleSubmit}
                >
                    Создать
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateProductModal
