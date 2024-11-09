import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import OperationBlock from './../../../../components/shared/product/operationBlock';
import Button from '../../../../components/ui/button';
import CreateOperationModal from './modals/createOperationModal';

const EditOperations = ({ operations }) => {

  const dispatch = useDispatch();

  const [modals, setModals] = useState({ create: false, edit: false });

  return (
    <div>
      <div className="flex flex-col gap-y-4 mt-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold font-inter">Операции</p>
          <Button onClick={() => setModals({ ...modals, create: true })}>+ Создать операцию</Button>
        </div>

        <div className="flex flex-col gap-y-6">
          {
            operations.length > 0 ?
            operations.map((operation, index) => (
              <OperationBlock
                key={index}
                operation={operation}
                index={index}
              />
            ))
            :
            <p className="text-base font-semibold font-inter text-center my-5">Операции отсутствуют</p>
          }
        </div>
      </div>

      {/* Modals */}
      <CreateOperationModal modals={modals} setModals={setModals}/>
    </div>
  )
}

export default EditOperations
