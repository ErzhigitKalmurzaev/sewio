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
import { getSizesList } from '../../../store/technolog/size';
import { getStatistic } from './../../../store/technolog/statistic';
import { OrderStatuses } from './../../../utils/constants/statuses';
import EditAmountsTable from './components/editAmountsTable';
import { Building, Phone, User } from 'lucide-react';

const OrderEdit = () => {
  const breadcrumbs = [
    { label: 'Заказы', path: '/orders', active: false },
    { label: 'Редактирование заказа', path: '', active: true }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { client_list, edit_products_in_order, product_list, edit_order  } = useSelector(state => state.order);

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
    dispatch(getOrderProductList());
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
          
        
          const productCost = product.amounts.reduce((productSum, item) => {
            return productSum + item.amount * product.cost_price;
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
          client: order.client.id,
          products: edit_products_in_order.map(item => ({
            ...item,
            amounts: item.amounts.flatMap(amount => 
                amount.sizes.map(size => ({
                    color: amount.color,
                    size: size.size.id,  // Переносим `size` в строку
                    amount: size.amount
                }))
            )
          })),
        }})).then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
              setOrder({...order, deadline: '', client: '', products: []});
              setSelectedClient(null);
              toast.success('Заказ успешно отредактирован!');
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
            disabled={true}
            onChange={e => getMainValue({ target: { name: 'deadline', value: e } })}
          />

          <div className="border border-borderGray rounded-lg bg-white p-4 shadow-sm text-sm">
              <p className="text-gray-600 font-semibold mb-3">🔹 Информация о заказчике </p>

              {order.client?.id ? (
                <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-3">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="font-medium">{order.client?.name} {order.client?.surname}</p>

                  <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="font-medium">{order.client?.company_title || "Not specified"}</p>

                  <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="font-medium">{order.client?.phone}</p>
                </div>
              ) : (
                <p className="text-gray-500 text-center">No customer selected</p>
              )}
            </div>
        </div>

        <div className='w-1/2 flex flex-col gap-y-4'>
          <div className='flex flex-col gap-y-5 bg-white rounded-lg px-8 py-8'>
            <p className='text-base font-bold font-inter text-center'>Информация о заказе:</p>

            <div className='flex flex-col justify-center gap-y-8'>
              <div className='flex justify-between gap-x-5'>
                <OrderInfoItem label='Общее кол-во:' value={getStatistic('total_count')} measure='шт.' />
                <OrderInfoItem label='Общая сумма:' value={getStatistic('total_income')} measure='сом' />
                <OrderInfoItem label='Общие расходы:' value={getStatistic('total_consumption')} measure='сом' />
              </div>
              <div className='flex justify-between gap-x-5'>
                <OrderInfoItem label='Общая прибыль:' value={getStatistic('total_income') - getStatistic('total_consumption')} measure='сом' />
                <OrderInfoItem label='Время выполнения:' value={getStatistic('total_time').toFixed(1)} measure='ч.' />
                <OrderInfoItem label='Статус заказа:' value={getStatistic('status')} measure='' />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div className='bg-white w-full p-3 rounded-lg'>
        <EditAmountsTable/>
      </div>
      <div className='flex justify-center'>
        <Button width='250px' onClick={onSubmit}>Сохранить</Button>
      </div>
    </div>
  );
};

export default OrderEdit;

