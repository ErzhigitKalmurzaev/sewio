import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import Input from '../../../components/ui/inputs/input'
import { useDispatch, useSelector } from 'react-redux'
import { getMyOperationList } from '../../../store/shveya/operation'
import OperationsTable from './components/tables/operationsTable'
import InputDoneModal from './components/modals/inputDoneModal'

const MyOperations = () => {

  const dispatch = useDispatch();

  const { operations_list, operations_list_status } = useSelector(state => state.sh_operation);

  const [modals, setModals] = useState({ input: false });
  const [operation, setOperation] = useState({});
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    dispatch(getMyOperationList());
  }, [update])

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <Title text={`Операции`}/>

        <OperationsTable 
          data={operations_list} 
          status={operations_list_status}
          setOperation={setOperation}
          setModals={setModals}
        />
        
        <InputDoneModal
          modals={modals}
          setModals={setModals}
          operation={operation}
          setUpdate={setUpdate}
        />
    </div>
  )
}

export default MyOperations
