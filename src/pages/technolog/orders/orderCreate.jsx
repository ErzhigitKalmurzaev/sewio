import React, { useEffect, useState } from 'react';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import Input from '../../../components/ui/inputs/input';
import OrderInfoItem from '../../../components/shared/order/orderInfoItem';
import Button from '../../../components/ui/button';
import DataPicker from '../../../components/ui/inputs/dataPicker';
import SelectUser from '../../../components/ui/inputs/selectUser';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll, createOrder, getOrderClientList, getOrderProductList } from '../../../store/technolog/order';
import AddProductModal from './modals/addProductModal';
import OrderProductInfo from './components/orderProductInfo';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderStatuses } from '../../../utils/constants/statuses';
import AmountsTable from './components/amountsTable';
import Select from '../../../components/ui/inputs/select';
import { getWarehouseList } from '../../../store/technolog/warehouse';

const OrderCreate = () => {
  const breadcrumbs = [
    { label: 'Заказы', path: '/orders', active: false },
    { label: 'Создание заказа', path: '/orders/create', active: true }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client_list, product_list, products_to_order  } = useSelector(state => state.order);
  const { warehouse_list } = useSelector(state => state.warehouse);
  
  const [order, setOrder] = useState({
    deadline: '',
    client: '',
    in_warehouse: '',
    out_warehouse: '',
    products: [],
    status: 1
  });
  const [error, setError] = useState({
    deadline: false,
    client: false,
    products: false,
    warehouse: false
  });

  useEffect(() => {
    if(!client_list) {
      dispatch(getOrderClientList());
    }
    if(!product_list) {
      dispatch(getOrderProductList());
    }
    if(!warehouse_list) {
      dispatch(getWarehouseList())
    }
    dispatch(clearAll());
  }, []);

  useEffect(() => {
    if (order.client) {
      const clientInfo = client_list.find(client => client.id === order.client);
    }
  }, [order.client, client_list]);

  const getMainValue = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const newErrors = {
      deadline: !order.deadline,
      client: !order.client,
      products: !products_to_order?.length > 0 && !products_to_order?.some(item => item?.amounts?.length > 0 && item?.amounts?.some(amount => amount?.sizes?.length > 0)),
    };

    setError(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
      dispatch(createOrder({
        ...order,
        products: products_to_order?.map(item => ({
          ...item,
          price: item?.price || item?.cost_price,
          amounts: item.amounts?.flatMap(amount => 
              amount?.sizes?.map(size => ({
                  color: amount?.color,
                  size: size?.size,  // Переносим `size` в строку
                  amount: size?.amount || 0
              }))
          )
        })),
        deadline: new Date(order.deadline.split('.').reverse().join('-')).toISOString()
      })).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(clearAll())
          setOrder({...order, deadline: '', client: '', products: []});
          navigate(-1)
        } else {
            toast.error('Произошла ошибка! Проверьте и заполните все поля правильно!')
        }
      })
    } else {
      toast('Заполните все поля и выберите минимум 1 товар!');
    }
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание заказа" />

      
      <div className='w-full h-auto bg-white flex flex-col gap-y-5 p-6 rounded-lg'>
        <div className='flex gap-x-8'>
          <DataPicker
            width='300px'
            label='Дата сдачи заказа'
            placeholder='Выберите дату'
            value={order.deadline}
            error={error.deadline}
            onChange={e => getMainValue({ target: { name: 'deadline', value: e } })}
          />
          <SelectUser
            width='300px'
            label='Клиент'
            placeholder='Выберите клиента'
            data={client_list || []}
            searchable={true}
            value={order.client}
            error={error.client}
            onChange={e => getMainValue({ target: { name: 'client', value: e } })}
            valueKey='id'
            labelKey='name'
            className={'mb-1'}
          />
          <Select
            width='300px'
            label='Склад ГП'
            placeholder='Выберите склад'
            data={warehouse_list}
            onChange={e => getMainValue({ target: { name: 'in_warehouse', value: e } })}
            value={order.in_warehouse}
            valueKey='id'
            labelKey='title'
            className={'mb-1'}
          />
          <Select
            width='300px'
            label='Склад списания'
            placeholder='Выберите склад'
            data={warehouse_list}
            onChange={e => getMainValue({ target: { name: 'out_warehouse', value: e } })}
            value={order.out_warehouse}
            valueKey='id'
            labelKey='title'
            className={'mb-1'}
          />
        </div>

        <AmountsTable/>
      </div>

      <div className='flex justify-center items-center gap-x-5'>
        <Button width={'180px'} onClick={onSubmit}>Создать</Button>
      </div>
    </div>
  );
};

export default OrderCreate;

