import React, { useEffect, useState } from "react";
import { Table } from "rsuite";
import NumInputForTable from "../../../../../components/ui/inputs/numInputForTable";
import { addPartyConsumable, clearAll, deletePartyConsumable, fillPartyConsumables, getValueConsumables } from "../../../../../store/kroi/order";
import { useDispatch, useSelector } from "react-redux";
import InputWithSuggestions from "../../../../../components/ui/inputs/inputWithSuggestions";
import { getConsumablesTitleList, getMateralList, getMaterial } from "../../../../../store/technolog/material";
import { CircleMinus, Plus } from "lucide-react";
import { materialUnits } from "../../../../../utils/selectDatas/productDatas";

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const ConsumablesTable = ({  }) => {

  const dispatch = useDispatch();
  const { materials_list } = useSelector(state => state.material);
  const { party_consumables, product_info_status } = useSelector(state => state.kroi_order); 

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!materials_list) {
        dispatch(getMateralList({ title: '' }));
    }
    dispatch(clearAll())
  }, [])

  const getValue = ({ index, value, name }) => {
    dispatch(getValueConsumables({ index, name, value }));
  }

  const addRow = () => {
    dispatch(addPartyConsumable())
  }

  const deleteRow = (key) => {
    dispatch(deletePartyConsumable(key))
  }

  const handleSelect = (id, index) => {
    setLoading(true);
    dispatch(getMaterial({ id }))
    .then(res => {
        if(res.meta.requestStatus === 'fulfilled') {
            dispatch(fillPartyConsumables({ key: index, value: {
                nomenclature: res.payload.id,
                title: res.payload.title,
                consumption: '',
                defect: '',
                left: '',
                unit: res.payload.unit,
            }}))
            console.log(res.payload)
        }
        setLoading(false);
    })
  }

  return (
    <div className="flex flex-col gap-y-1">
        <Table
            bordered
            cellBordered
            autoHeight
            loading={loading || product_info_status === 'loading'}
            data={party_consumables || []}
            className="rounded-lg border-2 border-borderGray"
        >
            <Column width={200}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ padding: '6.5px' }}>
                    {
                        (rowData, index) => (
                            <InputWithSuggestions
                                value={rowData.title}
                                placeholder="Название"
                                onChange={(e) => getValue({ index, value: e.target.value, name: "title" })}
                                onSelect={(id) => handleSelect(id, index)}
                                suggestions={materials_list}
                            />
                        )
                    }
                </Cell>
            </Column>

            <Column width={130}>
                <HeaderCell>Потрачено</HeaderCell>
                <Cell style={{ padding: '6.5px' }}>
                    {
                        (rowData, index) => (
                            <NumInputForTable
                                width={100}
                                value={rowData?.consumption}
                                onChange={value => getValue({ index, value, name: 'consumption' })}
                                placeholder='0'
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={130}>
                <HeaderCell>Брак</HeaderCell>
                <Cell style={{ padding: '6.5px' }}>
                    {
                        (rowData, index) => (
                            <NumInputForTable
                                width={100}
                                value={rowData?.defect}
                                onChange={value => getValue({ index, value, name: 'defect' })}
                                placeholder='0'
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={130}>
                <HeaderCell>Остаток</HeaderCell>
                <Cell style={{ padding: '6.5px' }}>
                    {
                        (rowData, index) => (
                            <NumInputForTable
                                width={100}
                                value={rowData?.left}
                                onChange={value => getValue({ index, value, name: 'left' })}
                                placeholder='0'
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={130}>
                <HeaderCell>Ед. измерения</HeaderCell>
                <Cell>
                    {
                        rowData => (
                            <p>{rowData?.unit ? materialUnits[rowData?.unit - 1 || 0].label : '-'}</p>
                        )
                    }
                </Cell>
            </Column>

            <Column width={100}>
                <HeaderCell align="center">
                    <button onClick={addRow} className="cursor-pointer">
                         <Plus color="#00796B" />
                    </button>
                </HeaderCell>
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
