import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { getCombinationList, getFolderList, getOperationList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';
import Button from '../../../../../components/ui/button';
import { createCombination } from './../../../../../store/technolog/product';
import { toast } from 'react-toastify';
import { combinationStatuses } from '../../../../../utils/selectDatas/productDatas';
import { Trash2, Plus, Search } from 'lucide-react';

const CreateCombination = ({ modals, setModals }) => {
    const dispatch = useDispatch();
    const { folders_list, operaitions_list } = useSelector(state => state.operation);
    const { operations_list } = useSelector(state => state.calculation);

    const [combination, setCombination] = useState({
        title: '',
        file: '',
        is_sample: true,
        operations: [],
        status: 0
    });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [errors, setErrors] = useState({ title: false, file: false, operations: false });

    useEffect(() => {
        if (!folders_list) dispatch(getFolderList());
        if (!operaitions_list?.results) dispatch(getOperationList({ search: '' }));
    }, [modals.id]);

    const getValue = (e, name) => setCombination({ ...combination, [name]: e });

    const handleAddOperation = (operation) => {
        if (!combination.operations.some(op => op.id === operation.id)) {
            setCombination({ ...combination, operations: [...combination.operations, operation] });
            console.log(...combination.operations, operation)
        }
    };

    const handleRemoveOperation = (index) => {
        setCombination({
            ...combination, 
            operations: combination.operations.filter((_, i) => i !== index)
        });
    };

    const validateField = () => {
        const newErrors = {
            title: !combination.title,
            // file: !combination.file,
            operations: combination.operations.length === 0,
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(Boolean);
    };

    const onSubmit = () => {
        if (validateField()) {
            dispatch(createCombination({
                ...combination,
                status: combination.status ? combination.status : 0,
                operations: combination.operations.map(item => item.id),
            })).then(res => {
                if (res?.meta?.requestStatus === 'fulfilled') {
                    toast.success('Комбинация создана!');
                    dispatch(getCombinationList({ search: '' }));
                    setModals({ ...modals, combination: false });
                    setCombination({ title: '', file: '', is_sample: true, operations: [], status: 0 });
                } else {
                    toast.error('Произошла ошибка!');
                }
            });
        } else {
            toast.error('Заполните все поля!');
        }
    };

    const filteredOperations = operations_list?.filter(op =>
        op.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !combination.operations.some(selectedOp => selectedOp.id === op.id)
    ) || [];
    
    return (
        <Modal open={modals?.combination} onClose={() => setModals({ ...modals, combination: false })}>
            <Modal.Header>
                <Modal.Title>Создание комбинации</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='flex flex-col gap-y-3 px-3'>
                    <div className='flex gap-x-3'>
                        <Input label='Название' type='text' placeholder='Введите название комбинации' value={combination.title} onChange={e => getValue(e.target.value, 'title')} error={errors.title} />
                        <Select label='Папка' data={folders_list} value={combination.file?.id || combination.file} onChange={e => getValue(e, 'file')} error={errors.file} placeholder='Выберите папку' labelKey='title' valueKey='id' />
                    </div>
                    <div className='w-1/2 flex gap-x-3'>
                        <Select label='Статус' data={combinationStatuses} value={combination.status} onChange={e => getValue(e, 'status')} placeholder='Установите статус' valueKey='id' />
                    </div>
                    <div>
                        {operaitions_list?.results?.length > 0 && (
                            <div className='mt-4 grid grid-cols-2 gap-6'>
                                <div>
                                    <h3 className='text-lg font-medium mb-1'>Операции в комбинации</h3>
                                    <div className='flex items-end justify-between py-1 mb-3'>
                                        <p>Время: {combination.operations.reduce((total, op) => total + op.time, 0) || 0} c</p>
                                        <p>Цена: {(combination.operations?.reduce((total, op) => total + op.price, 0))?.toFixed(2) || 0} cом</p>
                                    </div>
                                    <ul className='border border-borderGray rounded p-2 h-60 overflow-y-auto'>
                                        {combination.operations?.map((operation, index) => (
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
                                        {filteredOperations?.map(operation => (
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
                    <Button onClick={onSubmit}>Сохранить</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateCombination;