import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'rsuite';
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import TableDropdown from '../tableDropdown';
import { formatPhoneNumber } from '../../../utils/functions/numFuncs';

const { Column, HeaderCell, Cell } = Table;

const TechnologEmployeeTable = ({ data, status, handleChangeFilter, urls }) => {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();

  const getData = () => {
    let filteredData = data;

    // Фильтрация по типу зарплаты
    if (urls.salary_type === '1') {
      filteredData = filteredData.filter(item => item.salary > 0);
    } else if (urls.salary_type === '0') {
      filteredData = filteredData.filter(item => item.salary === 0);
    }

    // Сортировка
    if (sortColumn && sortType) {
      filteredData = [...filteredData].sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        // Для сортировки по number преобразуем в числа
        if (sortColumn === 'number') {
          x = parseInt(x) || 0;
          y = parseInt(y) || 0;
        }

        // Для сортировки по дате создания (используем id как индикатор даты)
        if (sortColumn === 'id') {
          x = parseInt(x) || 0;
          y = parseInt(y) || 0;
        }

        if (sortType === 'asc') {
          return x > y ? 1 : -1;
        } else {
          return x < y ? 1 : -1;
        }
      });
    }

    return filteredData;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setSortColumn(sortColumn);
    setSortType(sortType);
  };

  return (
    <div className='min-h-[600px] font-inter bg-white rounded-xl'>
      <Table
        virtualized
        height={600}
        loading={status === 'loading'}
        data={getData() || []}
        className='rounded-xl'
        bordered
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
      >
        <Column width={70} align="center" fixed sortable>
          <HeaderCell>ID</HeaderCell>
          <Cell dataKey="number" />
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
          <Cell>
            {rowData => (
              <div className='flex items-center'>
                {rowData?.phone?.length > 5 ? (
                  <span className='font-inter'>{formatPhoneNumber(rowData?.phone)}</span>
                ) : (
                  <span className='font-inter text-primary mx-3'>Не указанo</span>
                )}
              </div>
            )}
          </Cell>
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
            {rowData => (
              <p>{rowData?.salary > 0 ? 'Фиксированная' : 'Договорная'}</p>
            )}
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
            {rowData => (
              <p>{employeeRole[rowData.role].label}</p>
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
    </div>
  );
};

export default TechnologEmployeeTable;