import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import { getMateralList } from '../../../store/technolog/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import RejectMaterialsTable from '../components/tables/reject/rejectMaterialsTable'
import SelectRejectMaterialModal from '../components/modals/selectRejectMaterialModal'

const RejectMaterials = () => {

  const breadcrumbs = [
    {
        label: 'Склады',
        path: '/sklad',
        active: false
    },
    {
        label: 'Учет брака',
        path: '/sklad/repleshipment',
        active: true
    }
  ]

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { materials_list, materials_list_status } = useSelector(state => state.material);

  const [modals, setModals] = useState({ select: false, create: false });
  const [search, setSearch] = useState('');
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    dispatch(getMateralList({ title: search }))
  }, [modals.create]);

  const handleSearch = () => {
    dispatch(getMateralList({ title: search }))
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        
        <div className='flex items-center justify-between'>
            <Title text="Учет брака"/>
            <div className='2/6'>
                <Button onClick={() => setModals({ ...modals, select: true })}>+ Добавить материал</Button>
            </div>
        </div>

        <div className='mt-2'>
            <RejectMaterialsTable
                data={materials}
            />
        </div>

        <SelectRejectMaterialModal
            modals={modals}
            setModals={setModals}
            materials_list={materials_list}
            status={materials_list_status}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            materials={materials}
            setMaterials={setMaterials}
        />
    </div>
  )
}

export default RejectMaterials
