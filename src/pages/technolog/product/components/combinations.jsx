import React, { useEffect, useState } from 'react'
import Button from '../../../../components/ui/button';
import NewCombination from '../../../../components/modals/product/newCombination';
import { Accordion } from 'rsuite';
import { ExternalLink, MoveRight, Trash2 } from 'lucide-react';
import EditCombinationModal from './modals/combination/editCombinationModal';
import DeleteCombinationModal from './modals/combination/deleteCombinationModal';
import ShowOperationModal from './modals/combination/showOperationInfoModal';

const Combinations = ({ combinations, operations, id_product }) => {

  const [modals, setModals] = useState({ create: false, edit: false, delete: false, operation: false });
  const [editCombination, setEditCombination] = useState({})
  const [showOperations, setShowOperations] = useState({})

  const selectEditCombination = (data) => {
    setModals({ ...modals, edit: true })
    setEditCombination(data)
  }

  const selectDeleteCombination = (data) => {
    setModals({ ...modals, delete: true })
    setEditCombination(data)
  }

  const openOperationModal = (data) => {
    const operation = operations.find(operation => operation.id === data.id);
    setShowOperations(operation);
    setModals({ ...modals, operation: true })
  }

  return (
    <div>
      <div className="flex flex-col gap-y-4 mt-5">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold font-inter">Комбинации</p>
          <Button onClick={() => setModals({ ...modals, create: true })}>+ Создать комбинацию</Button>
        </div>

        <div className="flex flex-col gap-y-6">
          {
            combinations?.length > 0 ?
            combinations?.map((combination, index) => (
                <div className='bg-white rounded-lg'>
                    <Accordion className="border-b border-borderGray rounded-0">
                        <Accordion.Panel header={combination.title}>
                            <div className='flex justify-between mb-3'>
                                <p className="text-base font-semibold font-inter my-2">Операции</p>
                                <div className='flex gap-x-3'>
                                    <Button onClick={() => selectEditCombination(combination)} >Редактировать</Button>
                                    <Button variant='red' onClick={() => selectDeleteCombination(combination)}>Удалить</Button>
                                </div>
                            </div>
                            <div className='w-full flex flex-wrap justify-between gap-4 rounded-md p-1' key={index}>
                                {
                                    combination?.operations?.map((item, index) => (
                                        <div 
                                            className='w-[49%] gap-x-3 flex justify-between items-center justify-between p-2 rounded-sm py-3 bg-[#FAFAFA] cursor-pointer' 
                                            key={index} 
                                        >
                                            <p className="text-sm font-medium font-inter">Название: {item.title}</p>
                                            <div className="pl-1 flex items-center hover:text-cyan-700" onClick={() => openOperationModal(item)}>
                                                <p className='text-sx font-medium font-inter'>Открыть</p>
                                                <ExternalLink size={18} className='ml-2' />
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </Accordion.Panel>
                    </Accordion>
                </div>
            ))
            :
            <p className="text-base font-semibold font-inter text-center my-5">Комбинации отсутствуют</p>
          }
        </div>
      </div>

      {/* Modals */}
      <NewCombination
        modals={modals}
        setModals={setModals}
        operations={operations}
        id_product={id_product}
      />
      <EditCombinationModal
        modals={modals}
        setModals={setModals}
        operations={operations}
        combination={editCombination}
        id_product={id_product}
      />
      <DeleteCombinationModal
        modals={modals}
        setModals={setModals}
        combination={editCombination}
        id_product={id_product}
      />
      <ShowOperationModal
        modals={modals}
        setModals={setModals}
        operation={showOperations}
      />
    </div>
  )
}

export default Combinations
