import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { changeCombinationValue, getCombinationById, getCombinationList, getFolderList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';
import { getOperationsTitlesList } from './../../../../../store/technolog/calculation';
import Button from '../../../../../components/ui/button';
import { editCombinationById } from './../../../../../store/technolog/product';
import { toast } from 'react-toastify';

const CombinationOpenModal = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { combination, combination_status, folders_list } = useSelector(state => state.operation);
  const { operations_list } = useSelector(state => state.calculation);

  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if(modals.id) {
        dispatch(getCombinationById({ id: modals.id }))
    }
    if(!folders_list) {
        dispatch(getFolderList({ search: '' }))
    }
    if(!operations_list) {
        dispatch(getOperationsTitlesList())
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
            title: combination?.title
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
                        <div className='flex flex-col gap-y-3'>
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

                            <div>
                                {
                                    operations_list?.length > 0 && (
                                        <div className="mt-4 grid grid-cols-2 gap-6">
                                            {/* ✅ Список операций в комбинации */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Операции в комбинации</h3>
                                                <ul className="border border-borderGray rounded p-2 h-60 overflow-y-auto">
                                                    {combination?.operations?.map((operation, index) => (
                                                        <li key={operation.id} className="flex justify-between items-center p-1 px-3 border border-borderGray rounded mb-2">
                                                            <span>{operation.title}</span>
                                                            <button 
                                                                className="text-red-500 hover:text-red-700"
                                                                onClick={() => handleRemoveOperation(index)}
                                                            >
                                                                ❌
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* ✅ Список всех операций */}
                                            <div>
                                                <h3 className="text-lg font-medium mb-2">Все операции</h3>
                                                <ul className="border border-borderGray rounded p-2 h-60 overflow-y-auto">
                                                    {(() => {
                                                    const selectedOperations = new Set(combination?.operations?.map(op => op.id));

                                                    return operations_list
                                                        .filter(op => !selectedOperations.has(op.id)) // O(1) проверка в Set
                                                        .map((operation) => (
                                                        <li key={operation.id} className="flex justify-between items-center p-1 px-3 border border-borderGray rounded mb-2">
                                                            <span>{operation.title}</span>
                                                            <button 
                                                            className="text-green-500 hover:text-green-700"
                                                            onClick={() => handleAddOperation(operation)}
                                                            >
                                                            ➕
                                                            </button>
                                                        </li>
                                                        ));
                                                    })()}
                                                </ul>
                                            </div>
                                        </div>
                                    )
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
