import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import SizeTable from '../../../components/tables/sizes/sizeTable';
import { useDispatch, useSelector } from 'react-redux';
import { getSizesList } from '../../../store/technolog/size';
import CreateSize from './modals/createSize';
import EditSize from './modals/editSize';
import DeleteSize from './modals/deleteSize';

const Sizes = () => {

  const dispatch = useDispatch();
  const { sizes_list, sizes_list_status } = useSelector(state => state.size);
  
  const [modals, setModals] = useState({ create_category: false, create: false, edit: false, id: null });

  useEffect(() => {
    dispatch(getSizesList());
  }, [])

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
      <div className='flex justify-between items-center'>
          <Title text="Размеры" />
          <div className='flex gap-x-5'>
              <Button onClick={() => setModals({...modals, create: true})}>+ Создать размер</Button>
          </div>
      </div>   

      <div className='mt-3'>
        <SizeTable 
          data={sizes_list}
          modals={modals}
          setModals={setModals}
          status={sizes_list_status}
        />
      </div>

      {/* Modals */}
      <CreateSize modals={modals} setModals={setModals} />
      <EditSize modals={modals} setModals={setModals} />
      <DeleteSize modals={modals} setModals={setModals} />
    </div>
  )
}

export default Sizes
