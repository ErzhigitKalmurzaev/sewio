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
  
  // Улучшенное состояние для drag and drop
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    dispatch(getRankList());
    dispatch(getOperationsTitlesList());
  }, [])

  const addRow = () => {
    setModals({ ...modals, combination: true });
  }

  // Улучшенная функция удаления с более точным поиском
  const deleteRow = (data) => {
    try {
      const parentSymbol = Object.getOwnPropertySymbols(data).find(sym => sym.toString().includes('parent'));
      const parent = parentSymbol ? data[parentSymbol] : null;
      const parentId = parent ? parent.id : null;
      
      if (!parentId) {
        console.error('Parent ID not found for deletion');
        return;
      }

      const parentIndex = combinations.findIndex(item => item.id === parentId);
      
      if (parentIndex === -1) {
        console.error('Parent combination not found:', parentId);
        return;
      }

      // Более надежный поиск дочернего элемента
      const childIndex = combinations[parentIndex]?.children?.findIndex(item => {
        // Используем несколько критериев для точного поиска
        if (data.id && item.id) {
          return item.id === data.id;
        }
        // Если нет ID, используем комбинацию полей
        return item.title === data.title && 
               item.time === data.time && 
               item.price === data.price &&
               item.rank === data.rank;
      });

      if (childIndex === -1) {
        console.error('Child operation not found for deletion');
        return;
      }

      dispatch(deleteOperationInCombination({ parentIndex, childIndex }))
    } catch (error) {
      console.error('Error in deleteRow:', error);
    }
  }

  const addOperationRow = (data) => {
    try {
      const key = combinations?.findIndex(item => item.id === data?.id);
      
      if (key === -1) {
        console.error('Combination not found for adding operation');
        return;
      }
      
      dispatch(addOperationInCombination({ key: Number(key) }))
    } catch (error) {
      console.error('Error in addOperationRow:', error);
    }
  }

  // Кардинально улучшенная функция getValue с детальной валидацией
  const getValue = (value, name, key, data) => {
    try {
      // Детальная валидация входных данных
      if (!data) {
        console.error('getValue: data is missing');
        return;
      }

      if (key === undefined || key === null) {
        console.error('getValue: key is missing');
        return;
      }

      // Отладочная информация
      console.log('getValue called:', {
        value,
        name,
        key,
        dataId: data?.id,
        dataTitle: data?.title,
        hasParentSymbol: Object.getOwnPropertySymbols(data).some(sym => sym.toString().includes('parent'))
      });

      const parentSymbol = Object.getOwnPropertySymbols(data).find(sym => sym.toString().includes('parent'));
      const parent = parentSymbol ? data[parentSymbol] : null;
      const parentId = parent ? parent.id : null;
      
      if (!parentId) {
        console.error('getValue: Parent ID not found');
        return;
      }

      const parentIndex = combinations.findIndex(item => item.id === parentId);
      
      if (parentIndex === -1) {
        console.error('getValue: Parent combination not found:', parentId);
        return;
      }

      if (!combinations[parentIndex]?.children) {
        console.error('getValue: Children array not found');
        return;
      }

      // Улучшенный поиск дочернего элемента с множественными критериями
      const childIndex = combinations[parentIndex].children.findIndex(item => {
        // Приоритет 1: Точное совпадение по ID
        if (data.id && item.id && data.id === item.id) {
          return true;
        }
        
        // Приоритет 2: Если это элемент без ID (новый), ищем по ссылке на объект
        if (!data.id && item === data) {
          return true;
        }
        
        // Приоритет 3: Поиск по уникальной комбинации полей
        if (!data.id || !item.id) {
          return item.title === data.title && 
                 Number(item.time) === Number(data.time) && 
                 Number(item.price) === Number(data.price) &&
                 item.rank === data.rank;
        }
        
        return false;
      });

      if (childIndex === -1) {
        console.error('getValue: Child operation not found', {
          parentIndex,
          dataId: data.id,
          dataTitle: data.title,
          childrenCount: combinations[parentIndex].children.length,
          childrenIds: combinations[parentIndex].children.map(c => ({ id: c.id, title: c.title }))
        });
        return;
      }

      console.log('getValue: Found child at index', childIndex);

      // Приведение типов для числовых значений
      const processedValue = (name === 'time' || name === 'price') 
        ? Number(value) || 0 
        : value;

      if (name === 'rank') {
        dispatch(getValueOperationInCombination({ 
          value: processedValue, 
          name, 
          parentIndex, 
          childIndex 
        }));
        
        const rank_kef = rank_list.find(item => item.id === processedValue)?.percent;
        if (rank_kef !== undefined) {
          const calculatedPrice = roundTo(rank_kef * Number(data.time || 0), 2) || 0;
          dispatch(getValueOperationInCombination({ 
            name: 'price', 
            value: calculatedPrice, 
            parentIndex, 
            childIndex 
          }));
        }
      } else if (name === 'time') {
        dispatch(getValueOperationInCombination({ 
          value: processedValue, 
          name, 
          parentIndex, 
          childIndex 
        }));
        
        const rank_kef = rank_list.find(item => item.id === data?.rank)?.percent;
        if (rank_kef !== undefined) {
          const calculatedPrice = roundTo(rank_kef * processedValue, 2) || 0;
          dispatch(getValueOperationInCombination({ 
            name: 'price', 
            value: calculatedPrice, 
            parentIndex, 
            childIndex 
          }));
        }
      } else {
        dispatch(getValueOperationInCombination({ 
          value: processedValue, 
          name, 
          parentIndex, 
          childIndex 
        }));
      }
    } catch (error) {
      console.error('Error in getValue:', error);
    }
  };

  const editCombination = (data) => {
    try {
      const index = combinations.findIndex(item => item.id === data.id);
      
      if (index === -1) {
        console.error('Combination not found for editing');
        return;
      }
      
      setEditComb({
          data,
          index
      })
      setModals({ ...modals, edit: true });
    } catch (error) {
      console.error('Error in editCombination:', error);
    }
  } 

  // Улучшенная функция handleSelect с лучшей обработкой ошибок
  const handleSelect = (id, index, data) => {
    try {
      setLoading(true);
      dispatch(getOperation({ id })).then(res => {
        try {
          if (res.meta.requestStatus === 'fulfilled') {
            const parentSymbol = Object.getOwnPropertySymbols(data).find(sym => sym.toString().includes('parent'));
            const parent = parentSymbol ? data[parentSymbol] : null;
            const parentId = parent ? parent.id : null;
            
            if (!parentId) {
              console.error('handleSelect: Parent ID not found');
              return;
            }

            const parentIndex = combinations.findIndex(item => item.id === parentId);
            
            if (parentIndex === -1) {
              console.error('handleSelect: Parent combination not found');
              return;
            }

            const childIndex = combinations[parentIndex]?.children?.findIndex(item => {
              if (data.id && item.id) {
                return item.id === data.id;
              }
              return item === data;
            });

            if (childIndex === -1) {
              console.error('handleSelect: Child operation not found');
              return;
            }

            const rank_kef = rank_list.find(item => item.id === res.payload.rank?.id)?.percent;
            
            dispatch(fillCombination({ 
              childIndex, 
              parentIndex, 
              value: {
                title: res.payload.title || "",
                time: Number(res.payload.time) || 0,
                rank: res.payload.rank?.id || null,
                price: Number(res.payload.price) || 0
              }
            }))
          }
        } catch (innerError) {
          console.error('Error processing handleSelect response:', innerError);
        } finally {
          setLoading(false);
        }
      }).catch(error => {
        console.error('Error in handleSelect dispatch:', error);
        setLoading(false);
      })  
    } catch (error) {
      console.error('Error in handleSelect:', error);
      setLoading(false);
    }
  }

  const sumChildValues = (children, key) => {
    if (!children || children.length === 0) return 0;
    return children.reduce((acc, item) => {
      const value = Number(item[key]) || 0;
      return acc + value;
    }, 0).toFixed(2);
  };

  // Функция для получения реального индекса комбинации в массиве
  const getCombinationIndex = (rowData) => {
    if (!rowData || !rowData.id) return -1;
    return combinations.findIndex(item => item.id === rowData.id);
  };

  // Проверка, является ли элемент родительской комбинацией
  const isCombination = (rowData) => {
    return rowData && rowData.children !== undefined;
  };

  // Улучшенные функции для drag and drop
  const handleDragStart = (e, rowData, visualIndex) => {
    try {
      // Разрешаем перетаскивание только для родительских элементов (комбинаций)
      if (!isCombination(rowData)) {
        e.preventDefault();
        return;
      }

      const realIndex = getCombinationIndex(rowData);
      if (realIndex === -1) {
        e.preventDefault();
        return;
      }

      setDraggedItem({ 
        data: rowData, 
        realIndex: realIndex,
        visualIndex: visualIndex 
      });
      setIsDragging(true);
      
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', '');
      
      // Добавляем стили для перетаскиваемого элемента
      setTimeout(() => {
        if (e.target) {
          e.target.style.opacity = '0.5';
        }
      }, 0);
    } catch (error) {
      console.error('Error in handleDragStart:', error);
    }
  };

  const handleDragEnd = (e) => {
    try {
      if (e.target) {
        e.target.style.opacity = '1';
      }
      setDraggedItem(null);
      setDragOverIndex(null);
      setIsDragging(false);
    } catch (error) {
      console.error('Error in handleDragEnd:', error);
    }
  };

  const handleDragOver = (e, rowData, visualIndex) => {
    try {
      e.preventDefault();
      
      // Разрешаем drop только на родительские элементы (комбинации)
      if (!isCombination(rowData) || !draggedItem) {
        return;
      }

      const realIndex = getCombinationIndex(rowData);
      if (realIndex === -1) return;

      e.dataTransfer.dropEffect = 'move';
      setDragOverIndex(realIndex);
    } catch (error) {
      console.error('Error in handleDragOver:', error);
    }
  };

  const handleDragLeave = (e) => {
    try {
      // Проверяем, что мы действительно покидаем элемент, а не переходим к дочернему
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;
      
      if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
        setDragOverIndex(null);
      }
    } catch (error) {
      console.error('Error in handleDragLeave:', error);
    }
  };

  const handleDrop = (e, rowData, visualIndex) => {
    try {
      e.preventDefault();
      
      if (!draggedItem || !isCombination(rowData)) {
        return;
      }
      
      const dragRealIndex = draggedItem.realIndex;
      const dropRealIndex = getCombinationIndex(rowData);
      
      if (dragRealIndex === -1 || dropRealIndex === -1 || dragRealIndex === dropRealIndex) {
        return;
      }
      
      // Проверяем, что элементы существуют
      if (!combinations[dragRealIndex] || !combinations[dropRealIndex]) {
        console.error('Invalid drag or drop index:', { 
          dragRealIndex, 
          dropRealIndex, 
          combinationsLength: combinations.length 
        });
        return;
      }
      
      dispatch(reorderCombinations({ 
        fromIndex: dragRealIndex, 
        toIndex: dropRealIndex 
      }));
      
      setDraggedItem(null);
      setDragOverIndex(null);
    } catch (error) {
      console.error('Error in handleDrop:', error);
    }
  };

  // Функция для получения стилей строки
  const getRowStyle = (rowData, visualIndex) => {
    let style = { padding: '0px' };
    
    if (!rowData) return style;
    
    try {
      // Стили для drag over (только для комбинаций)
      if (isCombination(rowData)) {
        const realIndex = getCombinationIndex(rowData);
        
        if (dragOverIndex === realIndex && isDragging) {
          style.backgroundColor = '#f0f8ff';
          style.borderTop = '2px solid #0066cc';
          style.transition = 'all 0.2s ease';
        }
        
        // Стили для перетаскиваемого элемента
        if (draggedItem && draggedItem.realIndex === realIndex) {
          style.opacity = '0.7';
          style.transform = 'scale(0.98)';
        }
      }
    } catch (error) {
      console.error('Error in getRowStyle:', error);
    }
    
    return style;
  };

  // Функция для получения стилей курсора
  const getCursorStyle = (rowData) => {
    try {
      if (!isCombination(rowData)) return {};
      
      return {
        cursor: isDragging ? 'grabbing' : 'grab'
      };
    } catch (error) {
      console.error('Error in getCursorStyle:', error);
      return {};
    }
  };

  // Безопасная функция для рендера ячеек
  const renderCell = (content, rowData, visualIndex, isDragTarget = false) => {
    const baseProps = {
      style: { padding: '0px' }
    };

    if (isDragTarget && isCombination(rowData)) {
      baseProps.onDragOver = (e) => handleDragOver(e, rowData, visualIndex);
      baseProps.onDragLeave = handleDragLeave;
      baseProps.onDrop = (e) => handleDrop(e, rowData, visualIndex);
    }

    return <div {...baseProps}>{content}</div>;
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
            <Column width={60}>
                <HeaderCell>Развернуть</HeaderCell>
                <Cell className='p-0'>
                    {(rowData, visualIndex) => {
                        if (!isCombination(rowData)) return null;
                        
                        return <></>
                    }}
                </Cell>
            </Column>
            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ ...getRowStyle, padding: '7px 6px' }}>
                    {(rowData, visualIndex) =>
                        renderCell(
                            isCombination(rowData) ? 
                                <span className='font-inter'>
                                    {rowData?.title || 'Без названия'}
                                </span>
                            : (
                                <InputWithSuggestions
                                    value={rowData?.title || ''}
                                    placeholder="Название"
                                    onChange={(e) => getValue(e.target.value, "title", rowData?.id || rowData, rowData)}
                                    onSelect={(id) => handleSelect(id, visualIndex, rowData)}
                                    suggestions={operations_list || []}
                                />
                            ),
                            rowData, 
                            visualIndex, 
                            true
                        )
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Время (сек)</HeaderCell>
                <Cell style={{ ...getRowStyle, padding: '7px 6px' }}>
                    {(rowData, visualIndex) =>
                        renderCell(
                            isCombination(rowData) ? (
                                <span className="p-2">
                                    {sumChildValues(rowData.children, 'time')}
                                </span>
                            ) : (
                                <NumInputForTable
                                    value={rowData?.time || ''}
                                    placeholder="0"
                                    onChange={(e) => getValue(e, "time", rowData?.id || rowData, rowData)}
                                />
                            ),
                            rowData, 
                            visualIndex, 
                            true
                        )
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Разряд</HeaderCell>
                <Cell style={{ ...getRowStyle, padding: '7px 6px' }}>
                    {(rowData, visualIndex) =>
                        renderCell(
                            isCombination(rowData) ? null : (
                                <SelectForTable
                                    value={rowData?.rank || ''}
                                    placeholder="Разряд"
                                    onChange={(e) => getValue(e, "rank", rowData?.id || rowData, rowData)}
                                    data={rank_list || []}
                                    valueKey='id'
                                    labelKey='title'
                                />
                            ),
                            rowData, 
                            visualIndex, 
                            true
                        )
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Цена (сом)</HeaderCell>
                <Cell style={{ ...getRowStyle, padding: '7px 6px' }}>
                    {(rowData, visualIndex) =>
                        renderCell(
                            isCombination(rowData) ? (
                                <span className='p-2'>
                                    {sumChildValues(rowData.children, 'price')}
                                </span>
                            ) : (
                                <NumInputForTable
                                    value={rowData?.price || ''}
                                    placeholder="0"
                                    onChange={(e) => getValue(e, "price", rowData?.id || rowData, rowData)}
                                />
                            ),
                            rowData, 
                            visualIndex, 
                            true
                        )
                    }
                </Cell>
            </Column>
            <Column width={150}>
                <HeaderCell align="center">
                    <button onClick={addRow} className="cursor-pointer">
                         <Plus color="#00796B" />
                    </button>
                </HeaderCell>
                <Cell style={getRowStyle}>
                    {(rowData, visualIndex) =>
                        renderCell(
                            isCombination(rowData) ? 
                                <div className='flex justify-evenly gap-x-4'>
                                    <button 
                                        onClick={() => addOperationRow(rowData)} 
                                        key={`${rowData?.id}_${visualIndex}`} 
                                        className="cursor-pointer"
                                    >
                                        <Plus color="#0D47A1" />
                                    </button>
                                    <button 
                                        onClick={() => editCombination(rowData)} 
                                        className="cursor-pointer"
                                    >
                                        <PencilLine color='#616161'/>
                                    </button>
                                </div>
                            : (
                                <div className='flex justify-center'>
                                    <button 
                                        onClick={() => deleteRow(rowData)} 
                                        className="cursor-pointer"
                                    >
                                        <CircleMinus color="#C2185B" />
                                    </button>
                                </div>
                            ),
                            rowData, 
                            visualIndex, 
                            true
                        )
                    }
                </Cell>
            </Column>
            <Column width={60}>
                <HeaderCell align="center">Порядок</HeaderCell>
                <Cell style={{ padding: '5px 8px', textAlign: 'center' }}>
                    {(rowData, visualIndex) => {
                        if (!isCombination(rowData)) return null;
                        
                        return (
                            <div
                                draggable={!isDragging || draggedItem?.realIndex === getCombinationIndex(rowData)}
                                onDragStart={(e) => handleDragStart(e, rowData, visualIndex)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, rowData, visualIndex)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, rowData, visualIndex)}
                                style={{
                                    ...getCursorStyle(rowData),
                                    padding: '7px',
                                    borderRadius: '6px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: isDragging && draggedItem?.realIndex === getCombinationIndex(rowData) 
                                        ? '#f0f8ff' 
                                        : '#fafafa',
                                    border: '1px solid #d9d9d9',
                                    transition: 'all 0.2s ease',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isDragging) {
                                        e.currentTarget.style.backgroundColor = '#e6f7ff';
                                        e.currentTarget.style.borderColor = '#91d5ff';
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isDragging) {
                                        e.currentTarget.style.backgroundColor = '#fafafa';
                                        e.currentTarget.style.borderColor = '#d9d9d9';
                                        e.currentTarget.style.transform = 'scale(1)';
                                    }
                                }}
                                title="Перетащите для изменения порядка"
                            >
                                <GripVertical size={20} color="#666" />
                            </div>
                        );
                    }}
                </Cell>
            </Column>
        </Table>
        <AddCombination modals={modals} setModals={setModals}/>
        <EditCombinations modals={modals} setModals={setModals} data={editComb} setData={setEditComb}/>
    </div>
  )
}

export default CombinationsTable