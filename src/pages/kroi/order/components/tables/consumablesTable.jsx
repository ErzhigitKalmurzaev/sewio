import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import NumInputForTable from "../../../../../components/ui/inputs/numInputForTable";
import { deletePartyConsumable, fillPartyConsumables, getValueConsumables } from "../../../../../store/kroi/order";
import { useDispatch, useSelector } from "react-redux";
import { getColors, getKroiMaterials } from "../../../../../store/technolog/material";
import { CircleMinus } from "lucide-react";
import { useParams } from "react-router-dom";

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const ConsumablesTable = ({ type = 'new', status }) => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const { party_consumables, party_active_sizes } = useSelector(state => state.kroi_order); 
  const { colors_list } = useSelector(state => state.material);

  useEffect(() => {
    if(type !== 'edit') {
        dispatch(getKroiMaterials(id))
        .then((res) =>  {
            if(res.meta.requestStatus === 'fulfilled') {
                dispatch(fillPartyConsumables(res.payload));
            }
        });
    }
    
    dispatch(getColors());
  }, [id, dispatch]);

  const getValue = ({ index, value, name }) => {
    dispatch(getValueConsumables({ index, name, value, select_sizes: party_active_sizes }));
  }

  const deleteRow = (key) => {
    dispatch(deletePartyConsumable(key))
  }

  const kroi_details = {
    passport_length: 'Длина в паспорте',
    table_length: 'Длина настила',
    layers_count: 'Кол-во слоев',
    number_of_marker: 'Номер маркировки',
    restyled: 'Перестил',
    defect: 'Брак',
    remainder: 'Конц-й остаток',
    fact_length: 'Факт. длина',
    fail: 'Недосдача',
    count_in_layer: 'Кол-во в слое',
  }
  
  return (
    <div className="flex flex-col gap-y-1">
        <Table
            bordered
            cellBordered
            wordWrap="break-word"
            headerHeight={54}
            autoHeight
            loading={status === 'loading'}
            data={party_consumables || []}
            className="rounded-lg border-2 border-borderGray"
        >
            <Column width={150} verticalAlign="middle">
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
            {
                Object.keys(kroi_details).map((key, index) => (
                    <Column width={85} key={index} verticalAlign="middle">
                        <HeaderCell>{kroi_details[key]}</HeaderCell>
                        <Cell style={{ padding: '6.5px' }}>
                            {(rowData, rowIndex) => {
                                const isReadonlyField = ['passport_length', 'fact_length', 'fail'].includes(key);

                                return (
                                    <NumInputForTable
                                        value={rowData[key]}
                                        placeholder="0"
                                        disabled={isReadonlyField}
                                        onChange={(e) => getValue({ index: rowIndex, value: e, name: key })}
                                    />
                                )
                            }}
                        </Cell>
                    </Column>
                ))
            }
            <Column width={100}>
                <HeaderCell align="center" verticalAlign="middle">Действие</HeaderCell>
                <Cell>
                    {(rowData, index) =>
                        <div className='flex justify-center'>
                            <button onClick={() => deleteRow(index)} className="cursor-pointer">
                                <CircleMinus color="#C2185B" />
                            </button>
                        </div>
                    }
                </Cell>
            </Column>
        </Table>
    </div>
  )
}

export default ConsumablesTable
