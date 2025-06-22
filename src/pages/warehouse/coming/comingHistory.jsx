import React, { useEffect } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux'
import { getComingHistory } from '../../../store/warehouse/warehouse'
import ComingHistoryTable from './components/tables/comingHistoryTable'
import { useSearchParams } from 'react-router-dom'

const ComingHistory = () => {

  const breadcrumbs = [
    {
        label: 'Главная',
        path: '/main',
        active: false
    },
    {
        label: 'Приход сырья',
        path: '/main/coming',
        active: false
    },
    {
        label: 'История прихода сырья',
        path: '/main/coming/history',
        active: true
    }
  ]

  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();

  const { coming_history, coming_history_status } = useSelector(state => state.ware_warehouse);

  const urls = {
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20
  };
  
  useEffect(() => {
    dispatch(getComingHistory({ page: urls.page, page_size: urls.page_size }));
  }, [urls.page, urls.page_size]);

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>

        <div className='flex items-center justify-between'>
            <Title text="История прихода сырья"/>
        </div>

        <div>
            <ComingHistoryTable
                data={coming_history?.results}
                status={coming_history_status}
                total={coming_history?.count || 0}
                limit={Number(urls.page_size) || 0}
                activePage={Number(urls.page)}
                setPage={handleChangeFilter}
            />
        </div>
    </div>
  )
}

export default ComingHistory
