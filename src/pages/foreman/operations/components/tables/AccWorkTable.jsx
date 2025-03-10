import React from 'react'
import { Table } from 'rsuite'

const { Column, HeaderCell, Cell } = Table;

const AccWorkTable = ({ data, status }) => {
  return (
    <div className='min-h-[500px] bg-white rounded-lg'>
      <Table
        data={data || []}
        loading={status === 'loading'}
      >
        <Column width={80} align="center" verticalAlign="center">
            <HeaderCell>Операция</HeaderCell>
            <Cell dataKey="id" />
        </Column>
      </Table>
    </div>
  )
}

export default AccWorkTable
