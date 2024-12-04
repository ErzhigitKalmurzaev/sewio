import React, { useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSize } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'
import Select from '../../../../components/ui/inputs/select'

const CreateSize = ({ modals, setModals, categories, setUpdate }) => {

  const dispatch = useDispatch();

  const [size, setSize] = useState({
    title: '',
    category: '',
    is_active: true
  })
  const [errors, setErrors] = useState({
    title: false,
    category: false,
    is_active: false
  })

  const getValue = (e) => {
    const { name, value } = e.target;
    setSize({
        ...size,
        [name]: value
    })
  }

  const onSubmit = () => {
    dispatch(createSize(size))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Категория создана успешно!");
                setModals({ ...modals, create_size: false })
                setUpdate(prev => !prev)
                setSize({
                    title: '',
                    is_active: true
                })
            }
        })
  }

  return (
    <Modal open={modals.create_size} onClose={() => setModals({ ...modals, create_size: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Создание размера</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-4'>
                <Select
                    label='Категория' 
                    name='category' 
                    placeholder='Выберите категорию' 
                    data={categories} 
                    value={size.category}
                    error={errors.category} 
                    labelKey='title'
                    valueKey='id'
                    onChange={e => getValue({ target: { value: e, name: 'category' } })}
                />
                <Input
                    label='Название'
                    name='title'
                    placeholder='Введите название'
                    type='text'
                    value={size.title}
                    error={errors.username}
                    onChange={getValue}
                />
                <Toggle checked={size.is_active} onChange={(e) => getValue({ target: { value: e, name: 'is_active' } })}>
                    Активный
                </Toggle>
            </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-center'>
            <Button width='385px' onClick={onSubmit}>Создать</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateSize
