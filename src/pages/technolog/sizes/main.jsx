import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import SizeTable from '../../../components/tables/sizes/sizeTable';
import { useDispatch, useSelector } from 'react-redux';
import { getSizeCategoryList } from '../../../store/technolog/size';
import CreateCategory from './modals/createCategory';
import CreateSize from './modals/createSize';
import EditCategory from './modals/EditCategory';

const Sizes = () => {

  const dispatch = useDispatch();
  const { size_category_list, size_category_list_status } = useSelector(state => state.size);
  
  const [modals, setModals] = useState({ create_category: false, create_size: false, edit: false });
  const [editSize, setEditSize] = useState({})

  useEffect(() => {
    dispatch(getSizeCategoryList());
  }, [modals.edit])

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
      <div className='flex justify-between items-center'>
          <Title text="Размеры" />
          <div className='flex gap-x-5'>
              <Button onClick={() => setModals({...modals, create_category: true})}>+ Создать категорию</Button>
              <Button onClick={() => setModals({...modals, create_size: true})}>+ Создать размер</Button>
          </div>
      </div>   

      <div className='mt-3'>
        <SizeTable 
          data={size_category_list}
          modals={modals}
          setModals={setModals}
          setEditSize={setEditSize}
          status={size_category_list_status}
        />
      </div>

      {/* Modals */}

      <CreateCategory modals={modals} setModals={setModals}/>
      <EditCategory modals={modals} setModals={setModals} data={editSize} />
      <CreateSize modals={modals} setModals={setModals} categories={size_category_list} />

    </div>
  )
}

export default Sizes
