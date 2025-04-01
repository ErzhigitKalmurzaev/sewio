import React, { useEffect, useState } from 'react'
import { Modal, Uploader } from 'rsuite'
import Button from '../../../../../components/ui/button'
import NumInput from '../../../../../components/ui/inputs/numInput'
import Textarea from '../../../../../components/ui/inputs/textarea'
import { CloudUpload } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStaffPaymentInfo, postPayment, postPaymentFiles } from '../../../../../store/technolog/staff'
import { toast } from 'react-toastify'
import { set } from 'react-hook-form'

function calculateTotal(works) {
    return works?.reduce((sum, work) => {
        return sum + (work?.total_amount * work?.operation?.price);
    }, 0);
}

const AdvanceModal = ({ modals, setModals, update, setUpdate }) => {

  const { id } = useParams();
  const dispatch = useDispatch();

  const { payment_info, payment_info_status } = useSelector(state => state.staff);

  const [files, setFiles] = useState([]);
  const [payment, setPayment] = useState({
    status: 3,
    comment: '',
    amount: '',
    staff: Number(id)
  });
  const [errors, setErrors] = useState({
    amount: false,
    comment: false
  });

  useEffect(() => {
    // if(Object.keys(payment_info).length === 0) {
        dispatch(getStaffPaymentInfo({ id: Number(id) }));
    // }
  }, [id, update]);

  const validateField = () => {
    const newErrors = {
      amount: !payment.amount
    }
    setErrors(newErrors);
    return !Object.values(newErrors).some(item => item);
  }

  const onSubmit = () => {
    if(validateField()) {
        dispatch(postPayment({ ...payment, amount: Number(payment.amount) }))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                setUpdate(prev => !prev);
                if(files.length > 0) {
                    const dataWithFiles = {
                        payment_id: res.payload.id,
                        files: files.map(item => (item.blobFile))
                    }
    
                    dispatch(postPaymentFiles(dataWithFiles))
                        .then(res => {
                            if(res.meta.requestStatus === 'fulfilled') {
                                setModals({ ...modals, advance: false });
                                toast('Аванс успешно оформлен!')
                            }
                        })
                } else {
                    setModals({ ...modals, advance: false });
                    toast('Аванс успешно оформлен!')
                }
            }
        })
    } else {
        toast('Заполните все поля!')
    }
  }

  return (
    <Modal open={modals.advance} onClose={() => setModals({ ...modals, advance: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Выдача аванса</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex justify-between bg-[#467070] text-white font-inter p-6 rounded-xl'>
                <div className='w-1/2 flex flex-col'>
                    <p className='text-sm'>Заработанная сумма</p>
                    <p className='text-xl'>{calculateTotal(payment_info?.works) || 0} сом</p>
                </div>
                <div className='w-1/2 flex flex-col'>
                    <p className='text-sm'>Штрафы</p>
                    <p className='text-xl'>{payment_info?.payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0} сом</p>
                </div>
            </div>
            <div className='flex flex-col gap-y-4'>
                <NumInput 
                    label='Сумма аванса' 
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
                <div className='flex flex-col mt-2'>
                    <Uploader fileList={files} onChange={setFiles} autoUpload={false}>
                        <Button variant='white'>
                            <CloudUpload className='mr-2' size={18}/>
                            Загрузите файл или изображение
                        </Button>
                    </Uploader>
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-center'>
            <Button width='385px' onClick={onSubmit}>Выдать</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default AdvanceModal
