import React from 'react'
import { Modal } from 'rsuite'

const AddPositionModal = ({ modals, setModals }) => {
  return (
    <Modal size='lg' open={modals.add} onClose={() => setModals({ ...modals, add: false })}>
        <Modal.Header>
            <Modal.Title>Добавление позиции</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
        </Modal.Body>
      <Modal.Footer>
        
      </Modal.Footer>
    </Modal>
  )
}

export default AddPositionModal
