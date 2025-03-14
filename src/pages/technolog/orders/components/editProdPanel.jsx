import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change_edit_prod_amounts, change_edit_prod_main, deleteProduct, delete_edit_prod, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { Table } from 'rsuite';
import { getColors } from '../../../../store/technolog/material';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import Button from '../../../../components/ui/button';
import ConfirmDeleteModal from '../modals/confirmDeleteModal';

import { motion, AnimatePresence } from "framer-motion";

const EditProdPanel = ({ product, id }) => {

  const dispatch = useDispatch();
  
  const { product_list } = useSelector(state => state.order);
  const { colors_list } = useSelector(state => state.material);

  const [modal, setModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!product_list) {
      dispatch(getOrderProductList());
    }
    if (!colors_list) {
      dispatch(getColors());
    }
  }, []);

  const handleAmountChange = (value, productIndex, colorId, sizeId) => {
    dispatch(change_edit_prod_amounts({
      index: productIndex, // Индекс в edit_products_in_order
      colorId, // ID цвета
      sizeId, // ID размера
      value // Новое значение amount
    }));
  };

  const getValueMain = (name, value) => {
    dispatch(change_edit_prod_main({ index: id, name, value }))
  };

  return (
      <div className='flex flex-col gap-y-4 transition-all duration-300'>
          {/* Отображение цен */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mt-2'>
            {/* Цена при создании */}
            <div className="p-3 border border-borderGray rounded-md shadow-sm bg-gray-50">
              <p className="text-xs text-gray-500">Цена при создании</p>
              <p className="text-sm font-medium">{product.price} сом</p>
            </div>

            {/* Текущая цена */}
            <div className="p-3 py-2 flex flex-col gap-y-2 border border-borderGray rounded-md shadow-sm bg-green-50">
              <p className="text-xs text-gray-500">Текущая цена</p>
              <NumInputForTable
                value={product.true_price}
                onChange={(value) => getValueMain('true_price', value)}
                placeholder='Текущая цена'
              />
            </div>

            {/* Себестоимость при создании */}
            <div className="p-3 border border-borderGray rounded-md shadow-sm bg-gray-50">
              <p className="text-xs text-gray-500">Себестоимость при создании</p>
              <p className="text-sm font-medium">{product.cost_price} сом</p>
            </div>

            {/* Текущая себестоимость */}
            <div className="p-3 py-2 flex flex-col gap-y-2 border border-borderGray rounded-md shadow-sm bg-green-50">
              <p className="text-xs text-gray-500">Текущая себестоимость</p>
              <NumInputForTable
                value={product.true_cost_price}
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
              color='green'
            >
              {/* Колонка для цвета */}
              <Table.Column width={150} align='center' verticalAlign='middle'>
                <Table.HeaderCell>Цвет</Table.HeaderCell>
                <Table.Cell style={{ padding: '6px' }}>
                  {(rowData, index) => (
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
              {product.amounts[0]?.sizes?.map((sizeItem, sIndex) => (
                <Table.ColumnGroup header={sizeItem?.size?.title} key={sIndex} verticalAlign='middle' align='center'>
                  {/* Колонка для "План" */}
                  <Table.Column key={sIndex} flexGrow={1} minWidth={60}>
                    <Table.HeaderCell>План</Table.HeaderCell>
                    <Table.Cell style={{ padding: '6px' }}>
                      {(rowData, index) => (
                        <NumInputForTable
                          value={sizeItem.amount || ""}
                          placeholder={'0'}
                          onChange={(value) => handleAmountChange(value, id, rowData.color, sizeItem?.size?.id)}
                        />
                      )}
                    </Table.Cell>
                  </Table.Column>

                  {/* Колонка для "Вырезано" */}
                  <Table.Column key={sIndex} minWidth={60} flexGrow={1}>
                    <Table.HeaderCell>Вырезано</Table.HeaderCell>
                    <Table.Cell style={{ padding: '6px' }}>
                      {(rowData, index) => (
                        <p className="text-center">{sizeItem.cut}</p>
                      )}
                    </Table.Cell>
                  </Table.Column>

                  {/* Колонка для "Готово" */}
                  <Table.Column key={sIndex} minWidth={60} >
                    <Table.HeaderCell>Готово</Table.HeaderCell>
                    <Table.Cell style={{ padding: '6px' }}>
                      {(rowData, index) => (
                        <p className="text-center">{sizeItem.done}</p>
                      )}
                    </Table.Cell>
                  </Table.Column>
                </Table.ColumnGroup>
              ))}
            </Table>
          </div>

          <div className='flex justify-end'>
              <Button width='120px' variant='red' onClick={() => setModal(true)}>Удалить</Button>
          </div>

          <ConfirmDeleteModal modal={modal} setModal={setModal} id={id} setIsDeleting={setIsDeleting} />
      </div>
  );
}

export default EditProdPanel;
