import React from 'react'
import { Modal } from 'rsuite'
import Button from '../../../../../components/ui/button'

const RejectComingModal = ({ modals, setModals, onReject }) => {
  return (
    <Modal open={modals.reject} onClose={() => setModals({ ...modals, reject: false })}>
        <Modal.Header>
        </Modal.Header>
        <Modal.Body>
            <div className='h-[100px]'>
                <p className='font-inter text-center font-medium text-lg mt-10'>Вы действительно хотите отклонить приход?</p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='flex justify-center gap-x-5'>
                <Button width='200px' variant='white' onClick={() => setModals({ ...modals, reject: false })}>Отмена</Button>
                <Button width='200px' onClick={onReject}>Подтвердить</Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default RejectComingModal
