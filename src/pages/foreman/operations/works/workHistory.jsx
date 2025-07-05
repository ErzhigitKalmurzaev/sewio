import React, { useEffect } from 'react'
import Title from '../../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { getWorksHistory } from '../../../../store/foreman/order'
import WorksHistoryTable from '../components/tables/worksHistoryTable'
import MyBreadcrums from '../../../../components/ui/breadcrums'

const WorkHistory = () => {

  const { orderId, id } = useParams();   
  
  const breadcrumbs = [
      { label: 'Главная', path: '/operations', active: false },
      { label: 'Прием работы', path: `/operations/${orderId}/${id}`, active: false },
      { label: 'Исторя приемов работы', path: `/operations/${orderId}/${id}/history`, active: true },
  ];

  const dispatch = useDispatch();
  const { works_history, works_history_status } = useSelector(state => state.foreman_order);
  const { me_info } = useSelector(state => state.auth);


  useEffect(() => {
    dispatch(getWorksHistory({ product: id, order: orderId }));
  }, [orderId, id]);


  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <MyBreadcrums items={me_info?.role === 7 ? breadcrumbs.filter((e, i) => i !== 1) : breadcrumbs} />
        <p className='text-lg font-inter font-semibold'>История приемов работы</p>

        <WorksHistoryTable
          data={works_history}
          status={works_history_status}
        />
    </div>
  )
}

export default WorkHistory
