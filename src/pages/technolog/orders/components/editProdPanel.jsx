import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change_edit_prod_amounts, change_edit_prod_main, deleteProduct, delete_edit_prod, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { Table } from 'rsuite';
import { getColors } from '../../../../store/technolog/material';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import Button from '../../../../components/ui/button';
import ConfirmDeleteModal from '../modals/confirmDeleteModal';
import PartiesPanel from './partiesPanel';

const EditProdPanel = ({ product, id }) => {
  const dispatch = useDispatch();
  const { product_list, order_parties } = useSelector(state => state.order);
  const { colors_list } = useSelector(state => state.material);

  const [modal, setModal] = useState(false);
  
  useEffect(() => {
    if (!product_list) {
      dispatch(getOrderProductList());
    }
    if (!colors_list) {
      dispatch(getColors());
    }
  }, []);

  const handleAmountChange = (value, productIndex, colorId, sizeId, name) => {
    dispatch(change_edit_prod_amounts({
      index: productIndex,
      colorId,
      sizeId,
      value,
      name
    }));
  };

  const getValueMain = (name, value) => {
    dispatch(change_edit_prod_main({ index: id, name, value }));
  };

  // Получаем уникальные размеры из всех цветов
  const uniqueSizes = Array.from(
    new Set(product?.amounts?.flatMap(colorItem => colorItem.sizes.map(size => size.size.id)))
  )
    .map(sizeId => product?.amounts?.flatMap(colorItem => colorItem.sizes).find(size => size.size.id === sizeId)?.size)
    .filter(Boolean); // Убираем возможные null

  return (
    <div className='flex flex-col gap-y-4 transition-all duration-300'>
      {/* Отображение цен */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-2'>
        <div className="p-3 border border-borderGray rounded-md shadow-sm bg-gray-50">
          <p className="text-xs text-gray-500">Цена при создании</p>
          <p className="text-sm font-medium">{product.price} сом</p>
        </div>

        <div className="p-3 py-2 flex flex-col gap-y-2 border border-borderGray rounded-md shadow-sm bg-green-50">
          <p className="text-xs text-gray-500">Текущая цена</p>
          <NumInputForTable
            value={product.true_price || product.price}
            onChange={(value) => getValueMain('true_price', value)}
            placeholder='Текущая цена'
          />
        </div>

        <div className="p-3 border border-borderGray rounded-md shadow-sm bg-gray-50">
          <p className="text-xs text-gray-500">Себестоимость при создании</p>
          <p className="text-sm font-medium">{product.cost_price} сом</p>
        </div>

        <div className="p-3 py-2 flex flex-col gap-y-2 border border-borderGray rounded-md shadow-sm bg-green-50">
          <p className="text-xs text-gray-500">Текущая себестоимость</p>
          <NumInputForTable
            value={product.true_cost_price || product.cost_price}
            onChange={(value) => getValueMain('true_cost_price', value)}
            placeholder='Текущая себестоимость'
          />
        </div>
      </div>

      {/* Позиции */}
      <div className='mt-4'>
        <p className='font-semibold text-base text-gray-700 mb-3'>Позиции</p>
        <Table
          bordered
          cellBordered
          data={product.amounts || []}
          autoHeight
          headerHeight={70}
          className='mb-3'
        >
          {/* Колонка для цвета */}
          <Table.Column width={150} align='center' verticalAlign='middle' fixed>
            <Table.HeaderCell>Цвет</Table.HeaderCell>
            <Table.Cell style={{ padding: '6px' }}>
              {(rowData) => (
                <SelectForTable
                  data={colors_list || []}
                  value={rowData.color}
                  placeholder="Цвет"
                  labelKey={'title'}
                  valueKey={'id'}
                  colors={true}
                  disabled={true}
                />
              )}
            </Table.Cell>
          </Table.Column>

          {/* Генерация колонок для всех размеров */}
          {uniqueSizes?.map((sizeItem, sIndex) => {
              const bgColor = sIndex % 2 === 0 ? "#f5f5f5" : "#FFFFFF";

              return (
                <Table.ColumnGroup 
                  key={sIndex} 
                  header={sizeItem?.title} 
                  verticalAlign="middle" 
                  align="center"
                >
                  {[
                    { key: "amount", label: "План" },
                    { key: "cut", label: "Вырезано" },
                    { key: "otk", label: "ОТК" },
                    { key: "done", label: "Готово" },
                    { key: "defect", label: "Брак" },
                  ].map(({ key, label }) => (
                    <Table.Column key={`${key}-${sIndex}`} width={70}>
                      <Table.HeaderCell style={{ backgroundColor: bgColor, padding: 0 }}>{label}</Table.HeaderCell>
                      <Table.Cell style={{ background: bgColor, padding: '6px' }}>
                        {(rowData) => {
                          const sizeData = rowData.sizes.find(s => s.size.id === sizeItem.id);
                          return key === "amount" || key === "done" || key === "defect" ? (
                            <NumInputForTable
                              value={sizeData?.[key] || ""}
                              placeholder={"0"}
                              onChange={(value) => handleAmountChange(value, id, rowData.color, sizeItem.id, key)}
                            />
                          ) : (
                            <p className="text-center">{sizeData?.[key] || 0}</p>
                          );
                        }}
                      </Table.Cell>
                    </Table.Column>
                  ))}
                </Table.ColumnGroup>
              );
            })}
        </Table>
      </div>

      {/* Список партий */}

      <div className='mt-4'>
        <p className='font-semibold text-base text-gray-700 mb-3'>Список партий</p>
        {
          order_parties?.length > 0 ? 
            <PartiesPanel/> :
            <p className='text-sm text-gray-500'>Партий не найдено</p>
        }
      </div>

      <ConfirmDeleteModal modal={modal} setModal={setModal} id={id} />
    </div>
  );
};

export default EditProdPanel;
