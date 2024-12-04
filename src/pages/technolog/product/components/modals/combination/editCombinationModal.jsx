import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import Input from '../../../../../../components/ui/inputs/input';
import Checkbox from '../../../../../../components/ui/inputs/checkbox';
import Button from '../../../../../../components/ui/button';
import { editCombinationById, getProductById } from '../../../../../../store/technolog/product';

const EditCombinationModal = ({ modals, setModals, combination, operations, id_product }) => {

  const dispatch = useDispatch();

  const [newCombination, setNewCombination] = useState({ 
    nomenclature: Number(id_product), 
    title: combination.title, 
    operations: combination?.operations?.map(op => op.id) || []
  })

  useEffect(() => {
    setNewCombination({
        nomenclature: Number(id_product), 
        title: combination.title, 
        operations: combination?.operations?.map(op => op.id) || []
    })
  }, [combination.title])

  const getOperation = (operation) => {
    const findOper = newCombination?.operations?.find(oper => oper === operation.id);
    if(findOper) {
        const opers = newCombination?.operations?.filter(oper => oper !== operation.id);
        setNewCombination({
            ...newCombination,
            operations: opers
        })
    } else {
        setNewCombination({
            ...newCombination,
            operations: [...newCombination?.operations, operation.id]
        })
    }
  }

  const validateFields = () => {
    return newCombination.title && newCombination.operations.length > 0;
  }

  const onSubmit = () => {
    if(validateFields()) {
        dispatch(editCombinationById({ id: combination.id, props: newCombination }))
            .then(res => {
                if(res.meta.requestStatus === 'fulfilled') {
                    toast('Комбинация изменена успешно!');
                    setModals({ ...modals, edit: false })
                    dispatch(getProductById({ id: id_product }))
                }
            })
    } else {
        toast('Заполните все поля!');
    }
  }

  return (
    <Modal size={'md'} open={modals.edit} onClose={() => setModals({ ...modals, edit: false })}>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Редактирование комбинации</p>
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div className='flex flex-col gap-y-4 px-3'>
                <div>
                    <Input 
                        type='text' 
                        label='Название' 
                        placeholder='Введите название' 
                        onChange={(e) => setNewCombination({ ...newCombination, title: e.target.value })} 
                        value={newCombination.title} />
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
                <Button width='200px' variant='white' onClick={() => setModals({ ...modals, edit: false })}>Отмена</Button>
                <Button width='200px' onClick={onSubmit}>Готово</Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default EditCombinationModal
