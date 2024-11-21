import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Table } from 'rsuite';
import { employeeRole, employeeSalaryType } from '../../../../../utils/selectDatas/employeeDatas';

import TablePopover from '../../../../../components/tables/tableDropdown';


const { Column, HeaderCell, Cell } = Table;

const SelectStaffTable = ({ data, status, handleChangeFilter, urls, warehouse, setWarehouse }) => {

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

  const selectStaff = (id, e) => {
    if(warehouse.staffs.includes(id)) {
      setWarehouse({...warehouse, staffs: warehouse.staffs.filter(item => item !== id)})
    } else {
      setWarehouse({...warehouse, staffs: [...warehouse.staffs, id]})
    }
    console.log(id)
  };

  return (
        <div className='min-h-[400px] bg-white rounded-xl'>
            <Table
              virtualized
              height={400}
              loading={status === 'loading'}
              data={getData()}
              className='rounded-xl'
            >
              <Column width={60} align="center" fixed>
                  <HeaderCell>ID</HeaderCell>
                  <Cell dataKey="id" />
              </Column>

              <Column width={150}>
                  <HeaderCell>Имя</HeaderCell>
                  <Cell dataKey="name" />
              </Column>

              <Column width={200}>
                  <HeaderCell>Фамилия</HeaderCell>
                  <Cell dataKey="surname" />
              </Column>

              <Column width={200}>
                  <HeaderCell>
                    <TablePopover 
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

              <Column width={200}>
                  <HeaderCell>
                      <TablePopover
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
                    {(rowData, index) => (
                          <div 
                            className='flex items-center cursor-pointer' 
                            key={index + 'checl'}
                            onClick={(e) => selectStaff(rowData.id, e)}
                          >
                            <Checkbox checked={warehouse.staffs.includes(rowData.id)}/>
                          </div>
                    )}
                  </Cell>
              </Column>
          </Table>
        </div>
  )
}

export default SelectStaffTable
