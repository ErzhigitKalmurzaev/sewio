import React from 'react';
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';
import { formatNumber } from '../../../../../utils/functions/numFuncs';

const SalaryDetailTable = ({ data, status }) => {
  const calculateTotal = (items) => items.reduce((total, item) => total + item.amount, 0);

  return (
    <div className="w-[350px] bg-[#EDEDED] rounded-xl border border-borderGray">
      {status === 1 && (
        <>
          <h3 className="text-lg font-bold mb-2 px-4 pt-2">Операции</h3>
          {/* Пример для операций */}
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto bg-white text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">ID</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Название</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Количество</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Сумма (сом)</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Дата</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((op) => (
                  <tr key={op.id} className="bg-green-50">
                    <td className="border border-borderGray px-2 sm:px-4 py-2">{op.id}</td>
                    <td className="border border-borderGray px-2 sm:px-4 py-2">{op.name}</td>
                    <td className="border border-borderGray px-2 sm:px-4 py-2">{op.quantity}</td>
                    <td className="border border-borderGray px-2 sm:px-4 py-2">{op.amount.toFixed(2)}</td>
                    <td className="border border-borderGray px-2 sm:px-4 py-2">{op.date}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="3" className="border border-borderGray px-2 sm:px-4 py-2 font-bold">
                    Итого:
                  </td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2 font-bold text-green-600">
                    +{calculateTotal(data).toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {(status === 2 || status === 4) && (
        <>
          <h2 className="text-lg font-bold mb-2 px-4 pt-2">Штрафы</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto bg-white text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">ID</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Дата</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Сумма</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2 max-w-[150px]">Комментарий</th>
                </tr>
              </thead>
              <tbody>
                <tr key={data.id} className="bg-[#FFE4E6]">
                  <td className="border border-borderGray px-2 sm:px-4 py-2">{data?.id}</td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2">
                    {formatedToDDMMYYYY(data?.created_at)}
                  </td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2">{formatNumber(data?.amount)}</td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2">{data?.comment}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="border border-borderGray px-2 sm:px-4 py-2 font-bold">
                    Итого:
                  </td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2 font-bold text-redd">
                    -{formatNumber(data?.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      {(status === 5 || status === 3) && (
        <>
          <h2 className="text-lg font-bold mb-2 px-4 pt-2">Авансы</h2>
          <div className="w-full overflow-x-auto">
            <table className="min-w-full table-auto bg-white text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">ID</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Дата</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Сумма</th>
                  <th className="border border-borderGray px-2 sm:px-4 py-2">Комментарий</th>
                </tr>
              </thead>
              <tbody>
                <tr key={data.id} className="bg-blue-50">
                  <td className="border border-borderGray px-2 sm:px-4 py-2">{data?.id}</td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2">
                    {formatedToDDMMYYYY(data?.created_at)}
                  </td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2">{formatNumber(data?.amount)}</td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2">{data?.comment}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="border border-borderGray px-2 sm:px-4 py-2 font-bold">
                    Итого:
                  </td>
                  <td className="border border-borderGray px-2 sm:px-4 py-2 font-bold text-blue-600">
                    -{formatNumber(data.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SalaryDetailTable;
