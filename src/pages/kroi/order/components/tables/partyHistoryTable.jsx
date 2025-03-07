import React from 'react'
import { Pagination, Table } from 'rsuite'
import { OrderStatuses } from '../../../../../utils/constants/statuses';
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';

const { Cell, HeaderCell, Column } = Table;

const PartyHistoryTable = ({ data, status, urls, handleChangeFilter }) => {
  return (
    <div className='min-h-[500px] bg-white rounded-lg'>
        <Table
            data={data?.results || []}
            loading={status === 'loading'}
            height={500}
            bordered
            cellBordered
        >
            <Column width={80} align="center" verticalAlign="center">
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>
            <Column width={80} align="center" verticalAlign="center">
                <HeaderCell>Заказ</HeaderCell>
                <Cell dataKey="order" />
            </Column>
            <Column width={200}>
                <HeaderCell>Товар</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{rowData.nomenclature.title}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={200}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{rowData.nomenclature.vendor_code}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={80} align="center" verticalAlign="center">
                <HeaderCell>Партия №</HeaderCell>
                <Cell dataKey="number" />
            </Column>
            <Column width={100}>
                <HeaderCell>Статус</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{OrderStatuses[rowData.status].label}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={140}>
                <HeaderCell>Дата создания</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{formatedToDDMMYYYY(rowData.created_at)}</p>
                        )
                    }
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
                lang='ru'
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={data?.count}
                // limitOptions={[10, 30, 50]}
                limit={Number(urls.page_size) || 20}
                activePage={Number(urls.page) || 1}
                onChangePage={(e) => handleChangeFilter('page', e)}
            />
        </div>
    </div>
  )
}

export default PartyHistoryTable
