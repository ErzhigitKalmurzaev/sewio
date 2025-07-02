import React, { useEffect, useState } from 'react'
import { addConsumable, deleteConsumable, getValueConsumable, fillConsumable } from '../../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../../components/ui/inputs/selectForTable';
import { CircleMinus, Plus } from 'lucide-react';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';

import { getColors, getConsumablesTitleList } from '../../../../../store/technolog/material';
import { materialUnits } from '../../../../../utils/selectDatas/productDatas';
import { getMaterial } from './../../../../../store/technolog/material';

const { Column, HeaderCell, Cell } = Table;

const ConsumablesTable = ({ type }) => {

  const { consumables, calc_status } = useSelector(state => state.calculation);
  const { consumables_title_list } = useSelector(state => state.material);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!consumables_title_list) {
        dispatch(getConsumablesTitleList());
        dispatch(getColors())
    }
  }, [])

  const addRow = () => {
    dispatch(addConsumable())
  }

  const deleteRow = (key) => {
    dispatch(deleteConsumable(key))
  }

  const getValue = (value, name, key) => {
    dispatch(getValueConsumable({ key, name, value }))
  }

  const handleSelect = (id, index) => {
    setLoading(true);
    dispatch(getMaterial({ id }))
    .then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
            dispatch(fillConsumable({ key: index, value: {
                material_nomenclature: res.payload.id,
                title: res.payload.title,
                consumption: '',
                unit: res.payload.unit,
                price: res.payload.cost_price.toFixed(1)
            }}))
        }
        setLoading(false);
    })
  }

  return (
    <div>
        <Table
            data={consumables}
            autoHeight
            bordered
            loading={loading || (type === 'edit' && calc_status === 'loading') || calc_status === 'kochuruu'}
            cellBordered
        >
            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <InputWithSuggestions
                            value={rowData.title}
                            placeholder="Название"
                            onChange={(e) => getValue(e.target.value, "title", index)}
                            onSelect={(id) => handleSelect(id, index)}
                            suggestions={consumables_title_list}
                        />
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Расход</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <NumInputForTable
                            value={rowData.consumption}
                            placeholder="0"
                            onChange={(e) => getValue(e, "consumption", index)}
                        />
                    }
                </Cell>
            </Column>
            <Column width={150}>
                <HeaderCell>Ед. измер.</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <SelectForTable
                            value={rowData.unit}
                            data={materialUnits}
                            placeholder="Ед. измер."
                            disabled={true}
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

export default ConsumablesTable
