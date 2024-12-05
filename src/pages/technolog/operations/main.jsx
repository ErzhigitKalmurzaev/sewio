import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import Input from '../../../components/ui/inputs/input'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getModerationList, getOrderList } from '../../../store/technolog/order'
import { OrderStatuses } from '../../../utils/constants/statuses'
import OrderListTable from '../../../components/tables/orderTables/OrderListTable'

const Operations = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();
  const { order_list, order_list_status, moderation_list, accept_operation_status } = useSelector(state => state.order);

  const urls = {
    status: params?.get("status") || "",
    search: params?.get("search") || "",
    page: params.get("page") || 1,
    page_size: params.get("page_size") || ""
  };

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  useEffect(() => {
    dispatch(getModerationList())
  }, [])

  useEffect(() => {
    if(!order_list) {
      dispatch(getOrderList({ urls }));
    } else if (accept_operation_status === 'success') {
      dispatch(getOrderList({ urls }));
    }
  }, [urls.status, urls.page, urls.page_size])

  const handleSearch = () => {
    dispatch(getOrderList({ urls }))
  }

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        <div className='flex justify-between items-center'>
            <Title text="Список заказов" />
        </div>

        <div className='flex items-center my-2 gap-x-14'>
            <div className='flex justify-between items-center gap-x-3'>
                {
                    OrderStatuses.map((item, index) => (
                        <Button 
                            key={index} 
                            variant={item.value === urls.status ? 'filterActive' : 'filter'} 
                            onClick={() => handleChangeFilter('status', item.value)}
                        >
                            {item.label}
                        </Button>
                    ))
                }
            </div>
            <div className='w-3/6'>
                <Input 
                    searchicon={true} 
                    placeholder='Поиск по заказчикам' 
                    type="text"
                    value={urls.search}
                    onChange={e => handleChangeFilter('search', e.target.value)}
                    searchHandle={handleSearch}
                />
            </div>
        </div>

        <div>
            <OrderListTable
                data={order_list?.results || []}
                status={order_list_status}
                total={order_list?.count || 0}
                limit={urls.page_size}
                activePage={Number(urls.page)}
                setPage={handleChangeFilter}
                moderation_list={moderation_list}
            />
        </div>
    </div>
  )
}

export default Operations
