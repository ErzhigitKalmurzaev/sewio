import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';
import Input from '../../../../components/ui/inputs/input';
import { Toggle } from 'rsuite';
import Button from '../../../../components/ui/button';
import { MoveRight } from 'lucide-react';
import { styled } from '@mui/material';

const EditMainInfo = ({ product, setLoading }) => {

  const dispatch = useDispatch();

  const [editProduct, setEditProduct] = useState({
    title: product?.title || '',
    vendor_code: product?.vendor_code || '',
    is_active: product?.is_active || true
  })
  const [errors, setErrors] = useState({
    title: false,
    vendor_code: false,
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
      vendor_code: !editProduct.vendor_code
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    // if(validateFields()) {
    //   setLoading(true)
    //   dispatch(createProduct(editProduct))
    //     .then(res => {
    //       if(res.meta.requestStatus === 'fulfilled') {
    //         setLoading(true);
    //       }
    //     })
    // } else {
    //   toast("Заполните все поля!")
    // }
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
            <Toggle
              checked={editProduct?.is_active}
              onChange={(e) => getValue({ target: { value: e, name: 'is_active' }})}
            >
              Активный
            </Toggle>
          </div>
          <div className="w-3/6 flex justify-between items-end">
            <p className="font-inter text-semibold">
              Для создания товара сначала заполните основную информацию, и нажмите кнопку "Далее"
            </p>
            <Button width='180px' onClick={onSubmit}>
                Далее <MoveRight className="ml-2" />
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