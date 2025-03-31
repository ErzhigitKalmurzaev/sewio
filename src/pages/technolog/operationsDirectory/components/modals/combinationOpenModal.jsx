import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { changeCombinationValue, getCombinationById, getCombinationList, getFolderList, getOperationList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';
import { getOperationsTitlesList } from './../../../../../store/technolog/calculation';
import Button from '../../../../../components/ui/button';
import { editCombinationById } from './../../../../../store/technolog/product';
import { toast } from 'react-toastify';
import { combinationStatuses } from '../../../../../utils/selectDatas/productDatas';
import { Plus, Search, Trash2 } from 'lucide-react';

const CombinationOpenModal = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { combination, combination_status, operaitions_list, operaitions_list_status, folders_list } = useSelector(state => state.operation);

  const [changed, setChanged] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if(modals.id) {
        dispatch(getCombinationById({ id: modals.id }))
    }
    if(!folders_list) {
        dispatch(getFolderList({ search: '' }))
    }
    if(!operaitions_list?.results) {
        dispatch(getOperationList({ search: '' }))
    }
  }, [modals.id])

  const getValue = (e, name) => {
    setChanged(true);
    dispatch(changeCombinationValue({ name, value: e }))
  }

  const handleAddOperation = (operation) => {
    setChanged(true);
    if (!combination.operations.some(op => op.id === operation.id)) {
        const updatedOperations = [...combination.operations, operation];
        dispatch(changeCombinationValue({ name: 'operations', value: updatedOperations }));
    }
  };

  const handleRemoveOperation = (index) => {
    setChanged(true);
    const updatedOperations = combination.operations.filter((_, i) => i !== index);
    dispatch(changeCombinationValue({ name: 'operations', value: updatedOperations }));
  };

  const onSubmit = () => {
    if(combination?.operations?.length > 0 && combination?.title && combination?.file) {
        dispatch(editCombinationById({ id: modals.id, props: {
            is_sample: true,
            operations: combination?.operations?.map(item => item?.id),
            file: combination?.file?.id || combination?.file,
            title: combination?.title,
            status: combination?.status
        } })).then(res => {
            if(res?.meta?.requestStatus === 'fulfilled') {
                toast.success('Изменения сохранены!')
                dispatch(getCombinationList())
                setModals({ ...modals, combination: false })
            } else {
                toast.error('Произошла ошибка!')
            }
        })
    } else {
        toast.error('Заполните все поля!')
    }
  }

  const filteredOperations = operaitions_list?.results?.filter(op =>
    op.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !combination.operations.some(selectedOp => selectedOp.id === op.id)
  );

  return (
    <Modal open={modals?.combination} onClose={() => setModals({ ...modals, combination: false })}>
        {
            combination_status === 'loading' && <p>Loading...</p>
        }
        {
            combination_status === 'success' && (
                <>
                    <Modal.Header>
                        <Modal.Title>Комбинация: {combination?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='flex flex-col gap-y-3 px-3'>
                            <div className='flex gap-x-3'>
                                <Input
                                    label='Название'
                                    type='text'
                                    value={combination?.title}
                                    onChange={(e) => getValue(e.target.value, 'title')}
                                    error={changed && !combination?.title}
                                />

                                <Select
                                    label='Папка'
                                    data={folders_list}
                                    value={combination?.file?.id || combination?.file}
                                    onChange={(e) => getValue(e, 'file')}
                                    error={changed && (!combination?.file?.id && !combination?.file)}
                                    placeholder='Выберите папку'
                                    labelKey={'title'}
                                    valueKey={'id'}
                                />
                            </div>

                            <div className='flex gap-x-3'>
                                <Select
                                    label='Статус'
                                    data={combinationStatuses}
                                    value={combination?.status}
                                    onChange={(e) => getValue(e, 'status')}
                                    placeholder='Установите статус'
                                    valueKey={'id'}
                                />
                            </div>

                            <div>
                                {operaitions_list?.results?.length > 0 && (
                                    <div className='mt-4 grid grid-cols-2 gap-6'>
                                        <div>
                                            <h3 className='text-lg font-medium mb-1'>Операции в комбинации</h3>
                                            <div className='flex items-center mb-2 border border-borderGray rounded p-1 px-2 invisible'>
                                                <Search size={18} className='text-gray-400 mr-2' />
                                                <input type='text' className='w-full outline-none' placeholder='Поиск...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                            </div>
                                            <ul className='border border-borderGray rounded p-2 h-60 overflow-y-auto'>
                                                {combination.operations.map((operation, index) => (
                                                    <li key={operation.id} className='flex justify-between items-center p-1 px-3 border border-borderGray rounded mb-2'>
                                                        <span>{operation.title}</span>
                                                        <button className='text-red-500 hover:text-red-700' onClick={() => handleRemoveOperation(index)}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className='text-lg font-medium mb-1'>Все операции</h3>
                                            <div className='flex items-center mb-2 border border-borderGray rounded p-1 px-2'>
                                                <Search size={18} className='text-gray-400 mr-2' />
                                                <input type='text' className='w-full outline-none' placeholder='Поиск...' value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                                            </div>
                                            <ul className='border border-borderGray rounded p-2 h-60 overflow-y-auto'>
                                                {filteredOperations.map(operation => (
                                                    <li key={operation.id} className='flex justify-between items-center p-1 px-3 border border-borderGray rounded mb-2'>
                                                        <span>{operation.title}</span>
                                                        <button className='text-green-500 hover:text-green-700' onClick={() => handleAddOperation(operation)}>
                                                            <Plus size={18} />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
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
                                    <Button onClick={() => setModals({ ...modals, combination: false })}>
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

export default CombinationOpenModal
