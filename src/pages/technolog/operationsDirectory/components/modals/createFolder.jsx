import React, { useState } from 'react'
import { Modal } from 'rsuite'
import Button from '../../../../../components/ui/button'
import Input from '../../../../../components/ui/inputs/input'
import { useDispatch } from 'react-redux'
import { createFolder, getFolderList } from '../../../../../store/technolog/operations'
import { toast } from 'react-toastify'

const CreateFolder = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const onSubmit = () => {
    if(title !== '') {
        dispatch(createFolder({ title }))
            .then(res => {
                if(res.meta.requestStatus === 'fulfilled') {
                    setModals({ ...modals, folder: false })
                    setTitle('')
                    setError(false)
                    toast.success('Папка создана успешно!')
                    dispatch(getFolderList({ search: '' }))
                } else {
                  setError(true)
                  toast.error('Произошла ошибка!')
                }
            })
    } else {
      setError(true)
    }
  }

  return (
    <Modal open={modals.folder} onClose={() => setModals({ ...modals, folder: false })}>
        <Modal.Header>
            <Modal.Title>Создание папки</Modal.Title>
        </Modal.Header>
        <Modal.Body className='py-3'>
            <Input
                label='Название папки'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Введите название папки'
                error={error}
            />
        </Modal.Body>
        <Modal.Footer>
            <Button onClick={onSubmit}>Создать</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateFolder
