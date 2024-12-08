// import React, { useState } from 'react'
// import { Modal } from 'rsuite'
// import Input from '../../../../components/ui/inputs/input'
// import { useDispatch } from 'react-redux';
// import { createEquipment } from '../../../../store/technolog/equipment';
// import { toast } from 'react-toastify';
// import Button from '../../../../components/ui/button';

// const CreateEquipmentModal = ({ modals, setModals, setUpdate }) => {

//   const dispatch = useDispatch();

//   const [errors, setErrors] = useState(false);
//   const [title, setTitle] = useState('');

//   const onSubmit = () => {
//     if(title !== '') {
//       dispatch(createEquipment({ title }))
//           .then(res => {
//               if(res.meta.requestStatus === 'fulfilled') {
//                   setModals({ ...modals, create: false })
//                   setTitle('')
//                   toast.success('Оборудование создано успешно!')
//                   setUpdate(prev => !prev)
//               } else {
//                 toast.error('Произошла ошибка!')
//               }
//           })
//     } else {
//       setErrors(true)
//     }
//   }

//   return (
//     <Modal open={modals.create} onClose={() => setModals({ ...modals, create: false })}>
//       <Modal.Header>
//         <Modal.Title>Создание оборудования</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className='flex flex-col gap-y-4 px-3 my-4'>
//             <Input
//                 label='Название'
//                 name='title'
//                 placeholder='Введите название'
//                 type='text'
//                 error={errors}
//                 onChange={(e) => setTitle(e.target.value)}
//             />
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//           <div className='flex justify-center gap-x-5'>
//               <Button variant='white' width='200px' onClick={() => setModals({ ...modals, create: false })}>
//                   Отмена
//               </Button>
//               <Button width='200px' onClick={onSubmit}>
//                   Создать
//               </Button>
//           </div>
//       </Modal.Footer>
//     </Modal>
//   )
// }

// export default CreateEquipmentModal
