import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { changeCombinationValue, getCombinationById, getCombinationList, getFolderList, getOperationList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';
import { getOperationsTitlesList } from './../../../../../store/technolog/calculation';
import Button from '../../../../../components/ui/button';
import { createCombination, editCombinationById } from './../../../../../store/technolog/product';
import { toast } from 'react-toastify';

const CreateCombination = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { folders_list, operaitions_list } = useSelector(state => state.operation);

  const [combination, setCombination] = useState({
    title: '',
    file: '',
    is_sample: true,
    operations: []
  });
  const [errors, setErrors] = useState({
    title: false,
    file: false,
    operations: false,
  });

  useEffect(() => {
    if(!folders_list) {
        dispatch(getFolderList())
    }
    if(!operaitions_list?.results) {
        dispatch(getOperationList({ search: '' }))
    }
  }, [modals.id])

  const getValue = (e, name) => {
    setCombination({ ...combination, [name]: e });
  }

  const handleAddOperation = (operation) => {
    if (!combination.operations.some(op => op.id === operation.id)) {
        const updatedOperations = [...combination.operations, operation];
        setCombination({ ...combination, operations: updatedOperations });
    }
  };

  const handleRemoveOperation = (index) => {
    const updatedOperations = combination.operations.filter((_, i) => i !== index);
    setCombination({ ...combination, operations: updatedOperations });
  };

  const validateField = () => {
    const newErrors = {
      title: !combination?.title,
      file: !combination?.file,
      operations: combination?.operations?.length === 0,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  }

  const onSubmit = () => {
    if(validateField()) {
        dispatch(createCombination({
            ...combination,
            operations: combination?.operations?.map(item => item?.id),
        })).then(res => {
            if(res?.meta?.requestStatus === 'fulfilled') {
                toast.success('Комбинация создана!')
                dispatch(getCombinationList({ search: '' }))
                setModals({ ...modals, combination: false })
                setCombination({
                    title: '',
                    file: '',
                    is_sample: true,
                    operations: []
                })
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
        <Modal.Header>
            <Modal.Title>Создание комбинации</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-3'>
                <div className='flex gap-x-3'>
                    <Input
                        label='Название'
                        type='text'
                        placeholder={'Введите название комбинации'}
                        value={combination?.title}
                        onChange={(e) => getValue(e.target.value, 'title')}
                        error={errors?.title}
                    />

                    <Select
                        label='Папка'
                        data={folders_list}
                        value={combination?.file?.id || combination?.file}
                        onChange={(e) => getValue(e, 'file')}
                        error={errors.file}
                        placeholder='Выберите папку'
                        labelKey={'title'}
                        valueKey={'id'}
                    />
                </div>

                <div>
                    {
                        operaitions_list?.results?.length > 0 && (
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

                                        return operaitions_list?.results
                                            ?.filter(op => !selectedOperations.has(op.id)) // O(1) проверка в Set
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
                <Button onClick={onSubmit}>
                    Сохранить
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateCombination
