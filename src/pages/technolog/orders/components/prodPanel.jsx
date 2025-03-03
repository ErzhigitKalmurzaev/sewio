import React, { useEffect } from 'react'
import InputWithSuggestions from '../../../../components/ui/inputs/inputWithSuggestions';
import { useDispatch, useSelector } from 'react-redux';
import { addAmount, change_prod_amounts, change_prod_main, deleteAmount, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { Table } from 'rsuite';
import { getColors } from '../../../../store/technolog/material';
import { getSizesList } from '../../../../store/technolog/size';
import { CircleMinus, Plus } from 'lucide-react';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import Input from '../../../../components/ui/inputs/input';

const ProdPanel = ({ product, id }) => {

  const dispatch = useDispatch();
  
  const { products_to_order, product_list } = useSelector(state => state.order);
  const { colors_list } = useSelector(state => state.material);
  const { sizes_list } = useSelector(state => state.size);

  useEffect(() => {
    dispatch(getOrderProductList());
    dispatch(getColors());
    dispatch(getSizesList());
  }, [])

  const getValue = (value, name, index, sizeId) => {
    dispatch(change_prod_amounts({ id, index, name, value, sizeId }));
};

  const getValueMain = (name, value) => {
    dispatch(change_prod_main({ index: id, name, value }))
  }

  const handleSelect = (value) => {
    const index = product_list.findIndex(item => item.id === value);
    dispatch(change_prod_main({ index: id, name: 'nomenclature', value }))
    dispatch(change_prod_main({ index: id, name: 'cost_price', value: `${product_list[index].cost_price}` }))
  }

  const addRow = () => {
    dispatch(addAmount())
  }

  const deleteRow = (index) => {
    dispatch(deleteAmount({ id, index }))
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
                    onSelect={(id) => handleSelect(id)}
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
            >
                <Table.Column width={180}>
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
                                onChange={(e) => getValue(e, "color", index)}
                            />
                        }
                    </Table.Cell>
                </Table.Column>
                
                {/* Генерация колонок для всех размеров */}
                {sizes_list?.map((sizeItem, sIndex) => (
                    <Table.Column key={sIndex} width={80}>
                        <Table.HeaderCell>{sizeItem.title}</Table.HeaderCell>
                        <Table.Cell style={{ padding: '7px 6px' }}>
                            {(rowData, index) => (
                                <NumInputForTable
                                    value={rowData.sizes.find(s => s.size === sizeItem.id)?.amount || ""}
                                    placeholder={'0'}
                                    onChange={(e) => getValue(e, 'size', index, sizeItem.id)}
                                />
                            )}
                        </Table.Cell>
                    </Table.Column>
                ))}

                <Table.Column width={80} fixed="right">
                    <Table.HeaderCell align="center">
                        <button onClick={addRow} className="cursor-pointer">
                            <Plus color="#00796B" />
                        </button>
                    </Table.HeaderCell>
                    <Table.Cell>
                        {(rowData, index) =>
                            <div className='flex justify-center'>
                                <button onClick={() => deleteRow(index)} className="cursor-pointer">
                                    <CircleMinus color="#C2185B" />
                                </button>
                            </div>
                        }
                    </Table.Cell>
                </Table.Column>
            </Table>
        </div>
    </div>
  )
}

export default ProdPanel
