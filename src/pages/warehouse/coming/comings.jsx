import React, { useEffect } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import ComingsTable from './components/tables/comingsTable'
import { useDispatch, useSelector } from 'react-redux'
import { getComings } from '../../../store/warehouse/warehouse'
import Button from '../../../components/ui/button'
import { useNavigate } from 'react-router-dom'
import { getColors } from '../../../store/technolog/material'

const Comings = () => {

  const breadcrumbs = [
    {
        label: 'Главная',
        path: '/main',
        active: false
    },
    {
        label: 'Приход сырья',
        path: '/main/coming',
        active: true
    }
  ]

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { comings_list, comings_list_status } = useSelector(state => state.ware_warehouse);
  
  useEffect(() => {
    if(comings_list?.length === 0 && comings_list_status !== 'success') {
        dispatch(getComings());
    }
    dispatch(getColors())
  }, [])

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>

        <div className='flex items-center justify-between'>
            <Title text="Приход сырья"/>
            <Button onClick={() => navigate('history')}>
              История прихода
            </Button>
        </div>

        <div>
            <ComingsTable
                data={comings_list}
                status={comings_list_status}
            />
        </div>
    </div>
  )
}

export default Comings
