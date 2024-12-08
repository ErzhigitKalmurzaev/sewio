import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import Input from '../../../components/ui/inputs/input'
import { useDispatch, useSelector } from 'react-redux'
import { getEquipmentList } from '../../../store/technolog/equipment'
import { useEffect, useState } from 'react'
import EquipmentsTable from './tables/equipmentsTable'
import { useNavigate } from 'react-router-dom'

const Equipments = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { equipment_list, equipment_list_status } = useSelector(state => state.equipment);

  const [modals, setModals] = useState({ create: false, edit: false, delete: false });
  const [editEquipment, setEditEquipment] = useState({});
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    dispatch(getEquipmentList())
  }, [update])

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        
        <div className='flex justify-between items-center'>
            <Title text="Оборудование" />
            <div className='flex gap-x-5'>
                <Button onClick={() => navigate('create')}>+ Создать оборудование</Button>
            </div>
        </div>

        <div className='mt-3'>
            <EquipmentsTable
                data={equipment_list}
                status={equipment_list_status}
                modals={modals}
                setModals={setModals}
                setEditEquipment={setEditEquipment}
            />
        </div>

    </div>
  )
}

export default Equipments
