import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'rsuite';
import { getColors } from './../../../../../store/technolog/material';

const {Column, HeaderCell, Cell} = Table;

const ComingMaterialsTable = ({ data, status }) => {

  const dispatch = useDispatch();  

  const { colors_list } = useSelector(state => state.material);

  useEffect(() => {
    if(!colors_list) {
        dispatch(getColors())
    }
  }, [])
  console.log(data)
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

            <Column width={250}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="nomenclature.title" />
            </Column>

            <Column width={100}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="nomenclature.vendor_code" />
            </Column>

            <Column width={60}>
                <HeaderCell align="center">Цвет</HeaderCell>
                <Cell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {rowData => (
                        rowData?.nomenclature?.color ? (
                            <div style={{ 
                                background: colors_list?.find(color => color.id === rowData?.nomenclature?.color)?.code,
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

            <Column width={250}>
                <HeaderCell>Количество</HeaderCell>
                <Cell dataKey="amount"/>
            </Column>

        </Table>
    </div>
  )
}

export default ComingMaterialsTable
