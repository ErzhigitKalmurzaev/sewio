import React, { forwardRef, useEffect, useState } from 'react'
import { getOperation, getOperationsTitlesList } from '../../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../../components/ui/inputs/selectForTable';
import { CircleMinus, PencilLine, Plus } from 'lucide-react';
import { getRankList } from '../../../../../store/technolog/rank';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';
import AddCombination from './../modals/addCombination';
import EditCombinations from '../modals/editCombinations';
import { roundTo } from '../../../../../utils/functions/numFuncs';

const { Column, HeaderCell, Cell } = Table;

const CombinationsPrint = forwardRef(({}, ref) => {

  const { operations_list } = useSelector(state => state.calculation);
  const { combinations, product_status } = useSelector(state => state.product)
  const { rank_list } = useSelector(state => state.rank);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [modals, setModals] = useState({ combination: false, edit: false });
  const [editComb, setEditComb] = useState({});

  useEffect(() => {
    if(!rank_list) {
        dispatch(getRankList());
    } 
    if(!operations_list) {
        dispatch(getOperationsTitlesList());
    }
  }, [dispatch])


  return (
    <div ref={ref} className='my-3'>
        <Table
            data={combinations || []}
            bordered
            loading={loading}
            cellBordered
            expandedRowKeys={combinations.map(item => item.id)}
            autoHeight
            isTree
            virtualized
            rowKey='id'
        >
            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? 
                            <span className='font-inter'>
                                {rowData?.title}
                            </span>
                        : (
                            <InputWithSuggestions
                                value={rowData.title}
                                placeholder="Название"
                                suggestions={operations_list}
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={120}>
                <HeaderCell>Время (сек)</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? null : (
                            <NumInputForTable
                                value={rowData.time}
                                placeholder="0"
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={180}>
                <HeaderCell>Разряд</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? null : (
                            <SelectForTable
                                value={rowData.rank}
                                placeholder="Разряд"
                                data={rank_list || []}
                                valueKey='id'
                                labelKey='title'
                            />
                        )
                    }
                </Cell>
            </Column>
            <Column width={120}>
                <HeaderCell>Цена (сом)</HeaderCell>
                <Cell style={{ padding: '7px 6px'}}>
                    {(rowData, index) =>
                        rowData.children ? null : (
                            <NumInputForTable
                                value={rowData.price}
                                placeholder="0"
                            />
                        )
                    }
                </Cell>
            </Column>
        </Table>
        <AddCombination modals={modals} setModals={setModals}/>
        <EditCombinations modals={modals} setModals={setModals} data={editComb} setData={setEditComb}/>
    </div>
  )
})

export default CombinationsPrint
