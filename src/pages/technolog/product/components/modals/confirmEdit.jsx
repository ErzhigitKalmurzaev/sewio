import React from 'react'
import { Modal } from 'rsuite'
import Button from '../../../../../components/ui/button'

const ConfirmEdit = ({ modals, setModals, onSubmit }) => {

  const onClick = () => {
    onSubmit()
    setModals({ ...modals, editConfirm: false })
  }

  return (
    <Modal center open={modals?.editConfirm} onClose={() => setModals({ ...modals, editConfirm: false })} size='sm'>
        <Modal.Body>
            <p className='font-inter font-semibold text-lg text-center'>Вы действительно хотите сохранить изменения?</p>
            <p className='font-inter font-medium my-4 text-center'>Редактирование товара может изменить себестоимость товара и заказа.</p>
        </Modal.Body>
        <Modal.Footer>
            <div className='flex justify-center gap-x-6'>
                <Button width={'120px'} variant='red' onClick={() => setModals({ ...modals, editConfirm: false })}>
                    Отмена
                </Button>
                <Button width={'120px'} onClick={onClick}>
                    Сохранить
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default ConfirmEdit
