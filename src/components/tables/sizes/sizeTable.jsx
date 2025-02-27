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
        <div className='min-h-[550px] font-inter bg-white rounded-xl'>
        <Table
            height={530}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-lg'
        >
                <Column width={60} align="center" fixed>
                    <HeaderCell>ID</HeaderCell>
                    <Cell dataKey="id" />
                </Column>

                <Column width={180}>
                    <HeaderCell>Название</HeaderCell>
                    <Cell dataKey="title" />
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

                <Column width={100} align='center' fixed="right">
                    <HeaderCell>Действия</HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <div className='flex items-center gap-x-3 px-3 py-1 cursor-pointer'>
                                <Pencil onClick={() => editSize(rowData)}/>
                                <Trash2 size={20} color='red' onClick={() => setModals({ ...modals, delete: true, id: rowData.id })}/>
                            </div>
                        )}
                    </Cell>
                </Column>
            </Table>
        </div>
    )
}

export default SizeTable
