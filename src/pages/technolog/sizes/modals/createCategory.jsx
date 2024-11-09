import React, { useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSizeCategory } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'

const CreateCategory = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const [category, setCategory] = useState({
    title: '',
    is_active: true
  })
  const [errors, setErrors] = useState({
    title: false,
    is_active: false
  })

  const getValue = (e) => {
    const { name, value } = e.target;
    setCategory({
        ...category,
        [name]: value
    })
  }

  const onSubmit = () => {
    dispatch(createSizeCategory(category))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Категория создана успешно!");
                setModals({ ...modals, create_category: false })
                setCategory({
                    title: '',
                    is_active: true
                })
            }
        })
  }

  return (
    <Modal open={modals.create_category} onClose={() => setModals({ ...modals, create_category: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Создание категории</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-4'>
                <Input
                    label='Название'
                    name='title'
                    placeholder='Введите название'
                    type='text'
                    value={category.title}
                    error={errors.username}
                    onChange={getValue}
                />
                <Toggle checked={category.is_active} onChange={(e) => getValue({ target: { value: e, name: 'is_active' } })}>
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

export default CreateCategory
