import React from 'react';
import { formatedToDDMMYYYY, formatedToDDMMYYYYHHMM } from '../../../../../utils/functions/dateFuncs';
import { formatNumber } from '../../../../../utils/functions/numFuncs';

const PaymentInfoTable = ({ data, status }) => {
  return (
    <div className="lg:text-base sm:text-xs">
      {/* Операции */}
      {status === 1 && (
        <>
          <h3 className="text-sm font-bold mb-2 px-2 pt-1 flex justify-between items-center">
            <span>Operations</span>
            <span className='text-xs text-gray-600'>
              {`${formatedToDDMMYYYY(data?.date_from)} – ${formatedToDDMMYYYY(data?.date_until)}`}
            </span>
          </h3>
          <table className="w-full bg-white table-auto">
            <thead className="bg-gray-100 lg:text-base sm:text-xs">
              <tr>
                <th className="border px-2 py-1 whitespace-nowrap">ID</th>
                <th className="border px-1 py-1 whitespace-nowrap">Party</th>
                <th className="border px-4 py-1 whitespace-nowrap">Name</th>
                <th className="border px-2 py-1 whitespace-nowrap">Quantity</th>
                <th className="border px-2 py-1 whitespace-nowrap">Price</th>
                <th className="border px-2 py-1 whitespace-nowrap">Sum</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {data?.operations.map((op, index) => (
                <tr key={index} className="odd:bg-green-50">
                  <td className="border px-2 py-1 text-center">{op?.order_id}</td>
                  <td className="border px-1 py-1 text-center">{op?.party_number}</td>
                  <td className="border px-4 py-1">{op?.operation_title}</td>
                  <td className="border px-2 py-1 text-center">{op?.total_amount}</td>
                  <td className="border px-2 py-1 text-center">{op?.operation_price}</td>
                  <td className="border px-2 py-1 text-center">{op?.total_price?.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="5" className="border px-1 py-1 font-semibold">Total:</td>
                <td className="border px-1 py-1 font-bold text-green-600 text-right">
                  +{data?.amount?.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Штрафы */}
      {(status === 2 || status === 4) && (
        <>
          <h2 className="text-sm font-bold mb-2 px-2 pt-2">Fines</h2>
          <table className="w-full bg-white table-auto lg:text-base sm:text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-1 py-1">ID</th>
                <th className="border px-1 py-1">Date</th>
                <th className="border px-1 py-1">Sum</th>
                <th className="border px-4 py-1">Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-red-50">
                <td className="border px-1 py-1">{data?.id}</td>
                <td className="border px-1 py-1">{formatedToDDMMYYYYHHMM(data?.created_at)}</td>
                <td className="border px-1 py-1">{formatNumber(data?.amount)}</td>
                <td className="border px-4 py-1">{data?.comment}</td>
              </tr>
              <tr>
                <td colSpan="3" className="border px-1 py-1 font-semibold">Total:</td>
                <td className="border px-1 py-1 font-bold text-red-600 text-right">
                  -{formatNumber(data?.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Авансы / Бонусы */}
      {(status === 3 || status === 5 || status === 6) && (
        <>
          <h2 className="text-sm font-bold mb-2 px-2 pt-2">
            {status === 6 ? 'Bonus' : 'Advances'}
          </h2>
          <table className="w-full bg-white table-auto lg:text-base sm:text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-1 py-1">ID</th>
                <th className="border px-1 py-1">Date</th>
                <th className="border px-1 py-1">Sum</th>
                <th className="border px-1 py-1">Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-blue-50">
                <td className="border px-1 py-1">{data?.id}</td>
                <td className="border px-1 py-1">{formatedToDDMMYYYYHHMM(data?.created_at)}</td>
                <td className="border px-1 py-1">{formatNumber(data?.amount)}</td>
                <td className="border px-1 py-1">{data?.comment}</td>
              </tr>
              <tr>
                <td colSpan="3" className="border px-1 py-1 font-semibold">Total:</td>
                <td className="border px-1 py-1 font-bold text-blue-600 text-right">
                  {formatNumber(data?.amount)}
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}

      {/* Нет данных */}
      {!data?.operations && !data?.id && (
        <h3 className="text-sm text-center py-6 text-gray-500">No data</h3>
      )}
    </div>
  );
};

export default PaymentInfoTable;
