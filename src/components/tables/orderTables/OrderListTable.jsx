import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, Table } from 'rsuite';
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import TableDropdown from '../tableDropdown';
import { formatedToDDMMYYYY } from '../../../utils/functions/dateFuncs';
import { OrderStatuses } from '../../../utils/constants/statuses';

const { Column, HeaderCell, Cell } = Table;

const OrderListTable = ({ data, status, total, activePage, limit, setPage }) => {

  const navigate = useNavigate();

  return (
        <div className='min-h-[500px] bg-white rounded-xl'>
            <Table
              virtualized
              loading={status === 'loading'}
              data={data}
              height={600}
              className='rounded-xl h-full'
            >
              <Column width={60} align="center" fixed>
                  <HeaderCell>ID</HeaderCell>
                  <Cell dataKey="id" />
              </Column>

              <Column width={250}>
                  <HeaderCell>ФИО</HeaderCell>
                  <Cell dataKey="title">
                    {rowData => (
                        <p>{rowData.client.surname} {rowData.client.name}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={200}>
                  <HeaderCell>Компания</HeaderCell>
                  <Cell dataKey="company">
                    {rowData => (
                        <p>{rowData.client.company_title}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={200}>
                  <HeaderCell>Статус</HeaderCell>
                  <Cell dataKey="is_active">
                    {rowData => (
                        <p>{OrderStatuses[rowData.status].label}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={200}>
                  <HeaderCell>Дата создания</HeaderCell>
                  <Cell dataKey="created_at">
                    {rowData => (
                        <p>{formatedToDDMMYYYY(rowData.created_at)}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={200}>
                  <HeaderCell>Дата сдачи</HeaderCell>
                  <Cell dataKey="deadline">
                    {rowData => (
                        <p>{formatedToDDMMYYYY(rowData.deadline)}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={100} fixed="right">
                  <HeaderCell>Действия</HeaderCell>

                  <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <div className='flex items-center px-3 py-1 cursor-pointer'>
                          <Pencil onClick={() => navigate(`${rowData.id}`)}/>
                        </div>
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
                // limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={activePage}
                onChangePage={(e) => setPage('page', e)}
            />
          </div>
        </div>
  )
}

export default OrderListTable
