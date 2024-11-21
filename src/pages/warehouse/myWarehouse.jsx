import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Title from '../../components/ui/title';
import Input from '../../components/ui/inputs/input';
import Button from '../../components/ui/button';
import MaterialListTable from './components/tables/replenishment/materialListTable';
import CreateMaterialModal from './components/modals/createMaterialModal.';
import { getMyMateralsList } from '../../store/warehouse/materails';

const MyWarehouse = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { materials_list, materials_list_status } = useSelector(state => state.ware_materials);
  const [params, setParams] = useSearchParams();

  const urls = {
    search: params?.get("search") || "",
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20,
    is_active: params.get("is_active") || ""
  }

  const [modals, setModals] = useState({ create: false, edit: false });

  useEffect(() => {
    dispatch(getMyMateralsList(urls));
  }, [])

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  const searchHandle = () => {
    dispatch(getMyMateralsList(urls));
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <Title text="Склад №12"/>

        <div className='flex items-start justify-between my-2 gap-x-6'>
            <div className='w-3/6'>
                <Input 
                    searchicon={true} 
                    placeholder='Поиск по названию или артикулу' 
                    type="text"
                    onChange={(e) => handleChangeFilter("search", e.target.value)}
                    value={urls.search}
                    searchHandle={searchHandle}
                />
            </div>
            <div className='2/6 flex gap-x-3'>
                <Button variant='red' onClick={() => navigate('reject')}>Учет брака</Button>
                <Button variant='white' onClick={() => navigate('fill')}>Пополнение</Button>
                <Button onClick={() => setModals({ ...modals, create: true })}>+ Создать материал</Button>
            </div>
        </div>

        <div className='mt-2'>
            <MaterialListTable 
                data={materials_list?.results || []} 
                status={materials_list_status} 
                modals={modals}
                setModals={setModals}
                total={materials_list?.count || 0}
                limit={urls.page_size}
                activePage={urls.page}
                setPage={handleChangeFilter}
            />
        </div>

        <CreateMaterialModal
            modals={modals}
            setModals={setModals}
        />
    </div>
  )
}

export default MyWarehouse
