import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Pagination, Table } from 'rsuite';
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import TableDropdown from '../tableDropdown';
import { formatedToDDMMYYYY } from '../../../utils/functions/dateFuncs';
import { OrderStatuses } from '../../../utils/constants/statuses';
import { formatNumber } from '../../../utils/functions/numFuncs';
import CircularWithValueLabel from '../../ui/circularProgressWithLabel';
import { MessageCircle } from 'lucide-react';

const { Column, HeaderCell, Cell } = Table;

const OrderListTable = ({ data, status, total, activePage, limit, setPage, moderation_list, type='order' }) => {

  const navigate = useNavigate();

  const getModerationCount = (data) => {
    const count = moderation_list?.filter(moderation => moderation.order === data.id)?.length;

    return count > 0 ? 
                <Badge content={count}>
                  <MessageCircle onClick={() => navigate(`moderation/${data.id}`)}/>
                </Badge> :
                <MessageCircle/>
                
  }

  return (
        <div className='min-h-[500px] font-inter bg-white rounded-xl'>
            <Table
              virtualized
              loading={status === 'loading'}
              data={data}
              height={600}
              bordered
              cellBordered
              className='rounded-xl h-full'
              rowHeight={50}
            >
              <Column width={50} align="center" fixed>
                  <HeaderCell>ID</HeaderCell>
                  <Cell dataKey="id" />
              </Column>

              <Column width={200}>
                  <HeaderCell>ФИО</HeaderCell>
                  <Cell dataKey="title">
                    {rowData => (
                        <p>{rowData.client.surname} {rowData.client.name}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={100} fullText>
                  <HeaderCell>Компания</HeaderCell>
                  <Cell dataKey="client.company_title"/>
              </Column>

              <Column width={90}>
                  <HeaderCell>Статус</HeaderCell>
                  <Cell dataKey="is_active">
                    {rowData => (
                        <p className='font-inter'>{OrderStatuses[rowData.status].label}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={130}>
                  <HeaderCell>Общий доход</HeaderCell>
                  <Cell dataKey="created_at">
                    {rowData => (
                        <p>{formatNumber(rowData.total_revenue)} сом</p>
                    )}
                  </Cell>
              </Column>

              <Column width={130}>
                  <HeaderCell>Расход</HeaderCell>
                  <Cell dataKey="created_at">
                    {rowData => (
                        <p>{formatNumber(rowData.total_cost)} сом</p>
                    )}
                  </Cell>
              </Column>
              
              <Column width={130}>
                  <HeaderCell>Прибыль</HeaderCell>
                  <Cell dataKey="created_at">
                    {rowData => (
                        <p>{formatNumber(rowData.total_revenue - rowData.total_cost)} сом</p>
                    )}
                  </Cell>
              </Column>
              
              <Column width={110}>
                  <HeaderCell>Дата сдачи</HeaderCell>
                  <Cell dataKey="deadline">
                    {rowData => (
                        <p>{formatedToDDMMYYYY(rowData.deadline)}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={110}>
                  <HeaderCell>Дата создания</HeaderCell>
                  <Cell dataKey="created_at">
                    {rowData => (
                        <p>{formatedToDDMMYYYY(rowData.created_at)}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={90} align='center' fixed='right'>
                  <HeaderCell>Выполнено</HeaderCell>
                  <Cell style={{ padding: '4px' }}>
                    {rowData => (
                        <div className='w-[42px] h-[42px]'>
                          <CircularWithValueLabel progress={Math.ceil(rowData.completion_percentage)} />
                        </div>
                    )}
                  </Cell>
              </Column>

              <Column width={type === 'operations' ? 120 : 80} fixed="right">
                  <HeaderCell>Действия</HeaderCell>

                  <Cell style={{ padding: '6px' }}>
                    {rowData => (
                        <div className='flex gap-x-2'>
                          <div className='flex items-center px-3 py-1 cursor-pointer'>
                            <Pencil onClick={() => navigate(`${rowData.id}`)}/>
                          </div>
                          {
                            type === 'operations' &&
                            <div className='flex items-center px-3 py-1 cursor-pointer'>
                              {getModerationCount(rowData)}
                            </div>
                          }
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
                lang='ru'
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={total}
                // limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={Number(activePage)}
                onChangePage={(e) => setPage('page', e)}
            />
          </div>
        </div>
  )
}

export default OrderListTable
