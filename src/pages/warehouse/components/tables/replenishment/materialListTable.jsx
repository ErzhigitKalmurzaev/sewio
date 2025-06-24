import React, { useEffect, useState } from 'react'
import { Pagination, Table } from 'rsuite';

import { ReactComponent as Pencil } from '../../../../../assets/icons/pencil.svg';
import EditMaterialModal from '../../modals/EditMaterialModal';
import { materialUnits } from '../../../../../utils/selectDatas/productDatas';
import { useSelector } from 'react-redux';

const { Column, HeaderCell, Cell } = Table;

const MaterialListTable = ({ data, status, modals, setModals, total, limit, activePage, setPage, setUpdate }) => {

  const [selectedMaterial, setSelectedMaterial] = useState({});

  const { colors_list } = useSelector(state => state.material);

  const selectEditMaterial = (data) => {
    setSelectedMaterial(data);
    setModals({ ...modals, edit: true});
  }

  return (
    <div className='min-h-[500px] bg-white rounded-xl'>
        <Table
            height={600}
            loading={status === 'loading'}
            data={data || []}
            className='rounded-xl'
            bordered
            cellBordered
        >
            <Column width={60} align="center" fixed>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={250}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="title" />
            </Column>

            <Column width={60}>
                <HeaderCell align="center">Цвет</HeaderCell>
                <Cell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {rowData => (
                        rowData?.color ? (
                            <div style={{ 
                                background: colors_list?.find(color => color.id === rowData?.color)?.code,
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                border: '1px solid rgba(208, 213, 221, 1)'
                            }}></div> 
                        ) : (
                            <p>-</p>
                        )
                    )}
                </Cell>
            </Column>

            <Column width={120}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="vendor_code" />
            </Column>

            <Column width={120}>
                <HeaderCell>Коэффициент</HeaderCell>
                <Cell>
                    {rowData => (
                        <p>{rowData?.coefficient || '-/-/-/-'}</p>
                    )}
                </Cell>
            </Column>

            <Column width={120}>
                <HeaderCell>Цена</HeaderCell>
                <Cell dataKey="cost_price" />
            </Column>

            <Column width={120}>
                <HeaderCell>Количество</HeaderCell>
                <Cell dataKey="amount" />
            </Column>

            <Column width={150}>
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
