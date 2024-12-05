import React from 'react'
import { Table } from 'rsuite'

const { Cell, HeaderCell, Column } = Table;

const OperationsTable = ({ data, status, setOperation, setModals }) => {

  const clickRow = (data) => {
    setOperation(data);
    setModals(prev => ({ ...prev, input: true }))
  }

  return (
    <div className='min-h-[500px] font-inter bg-white rounded-md text-xs'>
      <Table
        height={500}
        loading={status === 'loading'}
        data={data || []}
        className='rounded-xl'
        bordered
        cellBordered
        onRowClick={(rowData) => clickRow(rowData)}
      >
        <Column width={60} align="center" fixed>
            <HeaderCell>Заказ №</HeaderCell>
            <Cell dataKey="order_id" />
        </Column>

        <Column width={150}>
            <HeaderCell>Название</HeaderCell>
            <Cell dataKey="operation_title" />
        </Column>

        <Column flexGrow={1}>
            <HeaderCell>Состояние</HeaderCell>
            <Cell>
                {
                    rowData => (
                        <p>{rowData.need_amount} / {rowData.moderation_amount} / {rowData.done_amount}</p>
                    )
                }
            </Cell>
        </Column>

      </Table>
    </div>
  )
}

export default OperationsTable
