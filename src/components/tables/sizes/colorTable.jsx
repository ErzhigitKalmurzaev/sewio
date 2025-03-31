import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Checkbox } from 'rsuite';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';
import { Trash, Trash2 } from 'lucide-react';

const { Column, HeaderCell, Cell } = Table;

const ColorTable = ({ data, setModals, modals, status }) => {

    const editColor = (data) => {
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

                <Column width={80} align="center">
                    <HeaderCell>Цвет</HeaderCell>
                    <Cell dataKey="code">
                        {
                            rowData => (
                                <div style={{ backgroundColor: rowData.code, width: '20px', height: '20px', borderRadius: '50%' }}>
                                    
                                </div>
                            )
                        }
                    </Cell>
                </Column>

                <Column width={200}>
                    <HeaderCell>Статус</HeaderCell>
                    <Cell dataKey="is_active">
                        {
                            rowData => (
                                <p>{rowData.is_active ? 'Активный' : 'Деактивный'}</p>
                            )
                        }
                    </Cell>
                </Column>

                <Column flexGrow={1} fixed="right">
                    <HeaderCell>Действия</HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <div className='flex items-center gap-x-3 px-3 py-1 cursor-pointer'>
                                <Pencil onClick={() => editColor(rowData)}/>
                            </div>
                        )}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default ColorTable
