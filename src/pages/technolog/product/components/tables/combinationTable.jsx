import React, { useEffect, useState } from 'react'
import { getOperation, getOperationsTitlesList } from '../../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../../components/ui/inputs/selectForTable';
import { CircleMinus, PencilLine, Plus, GripVertical } from 'lucide-react';
import { getRankList } from '../../../../../store/technolog/rank';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';
import { getValueOperationInCombination, fillCombination, addOperationInCombination, deleteOperationInCombination, reorderCombinations } from '../../../../../store/technolog/product';
import AddCombination from './../modals/addCombination';
import EditCombinations from '../modals/editCombinations';
import { roundTo } from '../../../../../utils/functions/numFuncs';

const { Column, HeaderCell, Cell } = Table;

const CombinationsTable = ({ type }) => {

  const { operations_list } = useSelector(state => state.calculation);
  const { combinations, product_status } = useSelector(state => state.product)
  const { rank_list } = useSelector(state => state.rank);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [modals, setModals] = useState({ combination: false, edit: false });
  const [editComb, setEditComb] = useState({});
  
  // Состояние для drag and drop
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  useEffect(() => {
    if(!rank_list) {
        dispatch(getRankList());
    } 
    if(!operations_list) {
        dispatch(getOperationsTitlesList());
    }
  }, [dispatch])

  const addRow = () => {
    setModals({ ...modals, combination: true });
  }

  const deleteRow = (data) => {
    const parentSymbol = Object.getOwnPropertySymbols(data).find(sym => sym.toString().includes('parent'));
    const parent = parentSymbol ? data[parentSymbol] : null;
    const parentId = parent ? parent.id : null;
    const parentIndex = combinations.findIndex(item => item.id === parentId);
    
    const childIndex = combinations[parentIndex]?.children?.findIndex(item => item.id === data?.id )
    dispatch(deleteOperationInCombination({ parentIndex, childIndex }))
  }

  const addOperationRow = (data) => {
    const key = combinations?.findIndex(item => item.id === data?.id);
    
    dispatch(addOperationInCombination({ key: Number(key) }))
  }

  const getValue = (value, name, key, data) => {
    const parentSymbol = Object.getOwnPropertySymbols(data).find(sym => sym.toString().includes('parent'));
    const parent = parentSymbol ? data[parentSymbol] : null;
    const parentId = parent ? parent.id : null;
    const parentIndex = combinations.findIndex(item => item.id === parentId);

    const childIndex = combinations[parentIndex]?.children?.findIndex(item => item.id === key )
    
    if(name === 'rank') {
        dispatch(getValueOperationInCombination({ value, name, parentIndex, childIndex }))
        const rank_kef = rank_list.find(item => item.id === value)?.percent;
        dispatch(getValueOperationInCombination({ name: 'price', value: roundTo(rank_kef * data.time, 2) || '', parentIndex, childIndex }));
    } else if(name === 'time') {
        dispatch(getValueOperationInCombination({ value, name, parentIndex, childIndex }))
        const rank_kef = rank_list.find(item => item.id === data?.rank)?.percent;
        dispatch(getValueOperationInCombination({ name: 'price', value: roundTo(rank_kef * value, 2) || '', parentIndex, childIndex }));
    } else {
        dispatch(getValueOperationInCombination({ value, name, parentIndex, childIndex }))
    }
  };

  const editCombination = (data) => {
    const index = combinations.findIndex(item => item.id === data.id);
    
    setEditComb({
        data,
        index
    })
    setModals({ ...modals, edit: true });
  } 

  const handleSelect = (id, index, data) => {
    setLoading(true);
    dispatch(getOperation({ id })).then(res => {
      if(res.meta.requestStatus === 'fulfilled') {

        const rank_kef = rank_list.find(item => item.id === res.payload.rank?.id)?.percent;
        const parentSymbol = Object.getOwnPropertySymbols(data).find(sym => sym.toString().includes('parent'));
        const parent = parentSymbol ? data[parentSymbol] : null;
        const parentId = parent ? parent.id : null;
        const parentIndex = combinations.findIndex(item => item.id === parentId);

        const childIndex = combinations[parentIndex]?.children?.findIndex(item => item.id === data.id )


          dispatch(fillCombination({ childIndex, parentIndex, value: {
                title: res.payload.title,
                time:  res.payload.time,
                rank: res.payload.rank?.id,
                price: (res.payload.time * rank_kef).toFixed(2) 
          }}))
      }
      setLoading(false);
    })  
  }

  const sumChildValues = (children, key) => {
    if (!children || children.length === 0) return 0;
    return children.reduce((acc, item) => acc + (Number(item[key]) || 0), 0).toFixed(2);
  };

  // Функции для drag and drop
  const handleDragStart = (e, rowData, index) => {
    // Разрешаем перетаскивание только для родительских элементов (комбинаций)
    if (rowData.children) {
      setDraggedItem({ data: rowData, index });
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target.outerHTML);
      
      // Добавляем стили для перетаскиваемого элемента
      e.target.style.opacity = '0.5';
    } else {
      e.preventDefault();
    }
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e, rowData, index) => {
    e.preventDefault();
    
    // Разрешаем drop только на родительские элементы (комбинации)
    if (rowData.children && draggedItem) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e, rowData, dropIndex) => {
    e.preventDefault();
    
    if (!draggedItem || !rowData.children) return;
    
    const dragIndex = draggedItem.index;
    
    if (dragIndex !== dropIndex) {
      dispatch(reorderCombinations({ 
        fromIndex: dragIndex, 
        toIndex: dropIndex 
      }));
    }
    
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  // Функция для получения стилей строки
  const getRowStyle = (rowData, index) => {
    let style = { padding: '7px 6px' };
    
    // Стили для drag over
    if (dragOverIndex === index && rowData.children) {
      style.backgroundColor = '#f0f8ff';
      style.borderTop = '2px solid #0066cc';
    }
    
    return style;
  };

  return (
    <div>
        <Table
            data={combinations || []}
            bordered
            loading={loading || (type === 'edit' && product_status === 'loading') || product_status === 'kochuruu'}
            cellBordered
            autoHeight
            isTree
            virtualized
            rowKey='id'
        >
            <Column width={50}>
                <HeaderCell></HeaderCell>
                <Cell style={{ padding: '0px 6px', cursor: 'grab' }}>
                    {(rowData, index) =>
                        rowData.children ? (
                            <div
                                draggable
                                onDragStart={(e) => handleDragStart(e, rowData, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, rowData, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, rowData, index)}
                                style={{ cursor: 'grab' }}
                                onMouseDown={(e) => e.target.style.cursor = 'grabbing'}
                                onMouseUp={(e) => e.target.style.cursor = 'grab'}
                            >
                                <GripVertical size={20} color="#666" />
                            </div>
                        ) : null
                    }
                </Cell>
            </Column>
            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={(rowData, index) => getRowStyle(rowData, index)}>
                    {(rowData, index) =>
                        <div
                            onDragOver={rowData.children ? (e) => handleDragOver(e, rowData, index) : undefined}
                            onDragLeave={rowData.children ? handleDragLeave : undefined}
                            onDrop={rowData.children ? (e) => handleDrop(e, rowData, index) : undefined}
                        >
                            {rowData.children ? 
                                <span className='font-inter'>
                                    {rowData?.title}
                                </span>
                            : (
                                <InputWithSuggestions
                                    value={rowData.title}
                                    placeholder="Название"
                                    onChange={(e) => getValue(e.target.value, "title", rowData.id, rowData)}
                                    onSelect={(id) => handleSelect(id, index, rowData)}
                                    suggestions={operations_list}
                                />
                            )
                            }
                        </div>
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Время (сек)</HeaderCell>
                <Cell style={(rowData, index) => getRowStyle(rowData, index)}>
                    {(rowData, index) =>
                        <div
                            onDragOver={rowData.children ? (e) => handleDragOver(e, rowData, index) : undefined}
                            onDragLeave={rowData.children ? handleDragLeave : undefined}
                            onDrop={rowData.children ? (e) => handleDrop(e, rowData, index) : undefined}
                        >
                            {rowData.children ? (
                                <span className="p-2">
                                    {sumChildValues(rowData.children, 'time')}
                                </span>
                            ) : (
                                <NumInputForTable
                                    value={rowData.time}
                                    placeholder="0"
                                    onChange={(e) => getValue(e, "time", rowData.id, rowData)}
                                />
                            )
                            }
                        </div>
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Разряд</HeaderCell>
                <Cell style={(rowData, index) => getRowStyle(rowData, index)}>
                    {(rowData, index) =>
                        <div
                            onDragOver={rowData.children ? (e) => handleDragOver(e, rowData, index) : undefined}
                            onDragLeave={rowData.children ? handleDragLeave : undefined}
                            onDrop={rowData.children ? (e) => handleDrop(e, rowData, index) : undefined}
                        >
                            {rowData.children ? null : (
                                <SelectForTable
                                    value={rowData.rank}
                                    placeholder="Разряд"
                                    onChange={(e) => getValue(e, "rank", rowData.id, rowData)}
                                    data={rank_list || []}
                                    valueKey='id'
                                    labelKey='title'
                                />
                            )
                            }
                        </div>
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Цена (сом)</HeaderCell>
                <Cell style={(rowData, index) => getRowStyle(rowData, index)}>
                    {(rowData, index) =>
                        <div
                            onDragOver={rowData.children ? (e) => handleDragOver(e, rowData, index) : undefined}
                            onDragLeave={rowData.children ? handleDragLeave : undefined}
                            onDrop={rowData.children ? (e) => handleDrop(e, rowData, index) : undefined}
                        >
                            {rowData.children ? (
                                <span className='p-2'>
                                    {sumChildValues(rowData.children, 'price')}
                                </span>
                            ) : (
                                <NumInputForTable
                                    value={rowData.price}
                                    placeholder="0"
                                    onChange={(e) => getValue(e, "price", rowData.id, rowData)}
                                />
                            )
                            }
                        </div>
                    }
                </Cell>
            </Column>
            <Column width={150}>
                <HeaderCell align="center">
                    <button onClick={addRow} className="cursor-pointer">
                         <Plus color="#00796B" />
                    </button>
                </HeaderCell>
                <Cell style={(rowData, index) => getRowStyle(rowData, index)}>
                    {(rowData, index) =>
                        <div
                            onDragOver={rowData.children ? (e) => handleDragOver(e, rowData, index) : undefined}
                            onDragLeave={rowData.children ? handleDragLeave : undefined}
                            onDrop={rowData.children ? (e) => handleDrop(e, rowData, index) : undefined}
                        >
                            {rowData.children ? 
                                <div className='flex justify-evenly gap-x-4'>
                                    <button onClick={() => addOperationRow(rowData)} key={rowData?.id + index} className="cursor-pointer">
                                        <Plus color="#0D47A1" />
                                    </button>
                                    <button onClick={() => editCombination(rowData)} className="cursor-pointer">
                                        <PencilLine color='#616161'/>
                                    </button>
                                </div>
                            : (
                                <div className='flex justify-center'>
                                    <button onClick={() => deleteRow(rowData)} className="cursor-pointer">
                                        <CircleMinus color="#C2185B" />
                                    </button>
                                </div>
                            )
                            }
                        </div>
                    }
                </Cell>
            </Column>
        </Table>
        <AddCombination modals={modals} setModals={setModals}/>
        <EditCombinations modals={modals} setModals={setModals} data={editComb} setData={setEditComb}/>
    </div>
  )
}

export default CombinationsTable