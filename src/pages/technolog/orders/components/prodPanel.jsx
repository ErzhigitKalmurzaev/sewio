import React, { useEffect, useState } from 'react';
import InputWithSuggestions from '../../../../components/ui/inputs/inputWithSuggestions';
import { useDispatch, useSelector } from 'react-redux';
import { addAmount, change_prod_amounts, change_prod_main, deleteAmount, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { Table } from 'rsuite';
import { getColors } from '../../../../store/technolog/material';
import { getSizesList } from '../../../../store/technolog/size';
import { CircleMinus, Plus, X } from 'lucide-react';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import { toast } from 'react-toastify';

const ProdPanel = ({ product, id }) => {
    const dispatch = useDispatch();
    const { products_to_order, product_list } = useSelector(state => state.order);
    const { colors_list } = useSelector(state => state.material);
    const { sizes_list } = useSelector(state => state.size);

    const [displayedSizes, setDisplayedSizes] = useState([]);

    useEffect(() => {
        dispatch(getOrderProductList());
        dispatch(getColors());
        dispatch(getSizesList());
    }, []);

    const getValue = (value, name, index, sizeId) => {
        dispatch(change_prod_amounts({ id, index, name, value, sizeId }));
    };

    const getValueMain = (name, value) => {
        dispatch(change_prod_main({ index: id, name, value }));
    };

    const handleSelect = (value) => {
        const index = product_list.findIndex(item => item.id === value);
        dispatch(change_prod_main({ index: id, name: 'nomenclature', value }));
        dispatch(change_prod_main({ index: id, name: 'cost_price', value: `${product_list[index].cost_price}` }));
    };

    const addRow = () => {
        dispatch(addAmount());
    };

    const deleteRow = (index) => {
        dispatch(deleteAmount({ id, index }));
    };

    const addSizeColumn = (sizeId) => {
        if (!displayedSizes.some(size => size.id === sizeId)) {
            const selectedSize = sizes_list.find(size => size.id === sizeId);
            if (selectedSize) {
                setDisplayedSizes([...displayedSizes, selectedSize]);
            }
        } else {
            toast.error('Размер уже добавлен');
        }
    };

    const removeSizeColumn = (sizeId) => {
        setDisplayedSizes(displayedSizes.filter(size => size.id !== sizeId));
    };

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
                <Table bordered cellBordered data={product.amounts || []} autoHeight>
                    <Table.Column width={180} fixed>
                        <Table.HeaderCell>Цвет</Table.HeaderCell>
                        <Table.Cell style={{ padding: '7px 6px' }}>
                            {(rowData, index) =>
                                <SelectForTable
                                    searchable
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

                    {/* Динамически добавляемые размеры */}
                    {displayedSizes.map((sizeItem, sIndex) => (
                        <Table.Column key={sIndex} width={100}>
                            <Table.HeaderCell style={{ padding: '3px' }}>
                                <div className='w-full h-full flex items-center justify-center gap-x-2 relative'>
                                    <span className='font-inter text-xs font-semibold'>{sizeItem.title}</span>
                                    <button className='absolute top-0 right-0' onClick={() => removeSizeColumn(sizeItem.id)}>
                                        <X size={16} color="#C2185B" />
                                    </button>
                                </div>
                            </Table.HeaderCell>
                            <Table.Cell style={{ padding: '7px 6px' }}>
                                {(rowData, index) => (
                                    <NumInputForTable
                                        value={rowData.sizes?.find(s => s.size === sizeItem.id)?.amount || ""}
                                        placeholder={'0'}
                                        onChange={(e) => getValue(e, 'size', index, sizeItem.id)}
                                    />
                                )}
                            </Table.Cell>
                        </Table.Column>
                    ))}

                    {/* Выбор размера перед добавлением */}
                    <Table.Column width={110}>
                        <Table.HeaderCell style={{ padding: '6px' }}>
                            <SelectForTable
                                data={sizes_list || []}
                                value={""}
                                searchable={true}
                                placeholder="+Размер"
                                labelKey={'title'}
                                valueKey={'id'}
                                onChange={(sizeId) => addSizeColumn(sizeId)}
                            />
                        </Table.HeaderCell>
                        <Table.Cell style={{ padding: '7px 6px' }}>
                            <NumInputForTable placeholder={'0'} disabled />
                        </Table.Cell>
                    </Table.Column>

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
    );
};

export default ProdPanel;
