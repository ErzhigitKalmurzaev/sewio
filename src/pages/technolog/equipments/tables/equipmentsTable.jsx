import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'rsuite';

import { ReactComponent as Pencil } from '../../../../assets/icons/pencil.svg';

const { Column, HeaderCell, Cell } = Table;

const EquipmentsTable = ({ data, status }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[450px] font-inter bg-white rounded-xl'>
        <Table
            height={450}
            loading={status === 'loading'}
            data={data || []}
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
            
            <Column width={200}>
                <HeaderCell>Статус</HeaderCell>
                <Cell>
                    {rowData => (rowData.is_active ? 'Активен' : 'Не активен')}
                </Cell>
            </Column>

            <Column width={200}>
                <HeaderCell>Цена</HeaderCell>
                <Cell>
                    {rowData => `${rowData.price || 0} сом`}
                </Cell>
            </Column>

            <Column width={200} fixed="right">
                <HeaderCell>Действия</HeaderCell>

                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                      <div className='flex items-center px-3 py-1 cursor-pointer'>
                        <Pencil onClick={() => navigate(`${rowData?.id}`)}/>
                      </div>
                  )}
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default EquipmentsTable
