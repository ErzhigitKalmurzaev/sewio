import React, { useState } from 'react'
import { Pagination, Table } from 'rsuite';
import { materialUnits } from '../../../../../utils/selectDatas/productDatas';
import { useSelector } from 'react-redux';

const { Column, HeaderCell, Cell } = Table;

const WarehouseMaterialsTable = ({ data, status, total, limit, activePage, setPage }) => {

    const { colors_list } = useSelector(state => state.material);

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

            <Column width={60}>
                <HeaderCell align="center">Цвет</HeaderCell>
                <Cell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {rowData => (
                        rowData?.color ? (
                            <div style={{ 
                                background: colors_list?.find(color => color.id === rowData?.color)?.code,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                border: '1px solid rgba(208, 213, 221, 1)'
                            }}></div> 
                        ) : (
                            <p>-</p>
                        )
                    )}
                </Cell>
            </Column>

            <Column width={120}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendor_code" />
            </Column>

            <Column width={120}>
                <HeaderCell>Коэффициент</HeaderCell>
                <Cell>
                    {rowData => (
                        <p>{rowData?.coefficient || '-/-/-/-'}</p>
                    )}
                </Cell>
            </Column>

            <Column width={140}>
                <HeaderCell>Количество</HeaderCell>
                <Cell>
                    {rowData => (
                        <p>{rowData?.amount > 0 && rowData?.unit === 6 ? 
                            `${rowData?.amount} / ${(rowData?.amount * rowData?.coefficient).toFixed(1)} м.`
                            : rowData?.amount}
                        </p>
                    )}
                </Cell>
            </Column>

            <Column width={150}>
                <HeaderCell>Единица измерения</HeaderCell>
                <Cell>
                    {rowData => (
                        <p>{materialUnits[rowData?.unit-1]?.label}</p>
                    )}
                </Cell>
            </Column>

            <Column width={120}>
                <HeaderCell>Цена</HeaderCell>
                <Cell dataKey="cost_price" />
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
