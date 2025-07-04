import React from 'react';
import { CircleDollarSign, Activity, Clock4, ShoppingCart, FileText, TrendingUp } from 'lucide-react';
import OrderInfoItem from './orderInfoItem';

const OrderSummary = ({ getStatistic }) => {
  const stats = [
    {
      label: 'Общее кол-во',
      value: getStatistic('total_count'),
      measure: 'шт.',
      icon: <ShoppingCart size={20} className="text-blue-600" />
    },
    {
      label: 'Общая сумма',
      value: getStatistic('total_income'),
      measure: 'сом',
      icon: <CircleDollarSign size={20} className="text-green-600" />
    },
    {
      label: 'Расходы',
      value: getStatistic('total_consumption'),
      measure: 'сом',
      icon: <FileText size={20} className="text-red-500" />
    },
    {
      label: 'Прибыль',
      value: getStatistic('total_income') - getStatistic('total_consumption'),
      measure: 'сом',
      icon: <TrendingUp size={20} className="text-emerald-600" />
    },
    {
      label: 'Время выполнения',
      value: getStatistic('total_time')?.toFixed(1) || 0,
      measure: 'ч.',
      icon: <Clock4 size={20} className="text-indigo-600" />
    }
  ];

  return (
    <div className="w-full md:w-2/3 xl:w-1/2 mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col gap-6">
        <p className="text-lg font-bold font-inter text-center text-gray-800">
          Информация о заказе
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((item, index) => (
            <OrderInfoItem
              key={index}
              label={item.label}
              value={item.value}
              measure={item.measure}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
