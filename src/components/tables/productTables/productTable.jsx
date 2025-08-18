import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination, Table } from 'rsuite';
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import TableDropdown from '../tableDropdown';

const { Column, HeaderCell, Cell } = Table;

const ProductTable = ({ data, status, total, activePage, limit, setPage }) => {

  const navigate = useNavigate();

  return (
        <div className='min-h-[600px] font-inter bg-white rounded-xl'>
            <Table
              virtualized
              loading={status === 'loading'}
              data={data}
              height={600}
              bordered
              cellBordered
              className='rounded-xl h-full'
            >
              <Column width={60} align="center" fixed>
                  <HeaderCell>ID</HeaderCell>
                  <Cell dataKey="id" />
              </Column>

              <Column width={250}>
                  <HeaderCell>Название</HeaderCell>
                  <Cell dataKey="title" />
              </Column>

              <Column width={200}>
                  <HeaderCell>Артикул</HeaderCell>
                  <Cell dataKey="vendor_code" />
              </Column>

              <Column width={200}>
                  <HeaderCell>Статус</HeaderCell>
                  <Cell dataKey="is_active">
                    {rowData => (
                        <p>{rowData.is_active ? 'Активный' : 'Деактивный'}</p>
                    )}
                  </Cell>
              </Column>

              <Column width={200}>
                  <HeaderCell>Себестоимость</HeaderCell>
                  <Cell dataKey="cost_price" />
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
                lang='ru'
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

export default ProductTable
