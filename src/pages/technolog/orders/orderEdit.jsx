import React, { useEffect, useState } from 'react';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import Input from '../../../components/ui/inputs/input';
import OrderInfoItem from '../../../components/shared/order/orderInfoItem';
import Button from '../../../components/ui/button';
import DataPicker from '../../../components/ui/inputs/dataPicker';
import SelectUser from '../../../components/ui/inputs/selectUser';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, editOrderById, getOrderById } from '../../../store/technolog/order';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderStatuses } from './../../../utils/constants/statuses';
import EditAmountsTable from './components/editAmountsTable';
import { Building, Phone, User } from 'lucide-react';
import BackDrop from '../../../components/ui/backdrop';
import Select from '../../../components/ui/inputs/select';
import { formatedToDDMMYYYY } from '../../../utils/functions/dateFuncs';

const OrderEdit = () => {
  const breadcrumbs = [
    { label: 'Заказы', path: '/orders', active: false },
    { label: 'Редактирование заказа', path: '', active: true }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { edit_products_in_order, product_list, order_status, order_parties  } = useSelector(state => state.order);

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
    dispatch(getOrderById({ id}))
        .then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
                setOrder({
                    deadline: formatedToDDMMYYYY(res.payload.deadline),
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
      case "total_count":
        return edit_products_in_order.reduce((sum, product) => {
          // Суммируем количество всех размеров каждого продукта
          const productTotal = product.amounts.reduce(
            (productSum, item) =>
              productSum + item.sizes.reduce((sizeSum, size) => sizeSum + size.amount, 0),
            0
          );
          return sum + productTotal;
        }, 0);
  
      case "total_income":
        return edit_products_in_order.reduce((total, product) => {
          // Суммируем доход по каждому размеру
          const productIncome = product.amounts.reduce(
            (productSum, item) =>
              productSum +
              item.sizes.reduce((sizeSum, size) => sizeSum + size.amount * (product.true_price || product.price), 0),
            0
          );
          return total + productIncome;
        }, 0);
  
      case "total_consumption":
        return edit_products_in_order.reduce((total, product) => {
          // Суммируем расход по каждому размеру
          const productCost = product.amounts.reduce(
            (productSum, item) =>
              productSum +
              item.sizes.reduce((sizeSum, size) => sizeSum + size.amount * (product.true_cost_price || product.cost_price), 0),
            0
          );
          return total + productCost;
        }, 0);
  
      case "total_time":
        return edit_products_in_order.reduce((total, product) => {
            const productTotalTime = product.amounts.reduce((sum, colorItem) => {
                return sum + colorItem.sizes.reduce((sizeSum, sizeItem) => {
                    return sizeSum + (product.time * sizeItem.amount);
                }, 0);
            }, 0);
    
            return total + productTotalTime;
        }, 0) / 3600;
      case 'status': 
        return OrderStatuses[order?.status]?.label
      default:
        return 0;
    }
  };

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
    if(validateFields() && order?.status) {
        dispatch(editOrderById({ id, props: {
          ...order,
          client: order.client.id,
          status: Number(order.status),
          products: edit_products_in_order.map(item => ({
            ...item,
            amounts: item.amounts.flatMap(amount => 
                amount.sizes.map(size => ({
                    color: amount.color,
                    size: size.size.id,  // Переносим `size` в строку
                    amount: Number(size.amount),
                    done: Number(size.done),
                    defect: Number(size.defect)
                }))
            )
          })),
        }})).then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
              setOrder({...order, deadline: '', client: '', products: []});
              toast.success('Заказ успешно отредактирован!');
              navigate(-1)
            }
          })
    } else {
        toast('Заполните все поля и выберите минимум 1 товар!');
    }
  }

  console.log(order.deadline)

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text={`Редактирование заказа #${id}`} />
      {
        order_status === 'loading' && <BackDrop />
      }

      <div className='w-full flex gap-x-7'>
        <div className='w-1/2 flex flex-col gap-y-2 bg-white rounded-lg px-8 py-5'>
          <p className='text-base font-bold font-inter mb-3'>Основная информация</p>
          <Select
            label='Статус заказа'
            placeholder='Выберите статус'
            value={`${order.status}`}
            data={OrderStatuses.slice(1) || []}
            onChange={e => getMainValue({ target: { name: 'status', value: e } })}
          />
          <DataPicker
            label='Дата сдачи заказа'
            placeholder='Выберите дату'
            value={order.deadline}
            disabled={true}
            onChange={e => getMainValue({ target: { name: 'deadline', value: e } })}
          />

          <div className="border border-borderGray rounded-lg bg-white p-4 shadow-sm text-sm">
              <p className="text-gray-600 font-semibold mb-3">Информация о заказчике </p>

              {order.client?.id ? (
                <div className="grid grid-cols-[auto_1fr] gap-y-2 gap-x-3">
                  <User className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="font-medium font-inter">{order.client?.name} {order.client?.surname}</p>

                  <Building className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="font-medium font-inter">{order.client?.company_title || "Not specified"}</p>

                  <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                  <p className="font-medium font-inter">{order.client?.phone}</p>
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
                <OrderInfoItem label='Время выполнения:' value={getStatistic('total_time')?.toFixed(1) || 0} measure='ч.' />
                <OrderInfoItem label='Статус заказа:' value={getStatistic('status')} measure='' />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <div className='bg-white w-full p-3 rounded-lg shadow-sm'>
        <EditAmountsTable/>
      </div>
      <div className='flex justify-center'>
        <Button width='250px' onClick={onSubmit}>Сохранить</Button>
      </div>
    </div>
  );
};

export default OrderEdit;

