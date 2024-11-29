import React from 'react'
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs'
import { Table } from 'rsuite';
import { PaymentStatuses } from '../../../../../utils/constants/statuses';
import { formatNumber } from '../../../../../utils/functions/numFuncs';

const { Column, HeaderCell, Cell } = Table

const SalaryHistoryTable = ({ data, status }) => {
  return (
    <div className='min-h-[400px] font-inter bg-white rounded-xl'>
            <Table
                virtualized
                height={400}
                loading={status === 'loading'}
                data={data || []}
                bordered
                className='rounded-xl'
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
                            <p style={{ color: PaymentStatuses[rowData?.status - 1].color }}>
                                {PaymentStatuses[rowData?.status - 1].title}
                            </p>
                        )}
                    </Cell>
                </Column>

            </Table>
        </div>
  )
}

export default SalaryHistoryTable
