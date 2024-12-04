import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Title from '../../components/ui/title';
import Input from '../../components/ui/inputs/input';
import Button from '../../components/ui/button';
import MaterialListTable from './components/tables/replenishment/materialListTable';
import CreateMaterialModal from './components/modals/createMaterialModal.';
import { getMyMateralsList } from '../../store/warehouse/materails';
import { Badge } from 'rsuite';
import { getComings } from '../../store/warehouse/warehouse';

const MyWarehouse = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { materials_list, materials_list_status } = useSelector(state => state.ware_materials);
  const { comings_list } = useSelector(state => state.ware_warehouse);
  const { me_info } = useSelector(state => state.auth);
  const [params, setParams] = useSearchParams();

  const urls = {
    search: params?.get("search") || "",
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20,
    is_active: params.get("is_active") || ""
  }

  const [modals, setModals] = useState({ create: false, edit: false });
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    dispatch(getMyMateralsList(urls));
    dispatch(getComings());
  }, [dispatch, update])

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  const searchHandle = () => {
    dispatch(getMyMateralsList(urls));
  }
  
  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <Title text={`Склад: ${me_info?.warehouse?.title}`}/>

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
            <div className='3/6 flex gap-x-3'>
                <Button width='100px' variant='green' onClick={() => navigate('coming')}>
                  <Badge content={comings_list?.length || 0}>Приход</Badge>
                </Button>
                <Button variant='red' onClick={() => navigate('reject')}>Учет брака</Button>
                <Button width='100px' variant='blue' onClick={() => navigate('issue')}>Выдать</Button>
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
                activePage={Number(urls.page || 1)}
                setPage={handleChangeFilter}
                setUpdate={setUpdate}
            />
        </div>

        <CreateMaterialModal
            modals={modals}
            setModals={setModals}
            setUpdate={setUpdate}
        />
    </div>
  )
}

export default MyWarehouse
