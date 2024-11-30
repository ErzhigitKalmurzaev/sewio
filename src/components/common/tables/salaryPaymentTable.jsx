import React from 'react'
import { formatedToDDMMYYYY } from '../../../utils/functions/dateFuncs';
import { formatNumber } from '../../../utils/functions/numFuncs';

const SalaryPaymentTable = ({ data, status }) => {
      const operations = data?.works?.map(item => item)
    
      const fines = data?.payments?.filter(item => item.status === 2 || item.status === 4);
    
      const advances = data?.payments?.filter(item => item.status === 5 || item.status === 3);
    
      const calculateTotal = (items) => items?.reduce((total, item) => total + item.amount, 0);
    
      return (
        <div className="bg-[#EDEDED] rounded-xl border border-borderGray font-inter">
          <h3 className="text-lg font-bold mb-2 px-4 pt-2">Операции</h3>
          <table className="min-w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-borderGray px-4 py-2">ID</th>
                <th className="border border-borderGray px-4 py-2">Название</th>
                <th className="border border-borderGray px-4 py-2">Количество</th>
                <th className="border border-borderGray px-4 py-2">Сумма (сом)</th>
                <th className="border border-borderGray px-4 py-2">Дата</th>
              </tr>
            </thead>
            <tbody>
              {
              operations?.length > 0 ? 
              operations?.map((op, index) => (
                <tr key={op.id} className={'bg-green-50'}>
                  <td className="border border-borderGray px-4 py-2 text-center">{op.id}</td>
                  <td className="border border-borderGray px-4 py-2">{op.name}</td>
                  <td className="border border-borderGray px-4 py-2">{op.quantity}</td>
                  <td className="border border-borderGray px-4 py-2">{op.amount}</td>
                  <td className="border border-borderGray px-4 py-2">{op.date}</td>
                </tr>
              )) : 
              <tr className='bg-green-50 w-full' >
                <td></td>
                <td></td>
                <p className='text-center py-4'>Нет выполненных операций</p>
                <td></td>
                <td></td>
              </tr>
              }
              <tr>
                <td colSpan="3" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                <td colSpan='2' className="border border-borderGray px-4 py-2 font-bold text-green-600">
                  +{formatNumber(calculateTotal(operations))}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
    
          <h2 className="text-lg font-bold mb-2 px-4 pt-2">Штрафы</h2>
          <table className="min-w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-borderGray px-4 py-2">ID</th>
                <th className="border border-borderGray px-4 py-2">Дата</th>
                <th className="border border-borderGray px-4 py-2">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {
                fines?.length > 0 ?
                fines?.map((fine, index) => (
                  <tr key={fine.id} className={'bg-[#FFE4E6]'}>
                    <td className="border border-borderGray px-4 py-2 text-center">{fine.id}</td>
                    <td className="border border-borderGray px-4 py-2">{formatedToDDMMYYYY(fine.created_at)}</td>
                    <td className="border border-borderGray px-4 py-2">{formatNumber(fine.amount)}</td>
                  </tr>
                )) :
                <tr className='bg-[#FFE4E6] w-full' >
                  <td></td>
                  <p className='text-center py-4'>Нет штрафов</p>
                  <td></td>
                </tr>
              }
              <tr>
                <td colSpan="2" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                <td className="border border-borderGray px-4 py-2 font-bold text-redd">
                  -{formatNumber(calculateTotal(fines))}
                </td>
              </tr>
            </tbody>
          </table>
    
          <h2 className="text-lg font-bold mb-2 px-4 pt-2">Авансы</h2>
          <table className="min-w-full table-auto bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-borderGray px-4 py-2">ID</th>
                <th className="border border-borderGray px-4 py-2">Дата</th>
                <th className="border border-borderGray px-4 py-2">Сумма</th>
              </tr>
            </thead>
            <tbody>
              {
                advances?.length > 0 ?
                advances?.map((advance, index) => (
                  <tr key={advance.id} className={'bg-blue-50'}>
                    <td className="border border-borderGray px-4 py-2 text-center">{advance.id}</td>
                    <td className="border border-borderGray px-4 py-2">{formatedToDDMMYYYY(advance.created_at)}</td>
                    <td className="border border-borderGray px-4 py-2">{formatNumber(advance.amount)}</td>
                  </tr>
                )) :
                <tr className='bg-blue-50 w-full' >
                  <td></td>
                  <p className='text-center py-4'>Нет авансов</p>
                  <td></td>
                </tr>
              }
              <tr>
                <td colSpan="2" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                <td className="border border-borderGray px-4 py-2 font-bold text-blue-600">
                  -{formatNumber(calculateTotal(advances))}
                </td>
              </tr>
            </tbody>
          </table>
    
          <div className="flex justify-between items-center font-inter bg-white text-lg font-semibold rounded-b-xl px-4 py-3">
            <p>К выплате:</p> 
            <p>{formatNumber((calculateTotal(operations) - calculateTotal(fines) - calculateTotal(advances)))}</p>
          </div>
        </div>
      );
}

export default SalaryPaymentTable
