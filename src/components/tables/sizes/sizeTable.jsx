import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Checkbox } from 'rsuite';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import { Trash, Trash2 } from 'lucide-react';

const { Column, HeaderCell, Cell } = Table;

const SizeTable = ({ data, setModals, modals, status }) => {

    const editSize = (data) => {
        setModals({ ...modals, edit: true, edit_data: data })
    }

    return (
        <div className='min-h-[600px] font-inter bg-white rounded-xl'>
        <Table
            height={600}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-lg'
            bordered
            cellBordered
        >
                <Column width={90} align="center" fixed>
                    <HeaderCell>ID</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={200}>
                    <HeaderCell>Название</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column width={200}>
                    <HeaderCell>Статус</HeaderCell>
                    <Cell dataKey="is_active">
                        {
                            rowData => (
                                <p className='font-inter text-sm' style={rowData.is_active ? { color: '#2F4F4F' } : { color: 'rgba(188, 193, 201, 1)' }}>{rowData.is_active ? 'Активный' : 'Деактивный'}</p>
                            )
                        }
                    </Cell>
                </Column>

                <Column flexGrow={1} fixed="right">
                    <HeaderCell>Действия</HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <div className='flex items-center gap-x-3 px-3 py-1 cursor-pointer'>
                                <Pencil onClick={() => editSize(rowData)}/>
                            </div>
                        )}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default SizeTable
