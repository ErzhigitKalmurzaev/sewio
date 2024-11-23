import React from 'react'
import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';

const { Column, HeaderCell, Cell } = Table;

const IssueMaterialsTable = ({ data, status, output, setOutput }) => {

  const getValue = (name, value, id) => {
    const index = output.products.findIndex(item => item.id === id);
    output.products[index] = {...output.products[index], [name]: value};
    setOutput({...output});
  }

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
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendor_code" />
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
                                value={rowData.output_amount}
                                onChange={(value) => getValue('output_amount', value, rowData.id)}
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
