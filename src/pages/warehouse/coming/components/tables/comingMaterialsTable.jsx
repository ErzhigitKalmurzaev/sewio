import React from 'react';
import { Table } from 'rsuite';
import { formatedToDDMMYYYY } from '../../../../../utils/functions/dateFuncs';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const {Column, HeaderCell, Cell} = Table;

const ComingMaterialsTable = ({ data, status }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[500px] font-inter bg-white rounded-xl'>
      <Table
            height={450}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-xl'
            bordered
            cellBordered
            virtualized
        >
            <Column width={90} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="nomenclature.id" />
            </Column>

            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="nomenclature.title" />
            </Column>

            <Column width={250}>
                <HeaderCell>Количество</HeaderCell>
                <Cell dataKey="amount"/>
            </Column>

        </Table>
    </div>
  )
}

export default ComingMaterialsTable
