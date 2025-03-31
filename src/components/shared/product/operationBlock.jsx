import React, { useState } from 'react';
import Button from '../../ui/button';
import OperationTabs from './operationTabs';
import { ChevronDown } from 'lucide-react';
import EditOperationModal from '../../../pages/technolog/product/components/modals/editOperation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import DeleteOperationModal from '../../../pages/technolog/product/components/modals/deleteOperationModal';

const OperationBlock = ({ operation, index, id_product }) => {

  const dispatch = useDispatch();

  const [collapse, setCollapse] = useState(true);
  const [modals, setModals] = useState({ edit: false, delete: false })

  const activateProduct = () => {

  }

  return (
    <div className={`flex flex-col gap-y-0 py-4 px-6 rounded-lg ${operation.is_active ? 'bg-white' : 'bg-red-100'}`}>
      <div className={`flex justify-between items-center`}>
        <p className='text-base font-semibold font-inter'>Операция: {operation.title}</p>
        <div className='flex gap-x-3'>
          {
            operation.is_active ?
            <Button variant='red' onClick={() => setModals({ ...modals, delete: true })}>Удалить</Button>
            :
            <Button onClick={activateProduct}>Активировать</Button>
          }
          <Button onClick={() => setModals({ ...modals, edit: true })}>Редактировать</Button>
          <Button width='130px' variant='notHover' onClick={() => setCollapse(!collapse)}>
            {collapse ? 'Развернуть' : 'Свернуть'}
            <ChevronDown
              color='white'
              className={`hover:text-white transition-all ease-linear duration-500 ${collapse ? 'rotate-0' : 'rotate-180'}`}
            />
          </Button>
        </div>
      </div>

      {/* Контейнер для плавного сворачивания */}
      <div
        className={`overflow-hidden transition-[max-height] ease-in-out duration-700 ${
          collapse ? 'max-h-0' : 'max-h-screen'
        }`}
        >
        <div className='flex flex-col'>
          <OperationTabs operation={operation} index={index} />
        </div>
      </div>

      {/* Modals */}
      <EditOperationModal modals={modals} setModals={setModals} operation={operation} id_product={id_product} />
      <DeleteOperationModal modals={modals} setModals={setModals} operation={operation} id_product={id_product}/>

    </div>
  );
};

export default OperationBlock;
