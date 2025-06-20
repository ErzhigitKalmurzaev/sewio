import React, { useState } from 'react'
import { Modal, Uploader } from 'rsuite'
import Button from '../../../../../components/ui/button'
import NumInput from '../../../../../components/ui/inputs/numInput'
import Textarea from '../../../../../components/ui/inputs/textarea'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { postPayment, postPaymentFiles } from '../../../../../store/technolog/staff'
import { toast } from 'react-toastify'

const BonusModal = ({ modals, setModals, setUpdate }) => {

  const { id } = useParams();
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [payment, setPayment] = useState({
    status: 6,
    comment: '',
    amount: '',
    staff: Number(id)
  });
  const [errors, setErrors] = useState({
    amount: false,
    comment: false
  });

  const validateField = () => {
    const newErrors = {
      amount: !payment.amount,
    //   comment: !payment.comment
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(item => item);
  }

  const onSubmit = () => {
    if(validateField()) {
        dispatch(postPayment({ ...payment, amount: Number(payment.amount) }))
        .then(res => {
            toast('Бонус успешно выдан!')
            setModals({ ...modals, bonus: false });
        })
    } else {
        toast('Заполните все поля!')
    }
  }

  return (
    <Modal open={modals.bonus} onClose={() => setModals({ ...modals, bonus: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Выдача бонуса</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-4'>
                <NumInput 
                    label='Сумма бонуса' 
                    placeholder='0' 
                    type='text'
                    value={`${payment.amount}`}
                    onChange={e => setPayment({ ...payment, amount: e })}
                    error={errors.amount}
                />
                <Textarea 
                    label='Комментарий' 
                    placeholder='Комментарий'
                    value={payment.comment}
                    onChange={e => setPayment({ ...payment, comment: e })}
                    error={errors.comment}
                />
            </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-center'>
            <Button width='385px' onClick={onSubmit}>Выдать</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default BonusModal;
