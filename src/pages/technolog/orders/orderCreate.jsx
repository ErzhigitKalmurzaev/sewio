import React, { useEffect, useState } from 'react';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import Input from '../../../components/ui/inputs/input';
import OrderInfoItem from '../../../components/shared/order/orderInfoItem';
import Button from '../../../components/ui/button';
import DataPicker from '../../../components/ui/inputs/dataPicker';
import SelectUser from '../../../components/ui/inputs/selectUser';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderClientList, getOrderProductList } from '../../../store/technolog/order';
import AddProductModal from './modals/addProductModal';
import OrderProductInfo from './components/orderProductInfo';

const OrderCreate = () => {
  const breadcrumbs = [
    { label: 'Заказы', path: '/orders', active: false },
    { label: 'Создание заказа', path: '/orders/create', active: true }
  ];

  const dispatch = useDispatch();
  const { client_list, client_list_status, product_list, product_list_status  } = useSelector(state => state.order);

  const [order, setOrder] = useState({
    deadline: '',
    client: '',
    products: []
  });

  const [selectedClient, setSelectedClient] = useState(null);
  const [modals, setModals] = useState({ add: false, edit: false});

  useEffect(() => {
    dispatch(getOrderClientList());
    dispatch(getOrderProductList());
  }, []);

  useEffect(() => {
    if (order.client) {
      const clientInfo = client_list.find(client => client.id === order.client);
      setSelectedClient(clientInfo);
    }
  }, [order.client, client_list]);

  const getMainValue = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание заказа" />

      <div className='w-full flex gap-x-7'>
        <div className='w-1/2 flex flex-col gap-y-2 bg-white rounded-lg px-8 py-5'>
          <p className='text-base font-bold font-inter mb-3'>Основная информация</p>
          <DataPicker
            label='Дата сдачи заказа'
            placeholder='Выберите дату'
            value={order.deadline}
            onChange={e => getMainValue({ target: { name: 'deadline', value: e } })}
          />
          <SelectUser
            label='Клиент'
            placeholder='Выберите клиента'
            data={client_list || []}
            searchable={true}
            value={order.client}
            onChange={e => getMainValue({ target: { name: 'client', value: e } })}
            valueKey='id'
            labelKey='name'
          />

          {/* Карточка с информацией о клиенте */}
          <div className='p-4 mt-4 border border-borderGray rounded-lg shadow-sm'>
            {selectedClient ? (
              <div className='flex flex-col gap-y-1'>
                <p className='font-inter text-primary'>Имя: {selectedClient.name} {selectedClient.surname}</p>
                <p className='font-inter text-primary'>Email: {selectedClient.email}</p>
                <p className='font-inter text-primary'>Телефон: {selectedClient.phone}</p>
                <p className='font-inter text-primary'>Адрес: {selectedClient.address}</p>
              </div>
            ) : (
              <p className='text-gray-500'>Выберите клиента, чтобы увидеть информацию</p>
            )}
          </div>
        </div>

        <div className='w-1/2 flex flex-col gap-y-4'>
          <div className='flex flex-col gap-y-5 bg-white rounded-lg px-8 py-8'>
            <p className='text-base font-bold font-inter text-center'>Информация о заказе:</p>

            <div className='flex flex-col justify-center gap-y-8'>
              <div className='flex justify-between gap-x-5'>
                <OrderInfoItem label='Общее кол-во:' value={120} measure='шт.' />
                <OrderInfoItem label='Общий доход:' value={12000} measure='сом' />
                <OrderInfoItem label='Общие расходы:' value={12000} measure='сом' />
              </div>
              <div className='flex justify-between gap-x-5'>
                <OrderInfoItem label='Общая прибыль:' value={12000} measure='сом' />
                <OrderInfoItem label='Время выполнения:' value={120} measure='ч' />
                <OrderInfoItem label='Статус заказа:' value='Новый' measure='' />
              </div>
              <div className='flex justify-center'>
                <Button width='250px' onClick={() => setModals({ ...modals, add: true })}>+ Добавить товар</Button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div className='bg-white w-full p-3 rounded-xl'>
        <OrderProductInfo
            products={order.products}
            product_list={product_list}
            modals={modals}
            setModals={setModals}
        />
      </div>
      <AddProductModal
        modals={modals}
        setModals={setModals}
        order={order}
        setOrder={setOrder}
        products={product_list}
        status={product_list_status}
      />
    </div>
  );
};

export default OrderCreate;
