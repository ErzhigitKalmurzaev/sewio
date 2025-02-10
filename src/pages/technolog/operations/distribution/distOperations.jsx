// import React, { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate, useParams } from 'react-router-dom';
// import { getOperationList, getStaffsList } from './../../../../store/technolog/operations';
// import Title from '../../../../components/ui/title';
// import Button from '../../../../components/ui/button';
// import DistOperationTable from '../components/tables/distOperationTable';
// import { MoveRight } from 'lucide-react';
// import { toast } from 'react-toastify';
// import SelectStaffsModal from '../components/moduls/selectStaffsModal';

// const DistOperations = () => {

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const { operations_list, operations_list_status, staffs_list, staffs_list_status } = useSelector(state => state.operation);

//   const [operations, setOperations] = useState([]);
//   const [staffs, setStaffs] = useState([]);
//   const [amount, setAmount] = useState('');
//   const [modals, setModals] = useState({ select: false })

//   useEffect(() => {
//     dispatch(getOperationList({ id }));
//     dispatch(getStaffsList());
//   }, [dispatch]);

//   const onNext = () => {
//     if(operations?.length > 0) {
//       setModals({ ...modals, select: true });
//     } else {
//       toast.error('Выберите как минимум 1 операцию!')
//     }
//   }

//   return (
//     <div className='w-full min-h-[100vh] flex flex-col gap-y-6'>
//         <div className='flex justify-between items-center'>
//             <Title text="Операции" />
//         </div>

//         <div>
//             <DistOperationTable 
//               data={operations_list || []} 
//               status={operations_list_status} 
//               setOperations={setOperations}
//               operations={operations}
//             /> 
//         </div>

//         <div className='flex justify-end'>
//           <Button width='150px' onClick={onNext}>
//             Далее <MoveRight className="ml-2" />
//           </Button>
//         </div>

//         <SelectStaffsModal
//           modals={modals}
//           setModals={setModals}
//           staff_list={staffs_list}
//           status={staffs_list_status}
//           staffs={staffs}
//           setStaffs={setStaffs}
//           amount={amount}
//           setAmount={setAmount}
//           operations={operations}
//         />
//     </div>
//   )
// }

// export default DistOperations
