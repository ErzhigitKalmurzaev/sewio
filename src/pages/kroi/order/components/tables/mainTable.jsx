import { ChevronsRight } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const MainTable = ({ data, status }) => {

    const navigate = useNavigate();

    const transformedData = [];

    data?.forEach(entry => {
        entry.products.forEach((product, productIndex) => {
            transformedData.push({
                id: entry.id,
                idRowSpan: productIndex === 0 ? entry.products?.length : 0,
                productId: product.nomenclature.id,
                productTitle: product.nomenclature.title,
                vendorCode: product.nomenclature.vendor_code
            });
        });
    });

  return (
    <div className='min-h-[500px] bg-white rounded-lg'>
        <Table
            data={transformedData || []}
            loading={status === 'loading'}
            height={500}
            bordered
            cellBordered
            className='rounded-lg'
        >
            <Column width={80} align="center" fixed verticalAlign='center' rowSpan={rowData => rowData.idRowSpan}>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={220}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="productTitle" />
            </Column>

            <Column width={220}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendorCode" />
            </Column>

            <Column flexGrow={1} verticalAlign='center'>
                <HeaderCell>Действия</HeaderCell>
                <Cell style={{ padding: '7px 6px' }}>
                    {(rowData) => (
                        <span className=''>
                            <Button size='xs' color='blue' appearance="primary" onClick={() => navigate(`${rowData.id}/${rowData.productId}`)}>
                                <span className='flex items-center gap-x-1'>
                                    <p className='text-xs'>Перейти</p>
                                    <ChevronsRight size={22}/>
                                </span>
                            </Button>
                        </span>
                    )}
                </Cell>
            </Column>

        </Table>
    </div>
  )
}

export default MainTable
