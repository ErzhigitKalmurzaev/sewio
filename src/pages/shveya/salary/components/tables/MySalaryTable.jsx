import React from 'react'
import { Pagination, Table } from 'rsuite'
import { formatNumber } from '../../../../../utils/functions/numFuncs';
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';
import { PaymentStatuses } from '../../../../../utils/constants/statuses';
import { useNavigate } from 'react-router-dom';

const { Cell, HeaderCell, Column } = Table;

const MySalaryTable = ({ data, status, activePage, limit, setPage, total }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[450px] font-inter bg-white rounded-md text-xs'>
      <Table
        height={450}
        loading={status === 'loading'}
        data={data || []}
        className='rounded-xl'
        bordered
        cellBordered
        onRowClick={(rowData) => navigate(`${rowData?.id}`)}
      >
        <Column width={60} align="center" fixed>
            <HeaderCell>ID</HeaderCell>
            <Cell dataKey="id" />
        </Column>

        <Column width={115}>
            <HeaderCell>Sum</HeaderCell>
            <Cell>
                {(rowData) => (
                    <p>{formatNumber(rowData?.amount)} сом</p>
                )}
            </Cell>
        </Column>
        
        <Column width={80}>
            <HeaderCell>Date</HeaderCell>
            <Cell>
                {(rowData) => (
                    <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>
                )}
            </Cell>
        </Column>

        <Column width={100} align='center'>
            <HeaderCell>Status</HeaderCell>
            <Cell>
                {(rowData) => (
                    <p className='font-semibold te' style={{ color: PaymentStatuses[rowData?.status - 1].color }}>
                        {PaymentStatuses[rowData?.status - 1].en_title}
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

export default MySalaryTable
