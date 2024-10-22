import React from 'react'

const SalaryPaymentTable = () => {
    const operations = [
        { id: 1, name: 'Крой', quantity: 100, amount: 1000.0, date: '15/11/2024' },
        { id: 2, name: 'Пошив', quantity: 20, amount: 1000.0, date: '15/11/2024' },
        { id: 3, name: 'Глажка', quantity: 30, amount: 1000.0, date: '15/11/2024' },
        { id: 4, name: 'Упаковка', quantity: 300, amount: 1500.0, date: '15/11/2024' },
        { id: 5, name: 'Пуговицы', quantity: 130, amount: 1500.0, date: '15/11/2024' },
      ];
    
      const fines = [
        { id: 6, date: '15/11/2024', amount: 500.0 },
      ];
    
      const advances = [
        { id: 11, date: '15/11/2024', amount: 1000.0 },
      ];
    
      const calculateTotal = (items) => items.reduce((total, item) => total + item.amount, 0);
    
      return (
        <div className="bg-[#EDEDED] rounded-xl border border-borderGray">
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
              {operations.map((op, index) => (
                <tr key={op.id} className={'bg-green-50'}>
                  <td className="border border-borderGray px-4 py-2">{op.id}</td>
                  <td className="border border-borderGray px-4 py-2">{op.name}</td>
                  <td className="border border-borderGray px-4 py-2">{op.quantity}</td>
                  <td className="border border-borderGray px-4 py-2">{op.amount.toFixed(2)}</td>
                  <td className="border border-borderGray px-4 py-2">{op.date}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                <td className="border border-borderGray px-4 py-2 font-bold text-green-600">
                  +{calculateTotal(operations).toFixed(2)}
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
              {fines.map((fine, index) => (
                <tr key={fine.id} className={'bg-[#FFE4E6]'}>
                  <td className="border border-borderGray px-4 py-2">{fine.id}</td>
                  <td className="border border-borderGray px-4 py-2">{fine.date}</td>
                  <td className="border border-borderGray px-4 py-2">{fine.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                <td className="border border-borderGray px-4 py-2 font-bold text-red">
                  -{calculateTotal(fines).toFixed(2)}
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
              {advances.map((advance, index) => (
                <tr key={advance.id} className={'bg-blue-50'}>
                  <td className="border border-borderGray px-4 py-2">{advance.id}</td>
                  <td className="border border-borderGray px-4 py-2">{advance.date}</td>
                  <td className="border border-borderGray px-4 py-2">{advance.amount.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2" className="border border-borderGray px-4 py-2 font-bold">Итого:</td>
                <td className="border border-borderGray px-4 py-2 font-bold text-blue-600">
                  -{calculateTotal(advances).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
    
          <div className="flex justify-between items-center font-inter bg-white text-lg font-semibold rounded-b-xl px-4 py-3">
            <p>К выплате:</p> 
            <p>{(calculateTotal(operations) - calculateTotal(fines) - calculateTotal(advances)).toFixed(2)}</p>
          </div>
        </div>
      );
}

export default SalaryPaymentTable
