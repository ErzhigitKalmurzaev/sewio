import React, { useEffect } from 'react'
import Title from '../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersList } from '../../../store/kroi/order';
import MainTable from './components/tables/mainTable';
import Button from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';

const OrdersList = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders_list, orders_list_status } = useSelector(state => state.kroi_order);

  useEffect(() => {
    dispatch(getOrdersList());
  }, [])

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <div className='flex justify-between items-center'>
            <Title text="Список заказов" />
            <div className='flex gap-x-5'>
                <Button onClick={() => navigate('history')}>История партий</Button>
            </div>
        </div>

        <MainTable data={orders_list} status={orders_list_status} />

    </div>
  )
}

export default OrdersList
