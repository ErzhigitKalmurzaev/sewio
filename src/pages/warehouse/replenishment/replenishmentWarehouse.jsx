import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import InputMaterialsTable from '../components/tables/replenishment/inputMaterialsTable'
import { getColors, getMateralList } from '../../../store/technolog/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SelectMaterial from '../components/modals/selectMaterial'
import CreateMaterial from '../components/modals/createMaterial'
import InputRollMaterialsTable from '../components/tables/replenishment/InputRollMaterialsTable'

const ReplenishmentWarehouse = () => {

  const breadcrumbs = [
    {
        label: 'Склады',
        path: '/main',
        active: false
    },
    {
        label: 'Заполнение склада',
        path: '/main/repleshipment',
        active: true
    }
  ]

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { materials_list, materials_list_status } = useSelector(state => state.material);

  const [modals, setModals] = useState({ select: true, create: false });
  const [search, setSearch] = useState('');
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    dispatch(getMateralList({ title: search }))
    dispatch(getColors());
  }, [modals.create]);

  const handleSearch = () => {
    dispatch(getMateralList({ title: search }))
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        
        <div className='flex items-center justify-between'>
            <Title text="Пополнение склада"/>
            <div className='2/6'>
                <Button onClick={() => setModals({ ...modals, select: true })}>+ Добавить материал</Button>
            </div>
        </div>

        <div className='mt-2'>
            {
              materials.find(item => item.unit === 6) ? 
              <InputRollMaterialsTable materials={materials}/> :
              <InputMaterialsTable
                data={materials}
              />
            }
        </div>

        <SelectMaterial
            modals={modals}
            setModals={setModals}
            materials_list={materials_list}
            status={materials_list_status}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            setMaterials={setMaterials}
        />
        <CreateMaterial
            modals={modals}
            setModals={setModals}
        />
    </div>
  )
}

export default ReplenishmentWarehouse
