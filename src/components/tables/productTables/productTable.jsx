import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'rsuite';
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import TableDropdown from '../tableDropdown';

const { Column, HeaderCell, Cell } = Table;

const ProductTable = ({ data, status, handleChangeFilter, urls }) => {

  const navigate = useNavigate();

//   const getData = () => {
//     if(urls.salary_type === '1') {
//       return data.filter(item => item.salary > 0)
//     } else if(urls.salary_type === '0') {
//       return data.filter(item => item.salary === 0)
//     } else {
//       return data;
//     }
//   }

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

              <Column width={150}>
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
        </div>
  )
}

export default ProductTable
