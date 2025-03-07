import React, { useEffect } from 'react'
import InputWithSuggestions from '../../../../components/ui/inputs/inputWithSuggestions';
import { useDispatch, useSelector } from 'react-redux';
import { addAmount, change_edit_prod_amounts, change_prod_amounts, change_prod_main, deleteAmount, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { Table } from 'rsuite';
import { getColors } from '../../../../store/technolog/material';
import { getSizesList } from '../../../../store/technolog/size';
import { CircleMinus, Plus } from 'lucide-react';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import Input from '../../../../components/ui/inputs/input';

const EditProdPanel = ({ product, id }) => {

  const dispatch = useDispatch();
  
  const { products_to_order, product_list } = useSelector(state => state.order);
  const { colors_list } = useSelector(state => state.material);
  const { sizes_list } = useSelector(state => state.size);

  useEffect(() => {
    if(!product_list) {
        dispatch(getOrderProductList());
    }
    if(!colors_list) {
        dispatch(getColors());
    }
  }, [])

  const handleAmountChange = (value, productIndex, colorId, sizeId) => {
    dispatch(change_edit_prod_amounts({ 
        index: productIndex, // Индекс в edit_products_in_order
        colorId, // ID цвета
        sizeId, // ID размера
        value // Новое значение amount
    }));
};

  const getValueMain = (name, value) => {
    dispatch(change_prod_main({ index: id, name, value }))
  }

  return (
    <div className='flex flex-col gap-y-3'>
        <div className='flex justify-between items-start gap-x-5'>
            <div className='flex flex-col gap-y-1 w-full'>
                <p className='font-inter text-sm'>Продукт</p>
                <InputWithSuggestions
                    placeholder={'Введите название продукта'}
                    suggestions={product_list}
                    value={product.title}
                    onChange={(e) => getValueMain('title', e.target.value)}
                />
            </div>
            <div className='flex flex-col gap-y-1 w-full'>
                <p className='font-inter text-sm'>Себестоимость</p>
                <NumInputForTable
                    placeholder={'Себестоимость'}
                    value={product.cost_price}
                    onChange={(e) => getValueMain('cost_price', e)}
                />
            </div>
            <div className='flex flex-col gap-y-1 w-full'>
                <p className='font-inter text-sm'>Цена</p>
                <NumInputForTable
                    placeholder={'Цена'}
                    value={product.price}
                    onChange={(e) => getValueMain('price', e)}
                />
            </div>
        </div>

        <div className='flex flex-col gap-y-3 mt-2'>
            <p className='font-inter font-semibold'>Позиции</p>
            <Table
                bordered
                cellBordered
                data={product.amounts || []}
                autoHeight
                headerHeight={70}
            >
                <Table.Column width={180} align='center' verticalAlign='middle'>
                    <Table.HeaderCell>Цвет</Table.HeaderCell>
                    <Table.Cell style={{ padding: '7px 6px' }}>
                        {(rowData, index) =>
                            <SelectForTable
                                data={colors_list || []}
                                value={rowData.color}
                                placeholder="Цвет"
                                labelKey={'title'}
                                valueKey={'id'}
                                colors={true}
                                disabled={true}
                            />
                        }
                    </Table.Cell>
                </Table.Column>
                
                {/* Генерация колонок для всех размеров */}
                {product.amounts[0]?.sizes?.map((sizeItem, sIndex) => (
                    <Table.ColumnGroup header={sizeItem?.size?.title} key={sIndex} verticalAlign='middle' align='center'> 
                        <Table.Column key={sIndex} width={70}>
                            <Table.HeaderCell>План</Table.HeaderCell>
                            <Table.Cell style={{ padding: '6.5px' }}>
                                {(rowData, index) => (
                                    <NumInputForTable
                                        value={sizeItem.amount || ""}
                                        placeholder={'0'}
                                        onChange={(value) => handleAmountChange(value, id, rowData.color, sizeItem?.size?.id)}
                                    />
                                )}
                            </Table.Cell>
                        </Table.Column>
                        <Table.Column key={sIndex} width={70}>
                            <Table.HeaderCell>Вырезано</Table.HeaderCell>
                            <Table.Cell style={{ padding: '7px 6px' }}>
                                {(rowData, index) => (
                                    <p>{sizeItem.cut}</p>
                                )}
                            </Table.Cell>
                        </Table.Column>
                        <Table.Column key={sIndex} width={70}>
                            <Table.HeaderCell>Готово</Table.HeaderCell>
                            <Table.Cell style={{ padding: '7px 6px' }}>
                            {(rowData, index) => (
                                    <p>{sizeItem.done}</p>
                                )}
                            </Table.Cell>
                        </Table.Column>
                    </Table.ColumnGroup>
                ))}

                
            </Table>
        </div>
    </div>
  )
}

export default EditProdPanel
