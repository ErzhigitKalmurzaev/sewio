import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'rsuite';
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import TableDropdown from '../tableDropdown';

const { Column, HeaderCell, Cell } = Table;

const 
TechnologEmployeeTable = ({ data, status, handleChangeFilter, urls }) => {

  const navigate = useNavigate();

  const getData = () => {
    if(urls.salary_type === '1') {
      return data.filter(item => item.salary > 0)
    } else if(urls.salary_type === '0') {
      return data.filter(item => item.salary === 0)
    } else {
      return data;
    }
  }

  return (
        <div className='min-h-[500px] font-inter bg-white rounded-xl'>
            <Table
              virtualized
              height={600}
              loading={status === 'loading'}
              data={getData() || []}
              className='rounded-xl'
              bordered
            >
              <Column width={70} align="center" fixed>
                  <HeaderCell>ID</HeaderCell>
                  <Cell dataKey="id" />
              </Column>

              <Column width={150}>
                  <HeaderCell>Имя</HeaderCell>
                  <Cell dataKey="name" />
              </Column>

              <Column width={150}>
                  <HeaderCell>Фамилия</HeaderCell>
                  <Cell dataKey="surname" />
              </Column>

              <Column width={200}>
                  <HeaderCell>Телефон</HeaderCell>
                  <Cell dataKey="phone" />
              </Column>

              <Column width={200}>
                  <HeaderCell>
                    <TableDropdown 
                      title="Тип зарплаты" 
                      data={employeeSalaryType} 
                      handleChangeFilter={handleChangeFilter}
                      name='salary_type'
                      urls={urls}
                    /> 
                  </HeaderCell>
                  <Cell dataKey="salary_type">
                    {
                      rowData => (
                        <p>{rowData?.salary > 0 ? 'Фиксированная' : 'Договорная'}</p>
                      )
                    }
                  </Cell>
              </Column>

              <Column width={150}>
                  <HeaderCell>
                      <TableDropdown 
                        title="Роль" 
                        data={employeeRole} 
                        handleChangeFilter={handleChangeFilter}
                        name='role'
                        urls={urls}
                      />
                  </HeaderCell>
                  <Cell dataKey="role">
                    {
                      rowData => (
                        <p>{employeeRole[rowData.role].label}</p>
                      )
                    }
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
        </div>
  )
}

export default TechnologEmployeeTable
