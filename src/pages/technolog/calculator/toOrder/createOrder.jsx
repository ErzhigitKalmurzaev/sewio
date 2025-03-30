import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import DataPicker from '../../../../components/ui/inputs/dataPicker';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll, createOrder, getOrderClientList, getOrderProductList, getProductToOrderById } from '../../../../store/technolog/order';
import Button from '../../../../components/ui/button';
import AmountsTable from '../../orders/components/amountsTable';
import { useNavigate, useParams } from 'react-router-dom';
import SelectUser from '../../../../components/ui/inputs/selectUser';
import BackDrop from '../../../../components/ui/backdrop';
import { toast } from 'react-toastify';

const CreateOrder = () => {

  const breadcrumbs = [
    { label: 'Калкулятор', path: '/calculator', active: false },
    { label: 'Создание заказа', path: '/calculator/order/create', active: true }
  ];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { client_list, product_status, products_to_order } = useSelector(state => state.order);

  const [order, setOrder] = useState({
    deadline: '',
    client: '',
    products: [],
    status: 1
  })
  const [error, setError] = useState({ deadline: false, client: false })

  useEffect(() => {
    if(!client_list) {
      dispatch(getOrderClientList());
    }
    dispatch(getProductToOrderById({ id }))
  }, []);

  const validateFields = () => {
    const newErrors = {
      deadline: !order.deadline,
      client: !order.client,
    };

    setError(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
        dispatch(createOrder({
            ...order,
            products: products_to_order.map(item => ({
              ...item,
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
              navigate('/crm/orders')
            } else {
                toast.error('Произошла ошибка! Проверьте и заполните все поля правильно!')
            }
          })
        // console.log({
        //       ...order,
        //       products: products_to_order.map(item => ({
        //         ...item,
        //         amounts: item.amounts.flatMap(amount => 
        //             amount.sizes.map(size => ({
        //                 color: amount.color,
        //                 size: size.size,  // Переносим `size` в строку
        //                 amount: size.amount
        //             }))
        //         )
        //       })),
        // })
    } else {
      toast.error('Заполните все поля и выберите минимум 1 товар!');
    }
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание заказа" />

      {
        product_status === 'loading' && <BackDrop open={true}/>
      }
      
      <div className='w-full h-auto bg-white flex flex-col gap-y-5 p-6 rounded-lg'>
        <div className='flex gap-x-5'>
          <DataPicker
            width='350px'
            label='Дата сдачи заказа'
            placeholder='Выберите дату'
            value={order.deadline}
            error={error.deadline}
            onChange={e => setOrder({ ...order, deadline: e })}
          />
          <SelectUser
            width='350px'
            label='Клиент'
            placeholder='Выберите клиента'
            data={client_list || []}
            searchable={true}
            value={order.client}
            error={error.client}
            onChange={e => setOrder({ ...order, client: e })}
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
  )
}

export default CreateOrder
