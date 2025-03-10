import React from 'react'
import { Modal } from 'rsuite'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { delete_edit_prod } from '../../../../store/technolog/order'

const ConfirmDeleteModal = ({ modal, setModal, id, setIsDeleting }) => {

    const dispatch = useDispatch();

    const onDelete = () => {
        setIsDeleting(true);
        setTimeout(() => {
            dispatch(delete_edit_prod({ index: id }));
        }, 300);
        setModal(false);
    };
  
    return (
        <Modal open={modal} onClose={() => setModal(false)}>
            <Modal.Header className='border-b border-borderGray pb-2'>
                <Modal.Title>Подтвердите удаление</Modal.Title> 
            </Modal.Header>
            <Modal.Body className=''>
                <p className='font-inter font-medium my-2'>Вы действительно хотите удалить эту позицию?</p>
            </Modal.Body>
            <Modal.Footer className='flex justify-end gap-x-4'>
                <Button variant='white' width='120px' onClick={() => setModal(false)}>Отмена</Button>
                <Button variant='red' width='120px' onClick={onDelete} >Удалить</Button>
            </Modal.Footer>
        </Modal>
  )
}

export default ConfirmDeleteModal
