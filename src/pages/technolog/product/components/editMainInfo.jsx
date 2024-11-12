import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Input from '../../../../components/ui/inputs/input';
import { Toggle } from 'rsuite';
import Button from '../../../../components/ui/button';
import { MoveRight, Save } from 'lucide-react';
import { styled } from '@mui/material';
import { editProductById } from '../../../../store/technolog/product';
import BackDrop from '../../../../components/ui/backdrop';
import Select from '../../../../components/ui/inputs/select';

const EditMainInfo = ({ product, setLoading }) => {

  const dispatch = useDispatch();

  const { size_category_list } = useSelector(state => state.size)

  const [editProduct, setEditProduct] = useState({
    title: product?.title || '',
    vendor_code: product?.vendor_code || '',
    category: product?.category || '',
    is_active: product?.is_active || true
  })
  const [errors, setErrors] = useState({
    title: false,
    vendor_code: false,
    category: false,
    is_active: false
  })

  const getValue = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: value
    })
  }
  
  const validateFields = () => {
    const newErrors = {
      title: !editProduct.title,
      vendor_code: !editProduct.vendor_code,
      category: !editProduct.category
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
      setLoading(true)
      dispatch(editProductById({ id: product.id, props: editProduct}))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            setLoading(false);
            toast("Основная информация о товаре успешно изменена!");
          }
        })
    } else {
      toast("Заполните все поля!")
    }
  }

  return (
    <WhiteWrapper>
        <div className="flex gap-x-5">
          <div className="w-3/6 flex flex-col justify-between gap-y-4">
            <Input 
              type="text" 
              name="title"
              label="Название" 
              placeholder="Введите название" 
              value={editProduct.title}
              onChange={getValue}
              error={errors.title}
            />
            <Input 
              type="text" 
              name="vendor_code"
              label="Артикул" 
              placeholder="Введите артикул"
              value={editProduct.vendor_code}
              onChange={getValue} 
              error={errors.vendor_code}
            />
            <Select
              label="Категория размера"
              placeholder="Выберите категорию размера"
              data={size_category_list || []}
              labelKey='title'
              valueKey='id'
              value={editProduct.category}
              onChange={(e) => getValue({ target: { value: e, name: 'category' }})}
              error={errors.category}
            />
            <Toggle
              checked={editProduct?.is_active}
              onChange={(e) => getValue({ target: { value: e, name: 'is_active' }})}
            >
              Активный
            </Toggle>
          </div>
          <div className="w-3/6 flex justify-between items-end gap-x-3">
            <p className="font-inter text-semibold">
              Для редактирования основной информации о товаре, нажмите кнопку "Сохранить"
            </p>
            <Button width='180px' onClick={onSubmit}>
                Сохранить <Save className="ml-2" size={18} />
            </Button>
          </div>
        </div>
    </WhiteWrapper>
  )
}

export default EditMainInfo

const WhiteWrapper = styled("div")`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 15px 20px 30px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;