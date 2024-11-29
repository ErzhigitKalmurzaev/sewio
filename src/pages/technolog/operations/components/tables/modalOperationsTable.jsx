import React, { useState } from 'react'
import { Table } from 'rsuite'
import NumInput from '../../../../../components/ui/inputs/numInput'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable'

const { Column, HeaderCell, Cell } = Table

const ModalOperationsTable = ({ data, status, setData }) => {

  return (
        <Table
            loading={status === 'loading'}
            data={data}
            cellBordered
            height={400}
            className='rounded-xl'
        >
            <Column width={80} align='center'>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>
            <Column width={200}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={150}>
                <HeaderCell>Распределено</HeaderCell>
                <Cell>
                    {(rowData) => (
                        rowData.type === 'operation' && <p>{rowData.assigned}/{rowData.required}</p>
                    )}
                </Cell>
            </Column>

            <Column width={230}>
                <HeaderCell>Количество для каждого сотрудника</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) => (
                        <div>
                            <NumInputForTable
                                value={rowData.amount}
                                placeholder='0'
                                onChange={(value) => setData(data.map((item, i) => (i === index ? { ...item, amount: value } : item)))}
                            />
                        </div>
                    )}
                </Cell>
            </Column>
        </Table>
  )
}

export default ModalOperationsTable
