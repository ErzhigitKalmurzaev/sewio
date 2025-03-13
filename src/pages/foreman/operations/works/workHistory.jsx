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
      { label: 'Исторя работ', path: `/operations/${orderId}/${id}/history`, active: true },
  ];

  const dispatch = useDispatch();
  const { works_history, works_history_status } = useSelector(state => state.foreman_order);
  const [params, setParams] = useSearchParams();

  const urls = {
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20
  }

  useEffect(() => {
    dispatch(getWorksHistory({ page: urls.page, page_size: urls.page_size }));
  }, [urls.page, urls.page_size])

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <MyBreadcrums items={breadcrumbs} />
        <p className='text-lg font-inter font-semibold'>История работ</p>

        <WorksHistoryTable
          data={works_history}
          status={works_history_status}
          urls={urls}
          handleChangeFilter={handleChangeFilter}
        />
    </div>
  )
}

export default WorkHistory
