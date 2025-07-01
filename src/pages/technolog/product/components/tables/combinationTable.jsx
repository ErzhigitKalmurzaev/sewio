import React, { useEffect, useState } from 'react'
import { getOperation, getOperationsTitlesList } from '../../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../../components/ui/inputs/selectForTable';
import { CircleMinus, PencilLine, Plus } from 'lucide-react';
import { getRankList } from '../../../../../store/technolog/rank';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';
import { getValueOperationInCombination, fillCombination, addOperationInCombination, deleteOperationInCombination, } from '../../../../../store/technolog/product';
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
                price: res.payload.time * rank_kef 
          }}))
      }
      setLoading(false);
    })  
  }

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
            <Column width={350}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? 
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
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Время (сек)</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? null : (
                            <NumInputForTable
                                value={rowData.time}
                                placeholder="0"
                                onChange={(e) => getValue(e, "time", rowData.id, rowData)}
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Разряд</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? null : (
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
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Цена (сом)</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? null : (
                            <NumInputForTable
                                value={rowData.price}
                                placeholder="0"
                                onChange={(e) => getValue(e, "price", rowData.id, rowData)}
                            />
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
                <Cell>
                    {(rowData, index) =>
                        rowData.children ? 
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
                </Cell>
            </Column>
        </Table>
        <AddCombination modals={modals} setModals={setModals}/>
        <EditCombinations modals={modals} setModals={setModals} data={editComb} setData={setEditComb}/>
    </div>
  )
}

export default CombinationsTable
