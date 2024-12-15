import React, { useEffect, useState } from 'react';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import Input from '../../../components/ui/inputs/input';
import OrderInfoItem from '../../../components/shared/order/orderInfoItem';
import Button from '../../../components/ui/button';
import DataPicker from '../../../components/ui/inputs/dataPicker';
import SelectUser from '../../../components/ui/inputs/selectUser';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, editOrderById, getOrderById, getOrderClientList, getOrderProductList } from '../../../store/technolog/order';
import AddProductModal from './modals/addProductModal';
import OrderProductInfo from './components/orderProductInfo';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getSizeCategoryList } from '../../../store/technolog/size';
import { getStatistic } from './../../../store/technolog/statistic';
import { OrderStatuses } from './../../../utils/constants/statuses';

const OrderEdit = () => {
  const breadcrumbs = [
    { label: 'Заказы', path: '/orders', active: false },
    { label: 'Редактирование заказа', path: '', active: true }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { client_list, client_list_status, product_list, product_list_status  } = useSelector(state => state.order);
  const { size_category_list } = useSelector(state => state.size);

  const [order, setOrder] = useState({
    deadline: '',
    client: '',
    products: [],
    status: 1
  });
  const [error, setError] = useState({
    deadline: false,
    client: false,
    products: false
  });

  const [selectedClient, setSelectedClient] = useState(null);
  const [modals, setModals] = useState({ add: false, edit: false});

  useEffect(() => {
    dispatch(getOrderClientList());
    dispatch(getOrderProductList());
    dispatch(getSizeCategoryList());
    dispatch(getOrderById({ id}))
        .then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
                setOrder({
                    deadline: res.payload.deadline,
                    client: res.payload.client,
                    products: res.payload.products,
                    status: res.payload.status
                });
            }
        })

  }, []);

  useEffect(() => {
    if (order.client) {
      const clientInfo = client_list?.find(client => client.id === order.client);
      setSelectedClient(clientInfo);
    }
  }, [order.client, client_list]);

  const getMainValue = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };
  
  const getStatistic = (type) => {
    switch (type) {
      case 'total_count':
        return order.products.reduce((sum, product) => {
          const productTotal = product.amounts.reduce((productSum, item) => productSum + item.amount, 0);
          return sum + productTotal;
        }, 0);
      case 'total_income': 
        return order.products.reduce((total, product) => {
          const productIncome = product.amounts.reduce((productSum, item) => {
            return productSum + item.amount * product.price; // Умножаем amount на price
          }, 0);
          return total + productIncome;
        }, 0);
      case 'total_consumption':
        return order?.products?.reduce((total, product) => {
          // Найти продукт по nomenclature в массиве productDetails
          const productDetail = product_list?.find(
            (detail) => detail.id === product.nomenclature
          );
        
          if (!productDetail) {
            return total;
          }
        
          const productCost = product.amounts.reduce((productSum, item) => {
            return productSum + item.amount * productDetail.cost_price;
          }, 0);
        
          return total + productCost;
        }, 0);
      case 'total_time': 
        return order?.products?.reduce((total, product) => {
          // Найти товар в productDetails
          const productDetail = product_list?.find(
            (detail) => detail.id === product.nomenclature
          );
        
          if (!productDetail) {
            return total;
          }
        
          const productTime = product?.amounts?.reduce((productSum, item) => {
            return productSum + item.amount * productDetail.time; // Умножаем количество на время
          }, 0);
        
          return total + productTime;
        }, 0) / 3600;
      case 'status': 
        return OrderStatuses[order?.status]?.label
      default:
        return 0;
    }

  }

  const validateFields = () => {
    const newErrors = {
      deadline: !order.deadline,
      client: !order.client,
      products: !order.products?.length > 0,
    };

    setError(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
        dispatch(editOrderById({ id, props: {
            ...order,
            deadline: new Date(order.deadline.split('.').reverse().join('-')).toISOString()
          }})).then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
              setOrder({...order, deadline: '', client: '', products: []});
              setSelectedClient(null);
              navigate(-1)
            }
          })
    } else {
        toast('Заполните все поля и выберите минимум 1 товар!');
    }
  }


  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text={`Редактирование заказа #${id}`} />

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
                <OrderInfoItem label='Общее кол-во:' value={getStatistic('total_count')} measure='шт.' />
                <OrderInfoItem label='Общий доход:' value={getStatistic('total_income')} measure='сом' />
                <OrderInfoItem label='Общие расходы:' value={getStatistic('total_consumption')} measure='сом' />
              </div>
              <div className='flex justify-between gap-x-5'>
                <OrderInfoItem label='Общая прибыль:' value={getStatistic('total_income') - getStatistic('total_consumption')} measure='сом' />
                <OrderInfoItem label='Время выполнения:' value={getStatistic('total_time').toFixed(1)} measure='ч.' />
                <OrderInfoItem label='Статус заказа:' value={getStatistic('status')} measure='' />
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
            order={order}
            setOrder={setOrder}
            size_category_list={size_category_list}
        />
      </div>
      <div className='flex justify-center'>
        <Button width='250px' onClick={onSubmit}>Сохранить</Button>
      </div>
      <AddProductModal
        modals={modals}
        setModals={setModals}
        order={order}
        size_category_list={size_category_list}
        setOrder={setOrder}
        products={product_list}
        status={product_list_status}
      />
    </div>
  );
};

export default OrderEdit;
