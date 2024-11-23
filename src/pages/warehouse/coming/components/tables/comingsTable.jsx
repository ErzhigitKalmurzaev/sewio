import React from 'react';
import { Table } from 'rsuite';
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const {Column, HeaderCell, Cell} = Table;

const ComingsTable = ({ data, status }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[400px] bg-white rounded-xl'>
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
                <HeaderCell>Склад</HeaderCell>
                <Cell dataKey="out_warehouse.title" />
            </Column>

            <Column width={250}>
                <HeaderCell>Дата выдачи</HeaderCell>
                <Cell>
                    {rowData => (
                        formatedToDDMMYYYY(rowData.created_at)  
                    )}
                </Cell>
            </Column>

            <Column width={250}>
                <HeaderCell>Действия</HeaderCell>
                <Cell>
                    {rowData => (
                        <div>
                            <p className='flex items-center text-blue-500 font-medium font-inter cursor-pointer hover:underline hover:text-blue-600' onClick={() => navigate(`${rowData.id}`)}>
                                <Info className='mr-2 mt-0.5' size={17}/>
                                Подробнее 
                            </p> 
                        </div>
                    )}
                </Cell>
            </Column>

        </Table>
    </div>
  )
}

export default ComingsTable
