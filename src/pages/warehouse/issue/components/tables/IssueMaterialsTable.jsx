import React from 'react'
import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { toast } from 'react-toastify';

const { Column, HeaderCell, Cell } = Table;

const IssueMaterialsTable = ({ data, status, output, setOutput }) => {

  const getValue = (name, value, rowData) => {
    const index = output.products.findIndex(item => item.id === rowData.id);

    if(rowData.amount >= value) {
        output.products[index] = {...output.products[index], [name]: value};
        setOutput({...output});
    } else {
        output.products[index] = {...output.products[index], [name]: ''};
        setOutput({...output});
        toast.error("Количество не может быть больше количества в складе!");
    }
  }

  return (
    <div className='min-h-[500px] bg-white rounded-xl'>
         <Table
            height={500}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-xl'
        >
            <Column width={90} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={300}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{rowData?.vendor_code ? rowData.vendor_code : '-/-'}</p>
                        )
                    }
                </Cell>
            </Column>

            <Column width={250}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title"/>
            </Column>

            <Column width={250}>
                <HeaderCell>Количество в складе</HeaderCell>
                <Cell dataKey="amount"/>
            </Column>

            <Column width={150}>
                <HeaderCell>Выдать</HeaderCell>
                <Cell style={{ padding: '8px 6px'}}>
                    {
                        rowData => (
                            <NumInputForTable
                                name='output_amount'
                                placeholder='0'
                                max={rowData.amount}
                                value={rowData.output_amount}
                                onChange={(value) => getValue('output_amount', value, rowData)}
                            />
                        )
                    }
                </Cell>
            </Column>

        </Table>
    </div>
  )
}

export default IssueMaterialsTable
