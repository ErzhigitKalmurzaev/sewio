import React, { useEffect, useState } from 'react'
import { addOperation, deleteOperation, fillOperation, getValueOperation } from '../../../../../store/technolog/product';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../../components/ui/inputs/selectForTable';
import { CircleMinus, Plus } from 'lucide-react';
import { getRankList } from '../../../../../store/technolog/rank';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';
import { getOperation, getOperationsTitlesList } from '../../../../../store/technolog/calculation';
import { getEquipmentList } from './../../../../../store/technolog/equipment';

const { Column, HeaderCell, Cell } = Table;

const OperationsTable = ({ type }) => {

  const { operations_list } = useSelector(state => state.calculation);
  const { operations, product_status  } = useSelector(state => state.product);
  const { rank_list } = useSelector(state => state.rank);
  const { equipment_list } = useSelector(state => state.equipment);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!rank_list) {
        dispatch(getRankList());
    } 
    if(!operations_list) {
        dispatch(getOperationsTitlesList());
    }
    if(!equipment_list) {
        dispatch(getEquipmentList());
    }
  }, [])

  const addRow = () => {
    dispatch(addOperation())
  }

  const deleteRow = (key) => {
      dispatch(deleteOperation(key))
  }

  const getValue = (value, name, key) => {
    if(name === 'rank') {
        dispatch(getValueOperation({ key, name, value }));
        const rank_kef = rank_list.find(item => item.id === value)?.percent;
        dispatch(getValueOperation({ key, name: 'price', value: rank_kef * operations[key].time || '' }));
    } else if(name === 'time') {
        dispatch(getValueOperation({ key, name, value }));
        const rank_kef = rank_list.find(item => item.id === operations[key].rank)?.percent;
        dispatch(getValueOperation({ key, name: 'price', value: rank_kef * value || '' }));
    } else {
        dispatch(getValueOperation({ key, name, value }));
    }
  }

  const handleSelect = (id, index) => {
    setLoading(true);
    dispatch(getOperation({ id })).then(res => {
      if(res.meta.requestStatus === 'fulfilled') {

          const rank_kef = rank_list.find(item => item.id === res.payload.rank?.id)?.percent;

          dispatch(fillOperation({ key: index, value: {
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
            data={operations || []}
            bordered
            loading={loading || (type === 'edit' && product_status === 'loading')}
            cellBordered
            autoHeight
        >
            <Column width={250}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ padding: '7px 6px' }}>
                    {(rowData, index) =>
                        <InputWithSuggestions
                            value={rowData.title}
                            placeholder="Название"
                            onChange={(e) => getValue(e.target.value, "title", index)}
                            onSelect={(id) => handleSelect(id, index)}
                            suggestions={operations_list}
                        />
                    }
                </Cell>
            </Column>
            <Column width={180}>
                <HeaderCell>Время (сек)</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <NumInputForTable
                            value={rowData.time}
                            placeholder="0"
                            onChange={(e) => getValue(e, "time", index)}
                        />
                    }
                </Cell>
            </Column>
            <Column width={180}>
                <HeaderCell>Разряд</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <SelectForTable
                            value={rowData.rank}
                            data={rank_list}
                            labelKey="title"
                            valueKey="id"
                            onChange={(e) => getValue(e, "rank", index)}
                            placeholder="Разряд"
                        />
                    }
                </Cell>
            </Column>
            <Column width={180}>
                <HeaderCell>Цена (сом)</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <NumInputForTable
                            value={rowData.price}
                            placeholder="0"
                            onChange={(e) => getValue(e, "price", index)}
                        />
                    }
                </Cell>
            </Column>
            <Column width={180}>
                <HeaderCell>Оборудование</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <SelectForTable
                            value={rowData.equipment}
                            data={equipment_list}
                            labelKey="title"
                            valueKey="id"
                            onChange={(e) => getValue(e, "equipment", index)}
                            placeholder="Оборудование"
                        />
                    }
                </Cell>
            </Column>
            <Column width={100}>
                <HeaderCell align="center">
                    <button onClick={addRow} className="cursor-pointer">
                         <Plus color="#00796B" />
                    </button>
                </HeaderCell>
                <Cell>
                    {(rowData, index) =>
                        <div className='flex justify-center'>
                            <button onClick={() => deleteRow(index)} className="cursor-pointer">
                                <CircleMinus color="#C2185B" />
                            </button>
                        </div>
                    }
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default OperationsTable
