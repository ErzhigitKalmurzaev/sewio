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

const OrderCreate = () => {
  const breadcrumbs = [
    { label: 'Заказы', path: '/orders', active: false },
    { label: 'Создание заказа', path: '/orders/create', active: true }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { client_list, product_list, products_to_order  } = useSelector(state => state.order);
  
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

  useEffect(() => {
    if(!client_list) {
      dispatch(getOrderClientList());
    }
    if(!product_list) {
      dispatch(getOrderProductList());
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
      products: !products_to_order?.length > 0,
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
          amounts: item.amounts.flatMap(amount => 
              amount.sizes.map(size => ({
                  color: amount.color,
                  size: size.size,  // Переносим `size` в строку
                  amount: size.amount
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
        <div className='flex gap-x-5'>
          <DataPicker
            width='350px'
            label='Дата сдачи заказа'
            placeholder='Выберите дату'
            value={order.deadline}
            error={error.deadline}
            onChange={e => getMainValue({ target: { name: 'deadline', value: e } })}
          />
          <SelectUser
            width='350px'
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

