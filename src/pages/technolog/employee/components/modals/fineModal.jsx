import React, { useState } from 'react'
import { Modal, Uploader } from 'rsuite'
import Button from '../../../../../components/ui/button'
import NumInput from '../../../../../components/ui/inputs/numInput'
import Textarea from '../../../../../components/ui/inputs/textarea'
import SingleImagePicker from '../../../../../components/ui/imagePickers/singleImagePicker'
import { CloudUpload } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { postPayment, postPaymentFiles } from '../../../../../store/technolog/staff'
import { toast } from 'react-toastify'

const FineModal = ({ modals, setModals, setUpdate }) => {

  const { id } = useParams();
  const dispatch = useDispatch();

  const [files, setFiles] = useState([]);
  const [payment, setPayment] = useState({
    status: 2,
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
                            setModals({ ...modals, fine: false });
                            toast('Штраф успешно оформлен!')
                        }
                    })
               } else {
                    setModals({ ...modals, fine: false });
                    toast('Штраф успешно оформлен!')
               }
            }
        })
        
    } else {
        toast('Заполните все поля!')
    }
  }

  return (
    <Modal open={modals.fine} onClose={() => setModals({ ...modals, fine: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Учет штрафа</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-4'>
                <NumInput 
                    label='Сумма штрафа' 
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

export default FineModal
