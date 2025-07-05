import { ChevronsRight } from 'lucide-react';
import React from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const MainTable = ({ data, status }) => {

    const navigate = useNavigate();

    const { me_info } = useSelector(state => state.auth);

    const transformedData = [];

    data?.forEach(entry => {
        entry.products.forEach((product, productIndex) => {
            transformedData.push({
                id: entry.id,
                idRowSpan: productIndex === 0 ? entry.products?.length : 0,
                productId: product.nomenclature.id,
                productTitle: product.nomenclature.title,
                vendorCode: product.nomenclature.vendor_code,
                company: entry.client.company_title,
                client: `${entry.client.name} ${entry.client.surname}`
            });
        });
    });

    const handleNavigate = (rowData) => {
        if(me_info?.role === 5) {
            navigate(`${rowData.id}/${rowData.productId}`);
        } else {
            navigate(`${rowData.id}/${rowData.productId}/history`);
        }
        localStorage.setItem('order', JSON.stringify(rowData));
    }

  return (
    <div className='min-h-[500px] bg-white rounded-lg overflow-x-auto'>
        <Table
            data={transformedData || []}
            loading={status === 'loading'}
            height={500}
            bordered
            cellBordered
            className='rounded-lg'
        >
            <Column width={60} fixed align="center" verticalAlign='middle' rowSpan={rowData => rowData.idRowSpan}>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={200} verticalAlign='middle' rowSpan={rowData => rowData.idRowSpan}>
                <HeaderCell>Клиент</HeaderCell>
                <Cell dataKey="client" />
            </Column>

            <Column width={150} verticalAlign='middle' rowSpan={rowData => rowData.idRowSpan}>
                <HeaderCell>Компания</HeaderCell>
                <Cell dataKey="company" />
            </Column>

            <Column width={220}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="productTitle" />
            </Column>

            <Column width={200}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendorCode" />
            </Column>


            <Column flexGrow={1} minWidth={130} verticalAlign='center' fixed='right'>
                <HeaderCell style={{ padding: '7px 16px' }}>Действия</HeaderCell>
                <Cell style={{ padding: '7px 16px' }}>
                    {(rowData) => (
                        <span className=''>
                            <Button size='xs' color='blue' appearance="primary" onClick={() => handleNavigate(rowData)}>
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
