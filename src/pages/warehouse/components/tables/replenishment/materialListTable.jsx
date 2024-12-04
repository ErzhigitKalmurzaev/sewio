import React, { useState } from 'react'
import { Pagination, Table } from 'rsuite';

import { ReactComponent as Pencil } from '../../../../../assets/icons/pencil.svg';
import EditMaterialModal from '../../modals/EditMaterialModal';
import { materialUnits } from '../../../../../utils/selectDatas/productDatas';

const { Column, HeaderCell, Cell } = Table;

const MaterialListTable = ({ data, status, modals, setModals, total, limit, activePage, setPage, setUpdate }) => {

  const [selectedMaterial, setSelectedMaterial] = useState({});

  const selectEditMaterial = (data) => {
    setSelectedMaterial(data);
    setModals({ ...modals, edit: true});
  }

  return (
    <div className='min-h-[400px] bg-white rounded-xl'>
        <Table
            height={500}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-xl'
        >
            <Column width={60} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={150}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendor_code" />
            </Column>

            <Column width={200}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={150}>
                <HeaderCell>Цена</HeaderCell>
                <Cell dataKey="cost_price" />
            </Column>

            <Column width={150}>
                <HeaderCell>Количество</HeaderCell>
                <Cell dataKey="amount" />
            </Column>

            <Column width={200}>
                <HeaderCell>Единица измерения</HeaderCell>
                <Cell>
                    {rowData => (
                        <p>{materialUnits[rowData?.unit-1]?.label}</p>
                    )}
                </Cell>
            </Column>

            <Column width={80}>
                <HeaderCell align='center'>Действия</HeaderCell>
                <Cell>
                    {rowData => (
                        <div className='flex justify-center gap-x-2 cursor-pointer' onClick={() => selectEditMaterial(rowData)}>
                            <Pencil/>
                        </div>
                    )}
                </Cell>
            </Column>
        </Table>
        <EditMaterialModal
            modals={modals}
            setModals={setModals}
            data={selectedMaterial}
            setUpdate={setUpdate}
        />
        <div style={{ padding: 20 }}>
            <Pagination
                prev
                next
                first
                last
                ellipsis
                boundaryLinks
                maxButtons={5}
                size="xs"
                layout={['total', '-', 'limit', '|', 'pager', 'skip']}
                total={total}
                limitOptions={[10, 30, 50]}
                limit={limit}
                activePage={Number(activePage)}
                onChangePage={(e) => setPage('page', e)}
            />
          </div>
    </div>
  )
}

export default MaterialListTable
