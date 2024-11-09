import React from 'react';
import Button from '../../ui/button';
import OperationTabs from './operationTabs';
import { ChevronDown } from 'lucide-react';

const OperationBlock = ({ operation, index }) => {
  const [collapse, setCollapse] = React.useState(false);

  return (
    <div className='flex flex-col gap-y-3 bg-white py-4 px-6 rounded-lg'>
      <div className={`flex justify-between items-center`}>
        <p className='text-base font-semibold font-inter'>Операция: {operation.name}</p>
        <div className='flex gap-x-3'>
          <Button variant='red'>Удалить</Button>
          <Button>Редактировать</Button>
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
      {/* <div
        className={`overflow-hidden transition-[max-height] ease-in-out duration-700 ${
          collapse ? 'max-h-0' : 'max-h-screen'
        }`}
      >
        <div className='flex flex-col gap-y-4'>
          <OperationTabs newOperation={operation} setNewOperation={setNewProduct} />
        </div>
      </div> */}
    </div>
  );
};

export default OperationBlock;
