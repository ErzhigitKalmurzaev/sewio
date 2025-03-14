import React from 'react'
import { Pagination, Table } from 'rsuite'
import { OrderStatuses } from '../../../../../utils/constants/statuses';
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Pencil } from '../../../../../assets/icons/pencil.svg';

const { Cell, HeaderCell, Column } = Table;

const WorksHistoryTable = ({ data, status }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[500px] bg-white rounded-lg'>
        <Table
            data={data || []}
            loading={status === 'loading'}
            height={500}
            bordered
            cellBordered
            className='rounded-lg text-xs'
        >
            <Column width={60} align="center" verticalAlign="center">
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>
            <Column width={190} verticalAlign="center">
                <HeaderCell>Контроллер</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p className='font-inter text-xs'>{rowData.staff.name} {rowData.staff.surname}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={70}>
                <HeaderCell>Партия</HeaderCell>
                <Cell dataKey='party' />
            </Column>
            <Column width={120} fullText>
                <HeaderCell>Цвет</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <span className='font-inter flex items-center'>
                                <span style={{ backgroundColor: rowData.color.code, width: '15px', height: '15px', display: 'inline-block', borderRadius: '50%', marginRight: '5px' }}></span>
                                {rowData.color.title}
                            </span>
                        )
                    }
                </Cell>
            </Column>
            <Column width={70} align="center" verticalAlign="center">
                <HeaderCell>Размер</HeaderCell>
                <Cell dataKey="size.title" />
            </Column>
            <Column width={100}>
                <HeaderCell>Дата создания</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{formatedToDDMMYYYY(rowData.created_at)}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={100}>
                <HeaderCell>Дата редактирования</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{formatedToDDMMYYYY(rowData.updated_at)}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column flexGrow={1} fixed="right">
                <HeaderCell>Действие</HeaderCell>
                <Cell style={{ padding: '6px' }}>
                    {
                        rowData => (
                            <div className='flex items-center px-3 py-1 cursor-pointer'>
                                <Pencil onClick={() => navigate(`${rowData.id}`)}/>
                            </div>
                        )
                    }
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default WorksHistoryTable
