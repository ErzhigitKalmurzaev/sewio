import React, { useState } from "react";
import { Table } from "rsuite";
import NumInputForTable from "../../../../../components/ui/inputs/numInputForTable";
import { getValueConsumables } from "../../../../../store/kroi/order";
import { useDispatch, useSelector } from "react-redux";

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const ConsumablesTable = ({  }) => {

  const dispatch = useDispatch();

  const { party_consumables, product_info_status } = useSelector(state => state.kroi_order); 

  const getValue = ({ index, value, name }) => {
    dispatch(getValueConsumables({ index, name, value }));
  }

  return (
    <div>
        <Table
            bordered
            cellBordered
            autoHeight
            loading={product_info_status === 'loading'}
            data={party_consumables || []}
            className="rounded-lg border-2 border-borderGray"
        >
            <Column width={100} align="center" verticalAlign="center">
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={200}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={130}>
                <HeaderCell>Потрачено (м)</HeaderCell>
                <Cell style={{ padding: '6.5px' }}>
                    {
                        (rowData, index) => (
                            <NumInputForTable
                                width={100}
                                value={rowData?.consumption}
                                onChange={value => getValue({ index, value, name: 'consumption' })}
                                placeholder='0'
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={130}>
                <HeaderCell>Брак (м)</HeaderCell>
                <Cell style={{ padding: '6.5px' }}>
                    {
                        (rowData, index) => (
                            <NumInputForTable
                                width={100}
                                value={rowData?.defect}
                                onChange={value => getValue({ index, value, name: 'defect' })}
                                placeholder='0'
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={130}>
                <HeaderCell>Остаток (м)</HeaderCell>
                <Cell style={{ padding: '6.5px' }}>
                    {
                        (rowData, index) => (
                            <NumInputForTable
                                width={100}
                                value={rowData?.left}
                                onChange={value => getValue({ index, value, name: 'left' })}
                                placeholder='0'
                            />
                        )
                    }
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default ConsumablesTable
