import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { changeFolderValue, editFolderById, getCombinationList, getFolderById, getFolderList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';
import Button from '../../../../../components/ui/button';
import { editCombinationById } from './../../../../../store/technolog/product';
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

  const handleAddOperation = (combination) => {
    setChanged(true);
    if (!folder.combinations.some(op => op.id === combination.id)) {
        const updatedOperations = [...folder.combinations, combination];
        dispatch(changeFolderValue({ name: 'combinations', value: updatedOperations }));
    }
  };

  const handleRemoveOperation = (index) => {
    setChanged(true);
    const updatedOperations = folder.combinations.filter((_, i) => i !== index);
    dispatch(changeFolderValue({ name: 'combinations', value: updatedOperations }));
  };

  const onSubmit = () => {
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

                            <div>
                                {
                                        <div className="mt-4 grid grid-cols-2 gap-6">
                                            {/* ✅ Список операций в комбинации */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Комбинации в папке</h3>
                                                <div className="p-2 h-60 overflow-y-auto">
                                                    {folder?.combinations?.map((combination, index) => (
                                                        <div key={combination.id} className="flex flex-col items-center justify-center gap-y-2">
                                                            <Layers size={30} />
                                                            <p>{combination.title}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                }
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='flex justify-end'>
                            {
                                changed ? 
                                    <Button onClick={onSubmit}>
                                        Сохранить
                                    </Button>
                                    :
                                    <Button onClick={() => setModals({ ...modals, folder: false })}>
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
