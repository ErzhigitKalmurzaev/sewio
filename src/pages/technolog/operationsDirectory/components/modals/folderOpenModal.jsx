import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { changeFolderValue, deleteFolderById, editFolderById, getFolderById, getFolderList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Button from '../../../../../components/ui/button';
import { toast } from 'react-toastify';
import { Layers } from 'lucide-react';

const FolderOpenModal = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { folder, folder_status, combinations_list } = useSelector(state => state.operation);

  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if(modals.id) {
        dispatch(getFolderById({ id: modals.id }))
    }
  }, [modals.id])


  const getValue = (e, name) => {
    setChanged(true);
    dispatch(changeFolderValue({ name, value: e }))
  }

  const onSubmit = () => {
    setModals({ ...modals, folder: false });
    if(folder?.title) {
        dispatch(editFolderById({ id: modals.id, props: {
            title: folder?.title
        } })).then(res => {
            if(res?.meta?.requestStatus === 'fulfilled') {
                dispatch(getFolderList({ search: '' }))
                toast.success('Изменения сохранены!')
            } else {
                toast.error('Произошла ошибка!')
            }
        })
    } else {
        toast.error('Заполните все поля!')
    }
  }

  const onDelete = () => {
    setModals({ ...modals, folder: false });
    dispatch(deleteFolderById({ id: modals.id })).then(res => {
        if(res?.meta?.requestStatus === 'fulfilled') {
            dispatch(getFolderList({ search: '' }))
            toast.success('Папка успешно удалена!')
        } else {
            toast.error('Произошла ошибка!')
        }
    })
  }

  return (
    <Modal open={modals?.folder} onClose={() => setModals({ ...modals, folder: false })}>
        {
            folder_status === 'loading' && <p>Loading...</p>
        }
        {
            folder_status === 'success' && (
                <>
                    <Modal.Header>
                        <Modal.Title>Папка: {folder?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='flex flex-col gap-y-3'>
                            <div className='flex gap-x-3'>
                                <Input
                                    label='Название'
                                    width='50%'
                                    type='text'
                                    value={folder?.title}
                                    onChange={(e) => getValue(e.target.value, 'title')}
                                    error={changed && !folder?.title}
                                />
                            </div>
                            <div className='grid grid-cols-2'>
                                {
                                    folder?.combinations?.length > 0 ? 
                                    folder?.combinations?.map(item => (
                                        <button
                                            className="flex items-center my-2 gap-x-2"
                                        >
                                            <Layers size={20}/>
                                            <span className="font-medium text-base text-gray-800">{item?.title}</span>
                                        </button>
                                    ))
                                    : (
                                        <p className="text-gray-500">Нет комбинаций</p>
                                    )
                                }
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='flex justify-end gap-x-4'>
                            <Button width='100px' variant='red' onClick={onDelete}>
                                Удалить
                            </Button>
                            {
                                changed ? 
                                    <Button width='100px' onClick={onSubmit}>
                                        Сохранить
                                    </Button>
                                    :
                                    <Button width='100px' onClick={() => setModals({ ...modals, folder: false })}>
                                        Закрыть
                                    </Button>
                            }
                        </div>
                    </Modal.Footer>
                </>
            )
        }
    </Modal>
  )
}

export default FolderOpenModal
