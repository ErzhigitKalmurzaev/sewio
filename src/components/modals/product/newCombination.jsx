import React from 'react'
import { Modal } from 'rsuite'
import Input from '../../ui/inputs/input'
import Checkbox from '../../ui/inputs/checkbox'
import Button from '../../ui/button'

const NewCombination = ({ open, modals, setModals, newCombination, setNewCombination, newProduct, setNewProduct }) => {

  const getOperation = (operation) => {
    const findOper = newCombination.operations.find(oper => oper.name === operation.name);
    if(findOper) {
        const opers = newCombination.operations.filter(oper => oper.name !== operation.name);
        setNewCombination({
            ...newCombination,
            operations: opers
        })
    } else {
        setNewCombination({
            ...newCombination,
            operations: [...newCombination.operations, operation]
        })
    }
  }

  const createCombination = () => {
    setNewProduct({ ...newProduct, combinations: [...newProduct.combinations, newCombination] });
    setModals({ ...modals, newCombination: false });
  }

  return (
    <Modal size={'md'} open={open} onClose={() => setModals({ ...modals, newCombination: false })}>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Создание комбинации</p>
            </Modal.Title>
        </Modal.Header>

        <Modal.Body>
            <div className='flex flex-col gap-y-4 px-3'>
                <div>
                    <Input type='text' label='Название' placeholder='Введите название' onChange={(e) => setNewCombination({ ...newCombination, name: e.target.value })} value={newCombination.name} />
                </div>

                <div className='flex flex-col gap-y-3'>
                    <p className='text-base font-bold font-inter'>Операции</p>

                    <div className='w-full max-h-[300px] flex flex-wrap justify-between items-start gap-y-4 border border-borderGray rounded-md p-3'>
                        {
                            newProduct?.operations?.map((item, index) => (
                                <div 
                                    className='w-[49%] h-[40px] flex items-center justify-between p-2 border border-borderGray rounded-lg cursor-pointer' 
                                    key={index} 
                                    onClick={() => getOperation(item)}
                                >
                                    <Checkbox 
                                        isChecked={newCombination.operations.find(oper => oper.name === item.name)} 
                                        label={item.name}    
                                    />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Modal.Body>

        <Modal.Footer className='pt-3'>
            <div className='flex justify-center items-center gap-x-6'>
                <Button width='200px' variant='white'>Отмена</Button>
                <Button width='200px' onClick={createCombination}>Готово</Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default NewCombination
