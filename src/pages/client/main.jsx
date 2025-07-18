import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMyOrdersList } from '../../store/shveya/operation';
import OrdersTable from './components/tables/ordersTable';

const OrdersList = () => {

  const dispatch = useDispatch();
  const { my_orders_list, my_orders_list_status } = useSelector(state => state.sh_operation);

  const [params, setParams] = useSearchParams();

  const urls = {
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20
  }

  const handleChangeFilter = (value, name) => {
    params.set(name, value);
    setParams(params)
  }

  useEffect(() => {
    dispatch(getMyOrdersList({ urls }))
  }, [urls.page])

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <div className='flex justify-between items-center'>
            <p className='font-semibold font-inter'>Список заказов</p>
        </div>

        <OrdersTable 
            data={my_orders_list} 
            status={my_orders_list_status}
            total={my_orders_list?.count || 0}
            limit={urls.page_size}
            activePage={Number(urls.page)}
            setPage={handleChangeFilter}
        />
    </div>
  )
}

export default OrdersList
