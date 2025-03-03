import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSize, editSize, getColors, getSizesList, patchColors } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'
import { SketchPicker } from 'react-color'

const EditColor = ({ modals, setModals }) => {

    const dispatch = useDispatch();

    const [color, setColor] = useState({
      title: modals?.edit_data?.title,
      is_active: modals?.edit_data?.is_active,
      code: modals?.edit_data?.code
    })

    useEffect(() => {
      setColor({
        title: modals?.edit_data?.title,
        is_active: modals?.edit_data?.is_active,
        code: modals?.edit_data?.code || ''
      })
    }, [modals.edit_data])

    const getValue = (e) => {
      const { name, value } = e.target;
      setColor({
          ...color,
          [name]: value
      })
    }
  
    const onSubmit = () => {
      if(color.title?.length > 0) {
        dispatch(patchColors({...color, id: modals.edit_data?.id}))
          .then(res => {
              if(res.meta.requestStatus === 'fulfilled') {
                  toast("Цвет изменен успешно!");
                  setModals({ ...modals, edit: false })
                  dispatch(getColors());
                  setColor({
                      title: '',
                      is_active: true
                  })
              }
          })
      } else {
        toast.error('Заполните все поля!')
      }
    }
  
    return (
      <Modal open={modals.edit} onClose={() => setModals({ ...modals, edit: false })} className='my-auto'>
          <Modal.Header>
              <Modal.Title>
                  <p className='text-lg font-bold font-inter'>Редактирование размера</p>
              </Modal.Title>
          </Modal.Header>
          <Modal.Body className='flex gap-x-6'>
              <SketchPicker
                  color={color?.code}
                  onChangeComplete={(e) => getValue({ target: { value: e?.hex, name: 'code' } })}
              />
              <div className='w-1/2 flex flex-col gap-y-4'>
                  <Input
                      label='Название'
                      name='title'
                      placeholder='Введите название'
                      type='text'
                      value={color.title}
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

export default EditColor
