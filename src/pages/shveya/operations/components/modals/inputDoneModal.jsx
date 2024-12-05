import React, { useState } from 'react'
import { Modal } from 'rsuite'
import NumInput from './../../../../../components/ui/inputs/numInput';
import Button from '../../../../../components/ui/button';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { postInputWork } from '../../../../../store/shveya/operation';

const InputDoneModal = ({ modals, setModals, operation, setUpdate }) => {

  const dispatch = useDispatch();

  const [amount, setAmount] = useState('');

  const validateField = () => {
    if(amount === '') return false
    if((Number(amount) + Number(operation?.moderation_amount) + Number(operation?.done_amount)) > Number(operation?.need_amount)) {
        toast.error('Количество введенных операций не должно превышать количество оставшихся операций!');
        return false
    }
    return true
  }

  const onSubmit = () => {
    if(validateField()) {
        dispatch(postInputWork({
            order_id: operation?.order_id,
            operations: [
                {
                    operation_id: operation?.operation_id,
                    amount: Number(amount)
                }
            ]
        })).then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                setModals({ ...modals, input: false });
                toast('Отчет успешно отправлен!');
                setUpdate(prev => !prev);
            } else {
                toast.error('Произошла ошибка!');
            }
            setAmount('');
        })
    }
  }

  return (
    <Modal open={modals.input} onClose={() => setModals({ ...modals, input: false })}>
      <Modal.Header>
            <Modal.Title>Операция: {operation?.operation_title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-col gap-y-3'>
            <p className='font-inter font-semibold text-base'>Информация об операции</p>
            <div className='flex gap-x-6 mb-4'>
                <span className='flex flex-col'> 
                    <p className='text-sm font-semibold'>ID заказа</p>
                    <p className='text-sm text-center text-lime-600'>#{operation?.order_id}</p>
                </span>
                <span className='flex flex-col'> 
                    <p className='text-sm font-semibold'>Заказчик</p>
                    <p className='text-sm'>{operation?.order_client}</p>
                </span>
            </div>
            <p className='font-inter font-semibold text-base'>Состояние</p>
            <div className='flex justify-between items-center mb-4'>
                <span className='flex flex-col'> 
                    <p className='text-sm font-semibold'>Общее</p>
                    <p className='text-sm'>{operation?.need_amount}</p>
                </span>
                <span className='flex flex-col'> 
                    <p className='text-sm font-semibold'>На модерации</p>
                    <p className='text-sm'>{operation?.moderation_amount}</p>
                </span>
                <span className='flex flex-col'> 
                    <p className='text-sm font-semibold'>Выполнено</p>
                    <p className='text-sm'>{operation?.done_amount}</p>
                </span>
            </div>
            <p className='font-inter font-semibold text-base mt-4'>Отправить отчет</p>
            <NumInput
                placeholder='0'
                value={amount}
                onChange={setAmount}
            />
            <div className='flex justify-center'>
                <Button width='200px' onClick={onSubmit}>Отправить</Button>
            </div>
        </div>
      </Modal.Body>
      <Modal.Footer>

      </Modal.Footer>
    </Modal>
  )
}

export default InputDoneModal
