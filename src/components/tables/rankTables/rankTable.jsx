import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table } from 'rsuite';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';

const { Column, HeaderCell, Cell } = Table;

const RankTable = ({ data, setModals, modals, setEditRank, rank_list_status }) => {

  const editRank = (data) => {
    setModals({ ...modals, edit: true})
    setEditRank(data)
  }

  return (
    <div className='font-inter'>
        <Table
            height={600}
            loading={rank_list_status === 'loading'}
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

            <Column width={150}>
                <HeaderCell>Процент</HeaderCell>
                <Cell dataKey="percent" />
            </Column>

            <Column width={200}>
                <HeaderCell>Статус</HeaderCell>
                <Cell dataKey="is_active">
                    {
                        rowData => (
                            <p>{rowData?.is_active ? 'Активный' : 'Деактивный'}</p>
                        )
                    }
                </Cell>
            </Column>
            <Column width={470} fixed="right">
                <HeaderCell>Действия</HeaderCell>

                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                      <div className='flex items-center px-3 py-1 cursor-pointer'>
                        <Pencil onClick={() => editRank(rowData)}/>
                      </div>
                  )}
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default RankTable
