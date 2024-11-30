import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import { useDispatch } from 'react-redux';
import { createEquipment, patchEquipment } from '../../../../store/technolog/equipment';
import { toast } from 'react-toastify';
import Button from '../../../../components/ui/button';

const EditEquipmentModal = ({ modals, setModals, editEquipment, setUpdate }) => {

  const dispatch = useDispatch();

  const [errors, setErrors] = useState(false);
  const [title, setTitle] = useState(editEquipment.title);

  useEffect(() => {
    setTitle(editEquipment.title)
  }, [editEquipment.title])

  const onSubmit = () => {
    if(title !== '') {
      dispatch(patchEquipment({ props: { title }, id: editEquipment.id }))
          .then(res => {
              if(res.meta.requestStatus === 'fulfilled') {
                  setModals({ ...modals, edit: false })
                  setTitle('')
                  toast.success('Оборудование изменено успешно!')
                  setUpdate(prev => !prev)
              } else {
                toast.error('Произошла ошибка!')
              }
          })
    } else {
      setErrors(true)
    }
  }

  return (
    <Modal open={modals.edit} onClose={() => setModals({ ...modals, edit: false })}>
      <Modal.Header>
        <Modal.Title>Редактирование оборудования</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-col gap-y-4 px-3 my-4'>
            <Input
                label='Название'
                name='title'
                placeholder='Введите название'
                type='text'
                error={errors}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
        </div>
      </Modal.Body>
      <Modal.Footer>
          <div className='flex justify-center gap-x-5'>
              <Button variant='white' width='200px' onClick={() => setModals({ ...modals, edit: false })}>
                  Отмена
              </Button>
              <Button width='200px' onClick={onSubmit}>
                  Сохранить
              </Button>
          </div>
      </Modal.Footer>
    </Modal>
  )
}

export default EditEquipmentModal
