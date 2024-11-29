import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'rsuite';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import { Warehouse } from 'lucide-react';

const { Column, HeaderCell, Cell } = Table;

const WarehouseTable = ({ data, status }) => {

  const navigate = useNavigate();

  return (
    <div className='font-inter'>
        <Table
            height={600}
            loading={status === 'loading'}
            data={data}
            className='rounded-xl'
        >
            <Column width={90} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={350}>
                <HeaderCell>Адрес</HeaderCell>
                <Cell dataKey="address" />
            </Column>
            
            <Column width={470} fixed="right">
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
