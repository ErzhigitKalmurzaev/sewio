import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change_edit_prod_amounts, change_edit_prod_main, deleteProduct, delete_edit_prod, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { Table } from 'rsuite';
import { getColors } from '../../../../store/technolog/material';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import Button from '../../../../components/ui/button';
import ConfirmDeleteModal from '../modals/confirmDeleteModal';

const EditProdPanel = ({ product, id }) => {
  const dispatch = useDispatch();
  const { product_list } = useSelector(state => state.order);
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
    .map(sizeId => product.amounts.flatMap(colorItem => colorItem.sizes).find(size => size.size.id === sizeId)?.size)
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
          minHeight={200}
          headerHeight={60}
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
          {uniqueSizes?.map((sizeItem, sIndex) => (
            <Table.ColumnGroup header={sizeItem?.title} key={sIndex} verticalAlign="middle" align="center">
              {/* Колонка для "План" */}
              <Table.Column key={`plan-${sIndex}`} width={80}>
                <Table.HeaderCell>План</Table.HeaderCell>
                <Table.Cell style={{ padding: "6px" }}>
                  {(rowData) => {
                    const sizeData = rowData.sizes.find(s => s.size.id === sizeItem.id);
                    return (
                      <NumInputForTable
                        value={sizeData?.amount || ""}
                        placeholder={"0"}
                        onChange={(value) => handleAmountChange(value, id, rowData.color, sizeItem.id, "amount")}
                      />
                    );
                  }}
                </Table.Cell>
              </Table.Column>

              {/* Колонка для "Вырезано" */}
              <Table.Column key={`cut-${sIndex}`} width={70}>
                <Table.HeaderCell>Вырезано</Table.HeaderCell>
                <Table.Cell style={{ padding: "6px" }}>
                  {(rowData) => {
                    const sizeData = rowData.sizes.find(s => s.size.id === sizeItem.id);
                    return <p className="text-center">{sizeData?.cut || 0}</p>;
                  }}
                </Table.Cell>
              </Table.Column>

              {/* Колонка для "Готово" */}
              <Table.Column key={`done-${sIndex}`} width={80}>
                <Table.HeaderCell>Готово</Table.HeaderCell>
                <Table.Cell style={{ padding: "6px" }}>
                  {(rowData) => {
                    const sizeData = rowData.sizes.find(s => s.size.id === sizeItem.id);
                    return (
                      <NumInputForTable
                        value={sizeData?.done || ""}
                        placeholder={"0"}
                        onChange={(value) => handleAmountChange(value, id, rowData.color, sizeItem.id, "done")}
                      />
                    )
                  }}
                </Table.Cell>
              </Table.Column>
            </Table.ColumnGroup>
          ))}
        </Table>
      </div>

      <div className='flex justify-end'>
        <Button width='120px' variant='red' onClick={() => setModal(true)}>Удалить</Button>
      </div>

      <ConfirmDeleteModal modal={modal} setModal={setModal} id={id} />
    </div>
  );
};

export default EditProdPanel;
