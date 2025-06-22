import React, { useState } from 'react'
import { Pagination, Table } from 'rsuite';
import { materialUnits } from '../../../../../utils/selectDatas/productDatas';

const { Column, HeaderCell, Cell } = Table;

const WarehouseMaterialsTable = ({ data, status, total, limit, activePage, setPage }) => {

  return (
    <div className='min-h-[500px] bg-white rounded-xl'>
        <Table
            height={600}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-xl'
            bordered
            cellBordered
        >
            <Column width={60} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={250}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={150}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendor_code" />
            </Column>

            <Column width={150}>
                <HeaderCell>Цена</HeaderCell>
                <Cell dataKey="cost_price" />
            </Column>

            <Column width={150}>
                <HeaderCell>Количество</HeaderCell>
                <Cell dataKey="amount" />
            </Column>

            <Column width={200}>
                <HeaderCell>Единица измерения</HeaderCell>
                <Cell>
                    {rowData => (
                        <p>{materialUnits[rowData?.unit-1]?.label}</p>
                    )}
                </Cell>
            </Column>
        </Table>
        <div style={{ padding: 20 }}>
            <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={total}
                limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={Number(activePage)}
                onChangePage={(e) => setPage('page', e)}
            />
          </div>
    </div>
  )
}

export default WarehouseMaterialsTable
