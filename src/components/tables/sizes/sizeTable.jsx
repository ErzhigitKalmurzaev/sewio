import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'rsuite';

import { ReactComponent as Pencil } from '../../../assets/icons/pencil.svg';

const { Column, HeaderCell, Cell } = Table;

const SizeTable = ({ data, setModals, modals, setEditSize, size_category_list_status }) => {

    const editSize = (data) => {
        setModals({ ...modals, edit: true})
        setEditSize(data)
    }

    return (
        <div className='min-h-[450px] font-inter bg-white rounded-xl'>
        <Table
            height={450}
            loading={size_category_list_status === 'loading'}
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

                <Column width={220}>
                    <HeaderCell>Размеры</HeaderCell>
                    <Cell dataKey="sizes">
                        {
                            rowData => (
                                <p>
                                    {
                                        rowData.sizes.map((item, index) => (
                                            `${item.title}${index !== rowData.sizes.length - 1 ? ', ' : ''} `
                                        ))
                                    }
                                </p>
                            )
                        }
                    </Cell>
                </Column>

                <Column width={400} fixed="right">
                    <HeaderCell>Действия</HeaderCell>

                    <Cell style={{ padding: '6px' }}>
                        {rowData => (
                            <div className='flex items-center px-3 py-1 cursor-pointer'>
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
