import React, { useEffect } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import ComingsTable from './components/tables/comingsTable'
import { useDispatch, useSelector } from 'react-redux'
import { getComings } from '../../../store/warehouse/warehouse'

const Comings = () => {

  const breadcrumbs = [
    {
        label: 'Склады',
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

  const { comings_list, comings_list_status } = useSelector(state => state.ware_warehouse);
  
  useEffect(() => {
    if(comings_list?.length === 0 && comings_list_status !== 'success') {
        dispatch(getComings());
    }
  }, [])

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>

        <div className='flex items-center justify-between'>
            <Title text="Приход сырья"/>
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
