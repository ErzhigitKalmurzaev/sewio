import React, { useState } from 'react'
import { Modal } from 'rsuite'
import Input from '../../ui/inputs/input'
import Checkbox from '../../ui/inputs/checkbox'
import Button from '../../ui/button'
import { useDispatch } from 'react-redux'
import { createCombination, setUpdateProduct } from './../../../store/technolog/product';
import { toast } from 'react-toastify'
import { create } from '@mui/material/styles/createTransitions'
import { get } from 'react-hook-form'

const NewCombination = ({ modals, setModals, operations, id_product }) => {

  const dispatch = useDispatch();

  const [newCombination, setNewCombination] = useState({ nomenclature: Number(id_product), title: '', operations: [] })

  const getOperation = (operation) => {
    const findOper = newCombination.operations.find(oper => oper === operation.id);
    if(findOper) {
        const opers = newCombination.operations.filter(oper => oper !== operation.id);
        setNewCombination({
            ...newCombination,
            operations: opers
        })
    } else {
        setNewCombination({
            ...newCombination,
            operations: [...newCombination.operations, operation.id]
        })
    }
  }

  const validateFields = () => {
    return newCombination.title && newCombination.operations.length > 0;
  }

  const onSubmit = () => {
    if(validateFields()) {
        dispatch(createCombination(newCombination))
            .then(res => {
                if(res.meta.requestStatus === 'fulfilled') {
                    toast('Комбинация создана успешно!');
                    setModals({ ...modals, create: false })
                    dispatch(setUpdateProduct())
                }
            })
    } else {
        toast('Заполните все поля!');
    }
  }

  return (
    <Modal size={'md'} open={modals.create} onClose={() => setModals({ ...modals, create: false })}>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Создание комбинации</p>
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div className='flex flex-col gap-y-4 px-3'>
                <div>
                    <Input type='text' label='Название' placeholder='Введите название' onChange={(e) => setNewCombination({ ...newCombination, title: e.target.value })} value={newCombination.name} />
                </div>

                <div className='flex flex-col gap-y-3'>
                    <p className='text-base font-bold font-inter'>Операции</p>

                    <div className='w-full max-h-[300px] flex flex-wrap justify-between items-start gap-y-4 border border-borderGray rounded-md p-3'>
                        {
                            operations?.map((item, index) => (
                                <button 
                                    className='w-[49%] h-[40px] flex items-center justify-between p-2 border border-borderGray rounded-lg cursor-pointer' 
                                    key={index} 
                                    onClick={() => getOperation(item)}
                                >
                                    <Checkbox 
                                        key={index + "checks"}
                                        onClick={e => e.stopPropagation()}
                                        isChecked={newCombination.operations.find(oper => oper === item.id)} 
                                        label={item.title}    
                                    />
                                </button>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Modal.Body>

        <Modal.Footer className='pt-3'>
            <div className='flex justify-center items-center gap-x-6'>
                <Button width='200px' variant='white' onClick={() => setModals({ ...modals, create: false })}>Отмена</Button>
                <Button width='200px' onClick={onSubmit}>Готово</Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default NewCombination
