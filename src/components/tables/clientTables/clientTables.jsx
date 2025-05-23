import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'rsuite';
import { employeeRole } from '../../../utils/selectDatas/employeeDatas';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import { formatPhoneNumber } from '../../../utils/functions/numFuncs';
const { Column, HeaderCell, Cell } = Table;

const ClentsTable = ({ data, status }) => {

    const navigate = useNavigate();

  return (
        <div className='min-h-[600px] font-inter bg-white rounded-xl'>
            <Table
              loading={status === 'loading'}
              data={data}
              minHeight={600}
              className='rounded-xl'
              bordered
              cellBordered
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
                  <Cell>
                    {
                      rowData => (
                        <div className='flex items-center'>
                          <span className='font-inter'>{formatPhoneNumber(rowData?.phone)}</span>
                        </div>
                      )
                    }
                  </Cell>
              </Column>

              <Column width={150} fullText>
                  <HeaderCell>Компания</HeaderCell>
                  <Cell dataKey="company_title"/>
              </Column>

              <Column width={200}>
                  <HeaderCell>Адрес</HeaderCell>
                  <Cell dataKey="address"/>
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

export default ClentsTable
