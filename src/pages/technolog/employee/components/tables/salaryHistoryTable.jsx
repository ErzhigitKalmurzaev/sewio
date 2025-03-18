import React from 'react'
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs'
import { Pagination, Table } from 'rsuite';
import { PaymentStatuses } from '../../../../../utils/constants/statuses';
import { formatNumber } from '../../../../../utils/functions/numFuncs';
import { useNavigate } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table

const SalaryHistoryTable = ({ data, status, activePage, limit, setPage, total }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[500px] font-inter bg-white rounded-xl'>
        <Table
            virtualized
            height={500}
            loading={status === 'loading'}
            data={data || []}
            bordered
            className='rounded-xl'
            hover
            rowClassName={'cursor-pointer'}
            onRowClick={(rowData) => navigate(`${rowData.id}`)}
        >
            <Column width={100} align="center">
                <HeaderCell>ID выплаты</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={200}>
                <HeaderCell>Сумма выплаты</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p>{formatNumber(rowData?.amount)} сом</p>
                    )}
                </Cell>
            </Column>
            
            <Column width={100}>
                <HeaderCell>Дата</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p>{formatedToDDMMYYYY(rowData?.created_at)}</p>
                    )}
                </Cell>
            </Column>

            <Column width={200} align='center'>
                <HeaderCell>Статус выплаты</HeaderCell>
                <Cell>
                    {(rowData) => (
                        <p className='font-semibold te' style={{ color: PaymentStatuses[rowData?.status - 1].color }}>
                            {PaymentStatuses[rowData?.status - 1].title}
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

export default SalaryHistoryTable
