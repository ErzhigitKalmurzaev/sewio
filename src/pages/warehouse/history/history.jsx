import React, { useEffect } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getHistory } from '../../../store/warehouse/warehouse'
import HistoryTable from './components/tables/historyTable'

const History = () => {

  const breadcrumbs = [
    {
        label: 'Главная',
        path: '/main',
        active: false
    },
    {
        label: 'История',
        path: '/main/history',
        active: true
    }
  ]

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { history, history_status } = useSelector(state => state.ware_warehouse);
  const { me_info } = useSelector(state => state.auth);
  
  useEffect(() => {
    dispatch(getHistory());
  }, [])
  
  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>

        <div className='flex items-center justify-between'>
            <Title text="История действий"/>
        </div>

        <HistoryTable 
            data={history?.results} 
            status={history_status} 
            meWarehouseId={me_info?.warehouse?.id} 
        />
    </div>
  )
}

export default History
