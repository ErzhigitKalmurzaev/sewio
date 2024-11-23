import React from 'react'
import { Modal } from 'rsuite'

const CreateEquipmentModal = ({ modals, setModals }) => {
  return (
    <Modal open={modals.create} onClose={() => setModals({ ...modals, create: false })} size={'lg'}>
      <Modal.Header>
        <Modal.Title>Создание оборудования</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-col gap-y-4 px-3'>
          <p className='font-inter text-lg text-center leading-10'>
            Вы действительно хотите создать оборудование?
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        
      </Modal.Footer>
    </Modal>
  )
}

export default CreateEquipmentModal
