import React from 'react'
import { Radio, Table } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const WarehousesTable = ({ data, status, setOutput, output }) => {

  const onChange = (data) => {
    if(data?.id === output?.warehouse?.id) {
      setOutput({ ...output, warehouse: null });
    } else {
      setOutput({ ...output, warehouse: data });
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
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={250}>
                <HeaderCell>Адрес</HeaderCell>
                <Cell dataKey="address"/>
            </Column>

            <Column flexGrow={1} fixed="right">
                <HeaderCell>Выбор</HeaderCell>

                <Cell style={{ padding: '6px' }}>
                  {rowData => (
                      <div className='flex items-center px-3 py-1 cursor-pointer'>
                        <Radio
                          checked={output?.warehouse?.id === rowData.id}
                          onChange={() => onChange(rowData)}
                        />
                      </div>
                  )}
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default WarehousesTable
