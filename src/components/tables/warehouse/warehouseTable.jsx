import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'rsuite';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import { Warehouse } from 'lucide-react';

const { Column, HeaderCell, Cell } = Table;

const WarehouseTable = ({ data, status }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[600px] font-inter bg-white rounded-xl'>
        <Table
            height={600}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-xl'
            bordered
            cellBordered
        >
            <Column width={90} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={220}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={220}>
                <HeaderCell>Зав. складом</HeaderCell>
                <Cell>
                  {
                    rowData => (
                      rowData?.staffs?.length > 0 ? 
                        <p className='font-inter'>{rowData?.staffs[0]?.name} {rowData?.staffs[0]?.surname}</p>
                        :
                        <p className='font-inter text-redd'>(Отсутствует)</p>
                    )
                  }
                </Cell>
            </Column>

            <Column width={220}>
                <HeaderCell>Адрес</HeaderCell>
                <Cell dataKey="address" />
            </Column>
            
            <Column flexGrow={1} fixed="right">
                <HeaderCell>Действия</HeaderCell>

                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                      <div className='flex items-center px-3 py-1 cursor-pointer' onClick={() => navigate(`${rowData.id}`)}>
                        <Pencil/>
                      </div>
                  )}
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default WarehouseTable
