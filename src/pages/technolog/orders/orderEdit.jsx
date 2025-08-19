import React, { useEffect, useState, forwardRef } from 'react';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import OrderInfoItem from '../../../components/shared/order/orderInfoItem';
import Button from '../../../components/ui/button';
import DataPicker from '../../../components/ui/inputs/dataPicker';
import { useDispatch, useSelector } from 'react-redux';
import { editOrderById, getOrderById } from '../../../store/technolog/order';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { OrderStatuses } from './../../../utils/constants/statuses';
import EditAmountsTable from './components/editAmountsTable';
import { Building, Phone, User } from 'lucide-react';
import BackDrop from '../../../components/ui/backdrop';
import Select from '../../../components/ui/inputs/select';
import { formatedToDDMMYYYY } from '../../../utils/functions/dateFuncs';
import ReactToPrint, { useReactToPrint } from 'react-to-print';
import OrderPrint from './components/OrderPrint';
import { Print } from '@mui/icons-material';
import InvoicePrint from './components/invoicePrint';
import { getWarehouseList } from './../../../store/technolog/warehouse';
import OrderSummary from '../../../components/shared/order/orderSummary';
import { getProductImages } from '../../../store/technolog/product';

const OrderEdit = () => {
  const breadcrumbs = [
    { label: 'Заказы', path: '/orders', active: false },
    { label: 'Редактирование заказа', path: '', active: true }
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { edit_products_in_order, product_list, order_status, order_parties  } = useSelector(state => state.order);
  const { warehouse_list } = useSelector(state => state.warehouse);

  const [order, setOrder] = useState({
    deadline: '',
    client: '',
    products: [],
    status: 1,
    in_warehouse: '',
    out_warehouse: ''
  });
  const [error, setError] = useState({
    deadline: false,
    client: false,
    products: false,
    warehouse: false
  });
  const printCom = false;

  const printRef = React.useRef();
  const invoiceRef = React.useRef();

  const [images, setImages] = useState([])

  useEffect(() => {
    if(edit_products_in_order[0]?.nomenclature) {
      dispatch(getProductImages({ id: edit_products_in_order[0]?.nomenclature })).then(({ payload }) => {
        setImages(payload || []);
      });
    }
  }, [edit_products_in_order[0]?.nomenclature])

  useEffect(() => {
    dispatch(getOrderById({ id}))
        .then(res => {
            if (res.meta.requestStatus === 'fulfilled') {
                setOrder({
                    deadline: res.payload.deadline,
                    client: res.payload.client,
                    products: res.payload.products,
                    status: res.payload.status,
                    in_warehouse: res.payload.in_warehouse?.id,
                    out_warehouse: res.payload.out_warehouse?.id
                });
            }
        })
    if(!warehouse_list) {
      dispatch(getWarehouseList());
    }
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
              productSum + item.sizes.reduce((sizeSum, size) => sizeSum + (order.status === 2 ? size.done : size.amount), 0),
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
              item.sizes.reduce((sizeSum, size) => sizeSum + (order.status === 2 ? size.done : size.amount) * (product.true_price || product.price), 0),
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
              item.sizes.reduce((sizeSum, size) => sizeSum + (order.status === 2 ? size.done : size.amount) * (product.true_cost_price || product.cost_price), 0),
            0
          );
          return total + productCost;
        }, 0);
  
      case "total_time":
        const totalSeconds = edit_products_in_order.reduce((total, product) => {
            const productTotalTime = product.amounts.reduce((sum, colorItem) => {
                return sum + colorItem.sizes.reduce((sizeSum, sizeItem) => {
                    return sizeSum + (product.time * (order.status === 2 ? sizeItem.done : sizeItem.amount));
                }, 0);
            }, 0);
    
            return total + productTotalTime;
        }, 0);
    
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
    
        return `${hours} ч. ${minutes} мин. ${seconds} сек.`;      
      case 'warehouse': 
        return order?.warehouse?.title || '-/-/-'
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
          in_warehouse: order.in_warehouse,
          out_warehouse: order.out_warehouse,
          products: edit_products_in_order.map(item => ({
            ...item,
            true_cost_price: Number(item.true_cost_price) || Number(item.cost_price),
            true_price: Number(item.true_price) || Number(item.price),
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
            } else {
                toast.error('Произошла ошибка!')
            }
          })
    } else {
        toast('Заполните все поля и выберите минимум 1 товар!');
    }
  }
  
  const handlePrint = useReactToPrint({
    documentTitle: `Отчёт о заказе #${id}`,
    contentRef: printRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial;
        }
      }
    `
  })

  const handlePrintInvoice = useReactToPrint({
    documentTitle: `Накладная на заказ #${id}`,
    contentRef: invoiceRef,
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial;
        }
      }
    `
  })

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <div className='flex items-center justify-between'>
        <Title text={`Редактирование заказа #${id}`} />
        <div className='flex gap-x-3'>
          <Button 
            onClick={handlePrint} 
            className='w-max px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            <Print className='mr-2'/>
            Распечатать
          </Button>
          <Button 
            onClick={handlePrintInvoice}
          >
            <Print className='mr-2'/>
            Накладная
          </Button>
        </div>
      </div>
      {
        order_status === 'loading' && <BackDrop />
      }

      <div className='hidden'>
        <OrderPrint ref={printRef} order={order} products={edit_products_in_order} images={images} />
        <InvoicePrint ref={invoiceRef} images={images} productInfo={edit_products_in_order} />
      </div>

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
          <Select
            label='Склад ГП'
            placeholder='Выберите склад'
            value={order.in_warehouse}
            data={warehouse_list || []}
            onChange={e => getMainValue({ target: { name: 'in_warehouse', value: e } })}
            labelKey='title'
            valueKey='id'
          />
          <Select
            label='Склад списания'
            placeholder='Выберите склад'
            value={order.out_warehouse}
            data={warehouse_list || []}
            onChange={e => getMainValue({ target: { name: 'out_warehouse', value: e } })}
            labelKey='title'
            valueKey='id'
          />
          <DataPicker
            label='Дата сдачи заказа'
            placeholder='Выберите дату'
            value={formatedToDDMMYYYY(order?.deadline) || ''}
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

        <OrderSummary getStatistic={getStatistic}/>
      </div>
      <div className='bg-white w-full p-3 rounded-lg shadow-sm'>
        <EditAmountsTable status={order?.status}/>
      </div>
      <div className='flex justify-center'>
        {
          order?.status !== 2 && <Button width='250px' onClick={onSubmit}>Сохранить</Button>
        }
      </div>
    </div>
  );
};

export default OrderEdit;

