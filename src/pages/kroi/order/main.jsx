import React, { useEffect } from 'react'
import Title from '../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersList } from '../../../store/kroi/order';
import MainTable from './components/tables/mainTable';

const OrdersList = () => {

  const dispatch = useDispatch();

  const { orders_list, orders_list_status } = useSelector(state => state.kroi_order);

  useEffect(() => {
    dispatch(getOrdersList());
  }, [])

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <Title text={`Список заказов`}/>

        <MainTable data={orders_list} status={orders_list_status} />

    </div>
  )
}

export default OrdersList
