import React, { useEffect, useState } from 'react'
import { addOperation, deleteOperation, fillOperation, getOperation, getOperationsTitlesList, getValueOperation } from '../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import TextInputForTable from '../../../../components/ui/inputs/textInputForTable';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import { CircleMinus, Plus } from 'lucide-react';
import { getRankList } from '../../../../store/technolog/rank';
import InputWithSuggestions from '../../../../components/ui/inputs/inputWithSuggestions';

const { Column, HeaderCell, Cell } = Table;

const OperationsTable = () => {

  const { operations, operations_list } = useSelector(state => state.calculation);
  const { rank_list } = useSelector(state => state.rank);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!rank_list) {
        dispatch(getRankList());
    } 
    if(!operations_list) {
        dispatch(getOperationsTitlesList());
    }
  }, [])

  const addRow = () => {
    dispatch(addOperation())
  }

  const deleteRow = (key) => {
    dispatch(deleteOperation(key))
  }

  const getValue = (value, name, key) => {
    dispatch(getValueOperation({ key, name, value, rank_list }))
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
            data={operations}
            bordered
            loading={loading}
            cellBordered
            autoHeight
        >
            <Column width={250}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
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
            <Column width={250}>
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
            <Column width={250}>
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
            <Column width={200}>
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
            <Column width={100}>
                <HeaderCell align="center">
                    <button onClick={addRow} className="cursor-pointer">
                         <Plus color="green" />
                    </button>
                </HeaderCell>
                <Cell>
                    {(rowData, index) =>
                        <div className='flex justify-center'>
                            <button onClick={() => deleteRow(index)} className="cursor-pointer">
                                <CircleMinus color="red" />
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
