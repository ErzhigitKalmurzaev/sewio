import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Button from '../../../../../../components/ui/button';
import { deleteCombinationById, getProductById } from '../../../../../../store/technolog/product';
import { get } from 'react-hook-form';

const DeleteCombinationModal = ({ modals, setModals, combination, id_product }) => {

  const dispatch = useDispatch();

  const onSubmit = () => {
    dispatch(deleteCombinationById({ id: combination.id }))
      .then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast("Комбинация удалена успешно!");
          setModals({ ...modals, delete: false }); 
          dispatch(getProductById({ id: id_product })); 
        }
      })
  }

  return (
    <Modal style={{ margin: '100px auto'}} size={'sm'} open={modals.delete} onClose={() => setModals({ ...modals, delete: false })}>

        <Modal.Body>
            <div className='flex flex-col gap-y-4 px-3'>
                <p className='font-inter text-lg text-center leading-10'>
                    Вы действительно хотите удалить комбинацию 
                    <br/>
                    <span className='text-bold text-redd'>"{combination.title}"</span>
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

export default DeleteCombinationModal
