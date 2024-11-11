import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OperationBlock from '../../../../components/shared/product/operationBlock';
import Button from '../../../../components/ui/button';
import CreateOperationModal from './modals/createOperationModal';
import { getRankList } from '../../../../store/technolog/rank';
import { getEquipmentList } from '../../../../store/technolog/equipment';

const EditOperations = ({ operations, id_product }) => {

  const { rank_list } = useSelector(state => state.rank);
  const { equipment_list } = useSelector(state => state.equipment);

  const dispatch = useDispatch();

  useEffect(() => {
    if(!rank_list) dispatch(getRankList());
    if(!equipment_list) dispatch(getEquipmentList());
  }, [])

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
            operations?.length > 0 ?
            operations?.map((operation, index) => (
              <OperationBlock
                key={index}
                operation={operation}
                index={index}
                id_product={id_product}
              />
            ))
            :
            <p className="text-base font-semibold font-inter text-center my-5">Операции отсутствуют</p>
          }
        </div>
      </div>

      {/* Modals */}
      <CreateOperationModal modals={modals} setModals={setModals} id_product={id_product}/>
    </div>
  )
}

export default EditOperations
