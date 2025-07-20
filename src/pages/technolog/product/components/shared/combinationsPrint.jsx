import React, { forwardRef, useEffect, useState } from 'react'
import { getOperationsTitlesList } from '../../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';
import { getRankList } from '../../../../../store/technolog/rank';

const CombinationsPrint = forwardRef(({ images }, ref) => {

  const { operations_list } = useSelector(state => state.calculation);
  const { combinations } = useSelector(state => state.product)
  const { rank_list } = useSelector(state => state.rank);

  const dispatch = useDispatch();

  useEffect(() => {
    if(!rank_list) {
        dispatch(getRankList());
    } 
    if(!operations_list) {
        dispatch(getOperationsTitlesList());
    }
  }, [dispatch])

  const sumChildValues = (children, key) => {
    if (!children || children.length === 0) return 0;
    return children.reduce((acc, item) => acc + (Number(item[key]) || 0), 0).toFixed(2);
  };

  const combinationsOnly = combinations?.filter((c) => c.children); // только комбинации
  const numberedCombinations = combinationsOnly?.slice(1, -2); // со 2-й до 3-й с конца

  // создаём map id → номер
  const comboIndexMap = new Map(
    numberedCombinations?.map((combo, idx) => [combo.id, idx + 1]) || [] // нумерация с 1
  );

  const renderTableRows = () => {
    if (!combinations || combinations.length === 0) return null;

    const rows = [];

    combinations.forEach((combination) => {
      if (!combination.children) return;

      if (!comboIndexMap.has(combination.id)) return;

      
      rows.push(
        <tr key={`combo-${combination.id}`} className="bg-zinc-300 font-semibold text-sm">
          <td className="border px-2 py-1 text-center">
            {comboIndexMap.get(combination.id)}
          </td>
          <td className="border px-2 py-1 font-inter">
            {combination.title}
          </td>
          <td className="border px-2 py-1 text-center">
            {sumChildValues(combination.children, 'time')}
          </td>
          <td className="border px-2 py-1 text-center">
            -
          </td>
          <td className="border px-2 py-1 text-center">
            {sumChildValues(combination.children, 'price')}
          </td>
        </tr>
      );

      
      if (combination.children && combination.children.length > 0) {
        combination.children.forEach((operation) => {
          const rankTitle = rank_list?.find(rank => rank.id === operation.rank)?.title || '-';
          
          rows.push(
            <tr key={`operation-${operation.id}`} className="bg-white text-sm">
              <td className="border px-2 py-1 text-center">
                -
              </td>
              <td className="border px-2 py-1 pl-6 font-inter">
                {operation.title}
              </td>
              <td className="border px-2 py-1 text-center">
                {operation.time || 0}
              </td>
              <td className="border px-2 py-1 text-center">
                {rankTitle}
              </td>
              <td className="border px-2 py-1 text-center">
                {operation.price || 0}
              </td>
            </tr>
          );
        });
      }
    });

    return rows;
  };

  return (
    <div ref={ref} className='my-3'>
        {/* Блок картинок */}
        {images && images.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
                {images.map((img, i) => (
                    <div key={i} className="w-auto">
                        <img
                            src={img.image}
                            alt={`Изображение товара ${i + 1}`}
                            className="w-full h-[130px] object-contain"
                        />
                    </div>
                ))}
            </div>
        )}

        {/* Таблица */}
        <div className="overflow-x-auto mt-5">
            <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-2 py-1 text-center w-10 text-xs font-semibold">
                            №
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-left text-xs font-semibold" style={{width: '200px'}}>
                            Название
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-center w-20 text-xs font-semibold">
                            Время (сек)
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-center w-16 text-xs font-semibold">
                            Разряд
                        </th>
                        <th className="border border-gray-300 px-2 py-1 text-center w-20 text-xs font-semibold">
                            Цена (сом)
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows()}
                </tbody>
            </table>
        </div>
    </div>
  )
})

export default CombinationsPrint