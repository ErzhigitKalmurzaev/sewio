import React from 'react'
import { Modal } from 'rsuite'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { deleteSize, getSizesList } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'

const DeleteSize = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const onSubmit = () => {
    dispatch(deleteSize(modals.delete_data?.id))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast.success('Размер удален успешно!')
                setModals({ ...modals, delete: false })
                dispatch(getSizesList())
            }
        })
  }

  return (
    <Modal open={modals.delete} onClose={() => setModals({ ...modals, delete: false })}>
        <Modal.Header>
              <Modal.Title>
                  <p className='text-base font-bold font-inter text-center'>Удаление размера</p>
              </Modal.Title>
          </Modal.Header>
          <Modal.Body className='flex flex-col gap-y-5'>
              <div className='flex flex-col gap-y-4'>
                  <p className='text-sm font-semibold font-inter text-center'>Вы действительно хотите удалить размер?</p>
              </div>
          </Modal.Body>
          <Modal.Footer className='flex justify-center gap-x-5'>
              <Button width='200px' variant='white' onClick={() => setModals({ ...modals, delete: false })}>Отмена</Button>
              <Button width='200px' variant='red' onClick={onSubmit}>Удалить</Button>
          </Modal.Footer>
    </Modal>
  )
}

export default DeleteSize
