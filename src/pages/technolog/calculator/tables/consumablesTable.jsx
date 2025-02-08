import React, { useEffect, useState } from 'react'
import { addConsumable, deleteConsumable, getValueConsumable } from '../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import TextInputForTable from '../../../../components/ui/inputs/textInputForTable';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import { CircleMinus, Plus } from 'lucide-react';

import { getConsumablesTitleList } from '../../../../store/technolog/material';

const { Column, HeaderCell, Cell } = Table;

const ConsumablesTable = () => {

  const { consumables } = useSelector(state => state.calculation);
  const { consumables_title_list } = useSelector(state => state.material);

  const dispatch = useDispatch();

  useEffect(() => {
    if(!consumables_title_list) {
        dispatch(getConsumablesTitleList());
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

  return (
    <div>
        <Table
            data={consumables}
            bordered
            cellBordered
        >
            <Column width={250}>
                <HeaderCell>Сущ. материал</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <SelectForTable
                            value={rowData.nomenclature}
                            data={consumables_title_list}
                            labelKey="title"
                            valueKey="id"
                            onChange={(e) => getValue(e, "nomenclature", index)}
                            placeholder="Материал"
                        />
                    }
                </Cell>
            </Column>
            <Column width={250}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        <TextInputForTable
                            value={rowData.title}
                            placeholder="Название"
                            onChange={(e) => getValue(e.target.value, "title", index)}
                        />
                    }
                </Cell>
            </Column>
            <Column width={250}>
                <HeaderCell>Цена</HeaderCell>
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

export default ConsumablesTable
