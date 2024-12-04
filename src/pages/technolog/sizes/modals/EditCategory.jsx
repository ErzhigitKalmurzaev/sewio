import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSizeCategory, editSizeCategory } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'

const EditCategory = ({ modals, setModals, data, setUpdate }) => {

  const dispatch = useDispatch();

  const [category, setCategory] = useState({
    title: data.title,
    is_active: data.is_active
  })
  const [errors, setErrors] = useState({
    title: false,
    is_active: false
  })

  useEffect(() => {
    if(data?.title) {
        setCategory({
            title: data.title,
            is_active: data.is_active
        })
    }
  }, [data.title])


  const getValue = (e) => {
    const { name, value } = e.target;
    setCategory({
        ...category,
        [name]: value
    })
  }
  
  const onSubmit = () => {
    dispatch(editSizeCategory({ id: data.id, props: category}))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Категория изменена успешно!");
                setModals({ ...modals, edit: false });
                setUpdate(prev => !prev);
                setCategory({
                    title: '',
                    is_active: true
                })
            }
        })
  }

  return (
    <Modal open={modals.edit} onClose={() => setModals({ ...modals, edit: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Редактирование категории</p>
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
            <Button width='385px' onClick={onSubmit}>Сохранить</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default EditCategory
