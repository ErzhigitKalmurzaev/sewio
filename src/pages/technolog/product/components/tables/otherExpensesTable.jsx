import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import TextInputForTable from '../../../../../components/ui/inputs/textInputForTable';
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { CircleMinus, Plus } from 'lucide-react';
import { addPrice, deletePrice, getValuePrice } from '../../../../../store/technolog/product';


const { Column, HeaderCell, Cell } = Table;

const OtherExpensesTable = ({ type }) => {

  const { prices, product_status } = useSelector(state => state.product);

  const dispatch = useDispatch();

  const addRow = () => {
    dispatch(addPrice())
  }

  const deleteRow = (key) => {
    dispatch(deletePrice(key))
  }

  const getValue = (value, name, key) => {
    dispatch(getValuePrice({ key, name, value })) 
  }

  return (
    <div>
        <Table
            data={prices}
            loading={type === 'edit' && product_status === 'loading' || product_status === 'kochuruu'}
            autoHeight
            bordered
            cellBordered
        >
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
            <Column width={170}>
                <HeaderCell>Цена</HeaderCell>
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

export default OtherExpensesTable
