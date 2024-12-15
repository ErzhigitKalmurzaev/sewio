import React from 'react'
import { deactivateOperationById, getProductById, setUpdateProduct } from '../../../../../store/technolog/product';
import { useDispatch } from 'react-redux';
import { Modal } from 'rsuite';
import { toast } from 'react-toastify';
import Button from '../../../../../components/ui/button';

const DeleteOperationModal = ({ modals, setModals, operation, id_product }) => {

  const dispatch = useDispatch();

  const onSubmit = () => {
    dispatch(deactivateOperationById({ id: operation.id }))
      .then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast("Операция удалена успешно!");
          setModals({ ...modals, delete: false }); 
          dispatch(setUpdateProduct()); 
        }
      })
  }

  return (
    <Modal style={{ margin: '100px auto'}} size={'sm'} open={modals.delete} onClose={() => setModals({ ...modals, delete: false })}>

        <Modal.Body>
            <div className='flex flex-col gap-y-4 px-3'>
                <p className='font-inter text-lg text-center leading-10'>
                    Вы действительно хотите удалить операцию 
                    <br/>
                    <span className='text-bold text-redd'>"{operation.title}"</span>
                </p>
            </div>
        </Modal.Body>

        <Modal.Footer className='pt-3'>
            <div className='flex justify-center items-center gap-x-6'>
                <Button width='200px' variant='white' onClick={() => setModals({ ...modals, delete: false })}>Отмена</Button>
                <Button variant='red' width='200px' onClick={onSubmit}>Удалить</Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default DeleteOperationModal
