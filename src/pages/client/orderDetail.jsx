import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getMyOrderById } from '../../store/shveya/operation';
import dayjs from 'dayjs';
import { OrderStatuses } from '../../utils/constants/statuses';
import { BadgeCheck, Clock, CalendarDays } from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { my_order } = useSelector((state) => state.sh_operation);

  useEffect(() => {
    dispatch(getMyOrderById({ id }));
  }, [dispatch, id]);

  if (!my_order)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Загрузка данных...
      </div>
    );

  return (
    <div className="p-1 md:p-6 max-w-4xl mx-auto text-sm md:text-base">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
        Заказ #{my_order.id}
      </h1>

      <div className="bg-white rounded-xl shadow p-4 mb-4 space-y-2 border border-borderGray">
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-medium">Создан:</span>
          {dayjs(my_order.created_at).format('DD.MM.YYYY HH:mm')}
        </div>
        <div className="flex items-center gap-2 text-gray-700">
          <span className="font-medium">Дедлайн:</span>
          {dayjs(my_order.deadline).format('DD.MM.YYYY')}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">Статус:</span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              my_order.status === 3
                ? 'bg-green-100 text-green-700'
                : my_order.status === 2
                ? 'bg-blue-100 text-blue-700'
                : my_order.status === 1
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {OrderStatuses[my_order.status].label}
          </span>
        </div>
      </div>

      {my_order.products?.map((product, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow p-3 mb-6 border border-borderGray"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            {product.nomenclature?.title}
          </h2>
          <div className="flex items-end justify-between mb-3 text-gray-700">
            <p>
              <span className="font-medium">Артикул:</span>{' '}
              {product.nomenclature?.vendor_code}
            </p>
            <p>
              <span className="font-medium">Цена:</span> {product.true_price || product.price} сом
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-borderGray">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-2 py-2 border border-borderGray">Размер</th>
                  <th className="px-2 py-2 border border-borderGray">Цвет</th>
                  <th className="px-2 py-2 border border-borderGray">План</th>
                  <th className="px-2 py-2 border border-borderGray">Крой</th>
                  <th className="px-2 py-2 border border-borderGray">Готово</th>
                </tr>
              </thead>
              <tbody>
                {product.amounts?.map((amt, i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="px-1 py-2 border border-borderGray">{amt.size?.title}</td>
                    <td className="px-1 py-2 border border-borderGray">
                      <div className="flex items-center gap-1">
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-borderGray"
                          style={{ backgroundColor: amt.color?.code }}
                        ></span>
                        <span className='text-xs'>{amt.color?.title}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 border border-borderGray">{amt.amount}</td>
                    <td className="px-2 py-2 border border-borderGray">{amt.cut}</td>
                    <td className="px-2 py-2 border border-borderGray">{amt.done}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderDetail;
