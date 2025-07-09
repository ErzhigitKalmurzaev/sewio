import React from 'react';
import { Pagination, Table } from 'rsuite';
import { formatedToDDMMYYYY, formatedToDDMMYYYYHHMM } from '../../../../../utils/functions/dateFuncs';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const {Column, HeaderCell, Cell} = Table;

const ComingHistoryTable = ({ data, status, total, activePage, limit, setPage }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[500px] font-inter bg-white rounded-xl'>
      <Table
            height={500}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-xl h-full'
            bordered
            cellBordered
            rowHeight={50}
            virtualized
        >
            <Column width={90} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="quantity.id" />
            </Column>

            <Column width={300}>
                <HeaderCell>От склада</HeaderCell>
                <Cell dataKey="quantity.out_warehouse.title" />
            </Column>

            <Column width={300}>
                <HeaderCell>В склад</HeaderCell>
                <Cell dataKey="quantity.in_warehouse.title" />
            </Column>

            <Column width={250}>
                <HeaderCell>Дата выдачи</HeaderCell>
                <Cell>
                    {rowData => (
                        formatedToDDMMYYYYHHMM(rowData.created_at)  
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
        <div style={{ padding: 20 }}>
            <Pagination
                prev
                next
                first
                last
                ellipsis
                lang='ru'
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={total}
                // limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={Number(activePage)}
                onChangePage={(e) => setPage('page', e)}
            />
        </div>
    </div>
  )
}

export default ComingHistoryTable
