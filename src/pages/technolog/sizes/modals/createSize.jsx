import React, { useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSize, getSizesList } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'

const CreateSize = ({ modals, setModals, setUpdate }) => {

  const dispatch = useDispatch();

  const [size, setSize] = useState({
    title: '',
    is_active: true
  })
  const [errors, setErrors] = useState({
    title: false,
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
                toast("Размер создан успешно!");
                setModals({ ...modals, create: false })
                setUpdate(prev => !prev)
                dispatch(getSizesList());
                setSize({
                    title: '',
                    is_active: true
                })
            }
        })
  }

  return (
    <Modal open={modals.create} onClose={() => setModals({ ...modals, create: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Создание размера</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-4'>
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
