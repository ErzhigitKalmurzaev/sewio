import React from 'react'
import { Table } from 'rsuite'
import { formatedToDDMMYYYY } from '../../../../utils/functions/dateFuncs';
import { formatNumber } from '../../../../utils/functions/numFuncs';

const { Column, HeaderCell, Cell } = Table;

const ServiceTable = ({ data, status }) => {
  return (
    <Table
      height={400}
      loading={status === 'loading'}
      data={data || []}
      className='rounded-xl font-inter'
    >
      <Column width={80} align="center" fixed>
        <HeaderCell>ID</HeaderCell>
        <Cell dataKey="id" />
      </Column>

      <Column width={200}>
        <HeaderCell>Ответственный</HeaderCell>
        <Cell>
          {(rowData) => (
            <p>{rowData?.staff?.name} {rowData?.staff?.surname}</p>
          )}
        </Cell>
      </Column>

      <Column width={200}>
        <HeaderCell>Дата обслуживания</HeaderCell>
        <Cell>
          {(rowData) => (
            <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>
          )}
        </Cell>
      </Column>

      <Column width={250}>
        <HeaderCell>Тип обслуживания</HeaderCell>
        <Cell dataKey="text" />
      </Column>

      <Column width={200}>
        <HeaderCell>Цена обслуживания</HeaderCell>
        <Cell>
          {(rowData) => (
            <p>{formatNumber(rowData?.price)} сом</p>
          )}
        </Cell>
      </Column>
    </Table>
  )
}

export default ServiceTable
