import { useEffect } from 'react'
import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getOrdersList } from '../../../store/kroi/order'
import MainTable from '../../kroi/order/components/tables/mainTable'

const ForemanMain = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders_list, orders_list_status } = useSelector(state => state.kroi_order);

  useEffect(() => {
    dispatch(getOrdersList());
  }, [])
  
  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-5'>
        <div className='flex justify-between items-center'>
            <p className='text-base font-inter font-semibold'>List of orders</p>
            <div className='flex gap-x-5'>
                {/* <Button onClick={() => navigate('history')}>История партий</Button> */}
            </div>
        </div>

        <MainTable data={orders_list} status={orders_list_status} />

    </div>
  )
}

export default ForemanMain
