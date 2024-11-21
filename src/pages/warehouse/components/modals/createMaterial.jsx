import React, { useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import { useDispatch } from 'react-redux'
import Select from '../../../../components/ui/inputs/select'
import { materialUnits } from '../../../../utils/selectDatas/productDatas'
import { postMaterial } from '../../../../store/technolog/material'
import { toast } from 'react-toastify'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'

const CreateMaterial = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const [material, setMaterial] = useState({
    title: '',
    vendor_code: '',
    unit: 0,
    is_active: false
  })
  const [errors, setErrors] = useState({
    title: false,
    vendor_code: false,
    unit: false,
    is_active: false
  })

  const getValue = (e) => {
    const { name, value } = e.target;
    setMaterial({
      ...material,
      [name]: value
    })
  }

  const validateField = () => {
    const newErrors = {
      title: !material.title,
      vendor_code: !material.vendor_code,
      unit: !material.unit,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateField()) {
        dispatch(postMaterial(material))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Сырье создано успешно!");
                setModals({ ...modals, create: false })
                setMaterial({
                    title: '',
                    vendor_code: '',
                    unit: 0,
                    is_active: false
                })
            }
        })
    } else {
        toast("Заполните все поля!")
    }
  }

  return (
    <Modal open={modals.create} onClose={() => setModals({ ...modals, create: false })} size='md'>
        <Modal.Header>
            <Modal.Title>Создание сырья</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-5'>
                <div className='flex justify-between gap-x-5'>
                    <Input
                        type='text'
                        name='title'
                        label='Название'
                        placeholder='Введите название сырья'
                        value={material.title}
                        onChange={getValue}
                        error={errors.title}
                    />
                    <Input
                        type='text'
                        name='vendor_code'
                        label='Артикул'
                        placeholder='Введите артикул сырья'
                        value={material.vendor_code}
                        onChange={getValue}
                        error={errors.vendor_code}
                    />
                    <Select
                        width='1/2'
                        label='Единица измерения'
                        placeholder='Выберите'
                        data={materialUnits}
                        value={material.unit}
                        error={errors.unit}
                        onChange={(e) => getValue({ target: { name: 'unit', value: e } })}
                    />
                </div>
                <Toggle 
                    checked={material.is_active}
                    onChange={(e) => getValue({ target: { name: 'is_active', value: e } })}    
                >
                    Активный
                </Toggle>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button width='100px' onClick={onSubmit}>Создать</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateMaterial
