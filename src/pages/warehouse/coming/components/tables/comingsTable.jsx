import React from 'react';
import { Table } from 'rsuite';
import { formatedToDDMMYYYYHHMM } from '../../../../../utils/functions/dateFuncs';
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
            bordered
            cellBordered
        >
            <Column width={90} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={250}>
                <HeaderCell>Склад</HeaderCell>
                <Cell dataKey="out_warehouse.title" />
            </Column>

            <Column width={350}>
                <HeaderCell>Товары</HeaderCell>
                <Cell>
                    {rowData => (
                        <div className='py-1'>
                            {rowData.quantities?.slice(0, 2).map((item, index) => (
                                <div key={index} className='text-sm mb-1'>
                                    <span className='font-medium'>{item.nomenclature.title}</span>
                                    {item.nomenclature.vendor_code && (
                                        <span className='text-gray-500 ml-2'>({item.nomenclature.vendor_code})</span>
                                    )}
                                    <span className='text-gray-700 ml-2'>— {item.amount} шт.</span>
                                </div>
                            ))}
                            {rowData.quantities?.length > 2 && (
                                <span className='text-xs text-gray-500'>
                                    +ещё {rowData.quantities.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </Cell>
            </Column>

            <Column width={200}>
                <HeaderCell>Дата выдачи</HeaderCell>
                <Cell>
                    {rowData => (
                        formatedToDDMMYYYYHHMM(rowData.created_at)  
                    )}
                </Cell>
            </Column>

            <Column width={150}>
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