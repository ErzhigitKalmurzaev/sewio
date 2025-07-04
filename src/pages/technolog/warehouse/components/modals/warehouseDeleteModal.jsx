import React from 'react';
import { Modal } from 'rsuite';
import Button from '../../../../../components/ui/button';

const WarehouseDeleteModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title className="font-semibold text-lg">Удаление склада</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-base text-gray-700">
          Вы уверены, что хотите удалить этот склад? Это действие необратимо.
        </p>
      </Modal.Body>

      <Modal.Footer className='flex justify-end gap-x-4'>
        <Button width='100px' onClick={onConfirm} variant="red" appearance="primary">
          Удалить
        </Button>
        <Button width='100px' variant="white" onClick={onClose} appearance="subtle">
          Отмена
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WarehouseDeleteModal;
