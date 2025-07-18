import React from 'react'
import { Pagination, Table } from 'rsuite'
import { formatedToDDMMYYYY } from '../../../../utils/functions/dateFuncs';
import { OrderStatuses } from '../../../../utils/constants/statuses';
import { useNavigate } from 'react-router-dom';

const { Cell, HeaderCell, Column } = Table;

const OrdersTable = ({ data, status, activePage, limit, setPage, total }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[450px] font-inter bg-white rounded-md text-xs'>
      <Table
        height={450}
        loading={status === 'loading'}
        data={data?.results || []}
        className='rounded-xl'
        bordered
        cellBordered
        onRowClick={(rowData) => navigate(`${rowData?.id}`)}
      >
        <Column width={60} align="center" fixed>
            <HeaderCell>ID</HeaderCell>
            <Cell dataKey="id" />
        </Column>

        <Column width={110}>
            <HeaderCell>Дата создания</HeaderCell>
            <Cell>
                {(rowData) => (
                    <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>
                )}
            </Cell>
        </Column>
        
        <Column flexGrow={1}>
            <HeaderCell>Дата сдачи</HeaderCell>
            <Cell>
                {(rowData) => (
                    <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>
                )}
            </Cell>
        </Column>

        <Column width={80} align='center'>
            <HeaderCell>Статус</HeaderCell>
            <Cell>
                {(rowData) => (
                    <p className='font-semibold'>
                        {OrderStatuses[rowData?.status].label}
                    </p>
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
                className='flex justify-between'
                layout={['total', '|', 'pager']}
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

export default OrdersTable
