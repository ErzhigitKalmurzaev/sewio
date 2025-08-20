import React, { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceData } from "../../../../store/technolog/order";
import { useParams } from "react-router-dom";
import { materialUnits } from "../../../../utils/selectDatas/productDatas";

const InvoicePrint = forwardRef(({ images, productInfo }, ref) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { invoice_data: rawData } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getInvoiceData(id));
  }, [dispatch, id]);

  // Transform data like in MainTable - each color becomes a separate row
  const transformedData = [];
  (rawData || []).forEach((material, materialIndex) => {
    material?.colors.forEach((color, colorIndex) => {
      transformedData.push({
        // Material data
        materialId: materialIndex + 1,
        materialTitle: material.title,
        materialUnit: material.unit,
        materialRowSpan: colorIndex === 0 ? material?.colors?.length : 0,
        
        // Color data
        color: color?.color || "Без цвета",
        need: color?.need,
        stock: color?.stock,
        shortage: color?.shortage,
        
        // Helper flags
        isFirstInGroup: colorIndex === 0
      });
    });
  });

  // Группировка данных для объединения ячеек
  const groupedData = [];
  transformedData.forEach((row, index) => {
    if (row.isFirstInGroup) {
      const group = transformedData.filter(item => item.materialTitle === row.materialTitle);
      groupedData.push({ ...row, group });
    }
  });

  return (
    <div
      className="w-full min-h-screen bg-white font-sans text-black py-8 px-6"
      ref={ref}
      style={{
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.4'
      }}
    >
      {/* Заголовок */}
      <div className="text-center mb-3">
        <h2 className="text-xl font-bold uppercase tracking-wide mb-2 border-b-2 border-gray-800 pb-2">
          Накладная на материалы
        </h2>
        <p className="text-lg font-semibold">для заказа №{id}</p>
        <p className="text-sm text-gray-600 mt-2">
          Дата создания: {new Date().toLocaleDateString('ru-RU')}
        </p>
      </div>

      {/* Изображения */}
      {images?.length > 0 && (
        <div className="mb-3">
          <h3 className="text-sm font-semibold mb-4 text-gray-700">Изображения заказа:</h3>
          <div className="grid grid-cols-4 gap-4">
            {images?.map((img, i) => (
              <div key={i} className="border-2 border-gray-300 rounded-lg p-3 bg-gray-50">
                <img
                  src={img.image}
                  alt={`Изображение ${i + 1}`}
                  className="w-full h-20 object-contain rounded"
                />
                <p className="text-xs text-center text-gray-600 mt-2">№{i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Таблица без скролла */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Материалы:</h3>
        
        {transformedData.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-gray-300 rounded">
            <p>Данные о материалах отсутствуют</p>
          </div>
        ) : (
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-800 px-3 py-3 text-left font-bold text-xs">
                  №
                </th>
                <th className="border border-gray-800 px-3 py-3 text-left font-bold text-xs">
                  Наименование материала
                </th>
                <th className="border border-gray-800 px-3 py-3 text-center font-bold text-xs">
                  Ед. изм.
                </th>
                <th className="border border-gray-800 px-3 py-3 text-center font-bold text-xs">
                  Цвет
                </th>
                <th className="border border-gray-800 px-3 py-3 text-center font-bold text-xs">
                  Требуется
                </th>
                <th className="border border-gray-800 px-3 py-3 text-center font-bold text-xs">
                  На складе
                </th>
                <th className="border border-gray-800 px-3 py-3 text-center font-bold text-xs">
                  Нехватка
                </th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let materialCounter = 0;
                return transformedData.map((row, index) => {
                  if (row.isFirstInGroup) {
                    materialCounter++;
                  }
                  
                  return (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {/* Номер материала */}
                      {row.isFirstInGroup && (
                        <td 
                          className="border border-gray-800 px-3 py-2 text-center font-semibold"
                          rowSpan={row.materialRowSpan}
                        >
                          {materialCounter}
                        </td>
                      )}
                      
                      {/* Наименование материала */}
                      {row.isFirstInGroup && (
                        <td 
                          className="border border-gray-800 px-3 py-2 font-medium"
                          rowSpan={row.materialRowSpan}
                        >
                          {row.materialTitle}
                        </td>
                      )}
                      
                      {/* Единица измерения */}
                      {row.isFirstInGroup && (
                        <td 
                          className="border border-gray-800 px-3 py-2 text-center"
                          rowSpan={row.materialRowSpan}
                        >
                          {materialUnits.find(unit => unit.value === row.materialUnit)?.label || "—"}
                        </td>
                      )}
                      
                      {/* Цвет */}
                      <td className="border border-gray-800 px-3 py-2 text-center">
                        {row.color}
                      </td>
                      
                      {/* Требуется */}
                      <td className="border border-gray-800 px-3 py-2 text-center font-medium">
                        {row.need?.toFixed(1) || "0.0"}
                      </td>
                      
                      {/* На складе */}
                      <td className="border border-gray-800 px-3 py-2 text-center">
                        {row.stock?.toFixed(1) || "0.0"}
                      </td>
                      
                      {/* Нехватка */}
                      <td className={`border border-gray-800 px-3 py-2 text-center font-medium ${
                        (row.shortage || 0) > 0 ? 'text-red-600 font-bold' : 'text-green-600'
                      }`}>
                        {row.shortage?.toFixed(1) || "0.0"}
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        )}
      </div>

      {/* Итоговая информация */}
      <div className="mt-8 border-t-2 border-gray-800 pt-6">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-sm font-bold mb-3 text-gray-800">Итоговая информация:</h4>
            <div className="space-y-2 text-xs">
              <p><span className="font-semibold">Общее количество позиций:</span> {transformedData.length}</p>
              <p><span className="font-semibold">Материалов:</span> {groupedData.length}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-bold mb-3 text-gray-800">Подписи:</h4>
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-gray-400 pb-1">
                <span>Ответственный:</span>
                <span className="w-32 text-right">_________________</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-400 pb-1">
                <span>Получил:</span>
                <span className="w-32 text-right">_________________</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-400 pb-1">
                <span>Дата:</span>
                <span className="w-32 text-right">_________________</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS стили для печати */}
      <style jsx>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: Arial, sans-serif !important;
          }
          
          * {
            box-sizing: border-box;
          }
          
          table {
            page-break-inside: avoid;
          }
          
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          
          .grid {
            display: grid !important;
          }
          
          .grid-cols-4 {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          
          .grid-cols-2 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
});

export default InvoicePrint;