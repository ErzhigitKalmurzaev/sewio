import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSize, editSize, getSizesList } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'

const EditSize = ({ modals, setModals }) => {

    const dispatch = useDispatch();

    const [size, setSize] = useState({
      title: modals?.edit_data?.title,
      is_active: modals?.edit_data?.is_active
    })

    useEffect(() => {
      setSize({
        title: modals?.edit_data?.title,
        is_active: modals?.edit_data?.is_active
      })
    }, [modals.edit_data])

    const getValue = (e) => {
      const { name, value } = e.target;
      setSize({
          ...size,
          [name]: value
      })
    }
  
    const onSubmit = () => {
      if(size.title?.length > 0) {
        dispatch(editSize({...size, id: modals.edit_data?.id}))
          .then(res => {
              if(res.meta.requestStatus === 'fulfilled') {
                  toast("Размер изменен успешно!");
                  setModals({ ...modals, edit: false })
                  dispatch(getSizesList());
                  setSize({
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
          <Modal.Body className='flex flex-col gap-y-5'>
              <div className='flex flex-col gap-y-4'>
                  <Input
                      label='Название'
                      name='title'
                      placeholder='Введите название'
                      type='text'
                      value={size.title}
                      onChange={getValue}
                  />
                  <Toggle checked={size.is_active} onChange={(e) => getValue({ target: { value: e, name: 'is_active' } })}>
                      Активный
                  </Toggle>
              </div>
          </Modal.Body>
          <Modal.Footer className='flex justify-center'>
              <Button width='250px' onClick={onSubmit}>Сохранить</Button>
          </Modal.Footer>
      </Modal>
    )
}

export default EditSize
