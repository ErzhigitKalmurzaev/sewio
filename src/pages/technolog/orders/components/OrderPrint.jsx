import React, { forwardRef } from 'react';
import Title from '../../../../components/ui/title';
import { Table } from 'rsuite';
import { Building, Phone, User } from 'lucide-react';
import { useSelector } from 'react-redux';

const OrderPrint = React.forwardRef(({ order, products }, ref) => {

  const { colors_list } = useSelector(state => state.material);
  const getTotalByProduct = (product) => {
    return product.amounts.reduce((sum, colorItem) => {
      return sum + colorItem.sizes.reduce((s, i) => s + i.amount, 0);
    }, 0);
  };

  const getTotalAll = () => {
    return products.reduce((total, product) => {
      return total + getTotalByProduct(product);
    }, 0);
  };

  const getUniqueSizes = (product) => {
    const sizeMap = {};
    product.amounts.forEach(colorItem => {
      colorItem.sizes.forEach(sizeObj => {
        sizeMap[sizeObj.size.id] = sizeObj.size.title;
      });
    });
    return Object.entries(sizeMap).map(([id, title]) => ({ id: Number(id), title }));
  };
  console.log(colors_list)

  return (
    <div ref={ref} className="p-8 text-[13px] font-sans text-black bg-white">
      <h2 className="text-xl font-bold mb-2">Заказ №{order?.id || '—'}</h2>
      <p className="mb-4">Дата сдачи: {order?.deadline || '—'}</p>

      <div className="border border-gray-400 p-4 rounded mb-6">
        <p className="font-semibold mb-2">Информация о клиенте:</p>
        <p>ФИО: {order?.client?.name} {order?.client?.surname}</p>
        <p>Компания: {order?.client?.company_title || '—'}</p>
        <p>Телефон: {order?.client?.phone || '—'}</p>
      </div>

      {products?.map((product, index) => {
        const sizes = getUniqueSizes(product);

        return (
          <div key={index} className="mb-10">
            <div className="mb-2">
              <p className="font-semibold">Товар: {product.title}</p>
              <p className="text-sm text-gray-600">Арт: {product.vendor_code}</p>
            </div>

            <table className="w-full border-collapse border border-gray-400 mb-2 text-center">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-400 px-2 py-1">Цвет</th>
                  {sizes.map(size => (
                    <th key={size.id} className="border border-gray-400 px-2 py-1">{size.title}</th>
                  ))}
                  <th className="border border-gray-400 px-2 py-1">Итого</th>
                </tr>
              </thead>
              <tbody>
                {product.amounts.map((colorItem, i) => {
                  const total = colorItem.sizes.reduce((sum, s) => sum + s.amount, 0);

                  return (
                    <tr key={i}>
                      <td className="border border-gray-400 px-2 py-1">{colors_list?.find(c => c.id === colorItem.color)?.title || '—'}</td>
                      {sizes.map(size => {
                        const found = colorItem.sizes.find(s => s.size.id === size.id);
                        return (
                          <td key={size.id} className="border border-gray-400 px-2 py-1">
                            {found ? found.amount : 0}
                          </td>
                        );
                      })}
                      <td className="border border-gray-400 px-2 py-1 font-semibold">{total}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="text-right font-semibold">Всего по товару: {getTotalByProduct(product)} шт.</p>
          </div>
        );
      })}

      <div className="border-t border-gray-400 pt-3 mt-6 text-right">
        <p className="text-lg font-bold">Общее количество: {getTotalAll()} шт.</p>
      </div>
    </div>
  );
});

export default OrderPrint;