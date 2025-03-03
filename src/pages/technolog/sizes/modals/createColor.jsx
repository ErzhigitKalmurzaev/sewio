import React, { useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { getColors, postColor } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'
import { SketchPicker } from 'react-color';

const CreateColor = ({ modals, setModals, setUpdate }) => {

  const dispatch = useDispatch();

  const [color, setColor] = useState({
    title: '',
    is_active: true,
    code: '#000000'
  })
  const [errors, setErrors] = useState({
    title: false,
    is_active: false
  })

  const getValue = (e) => {
    const { name, value } = e.target;
    setColor({
        ...color,
        [name]: value
    })
  }

  const onSubmit = () => {
    dispatch(postColor(color))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Цвет создан успешно!");
                setModals({ ...modals, create: false })
                dispatch(getColors());
                setColor({
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
                <p className='text-lg font-bold font-inter'>Создание цвета</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex gap-x-6'>
            <SketchPicker
                color={color.code}
                onChangeComplete={(e) => getValue({ target: { value: e.hex, name: 'code' } })}
            />
            <div className='w-1/2 flex flex-col gap-y-4'>
                <Input
                    label='Название'
                    name='title'
                    placeholder='Введите название'
                    type='text'
                    value={color.title}
                    error={errors.username}
                    onChange={getValue}
                />
                <Toggle checked={color.is_active} onChange={(e) => getValue({ target: { value: e, name: 'is_active' } })}>
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

export default CreateColor
