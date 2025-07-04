import React from 'react';
import { formatNumber } from '../../../utils/functions/numFuncs';

const OrderInfoItem = ({ label, value, measure, icon }) => {
  const displayValue = (measure !== '' && measure !== 'ч.') ? formatNumber(value) : value;

  return (
    <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl shadow-sm border border-borderGray hover:shadow-md transition">
      <div className="mt-1">{icon}</div>
      <div className="flex flex-col">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-base font-semibold text-gray-900">
          {displayValue} <span className="text-sm text-gray-500">{measure}</span>
        </p>
      </div>
    </div>
  );
};

export default OrderInfoItem;
