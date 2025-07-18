import React, { forwardRef, useEffect, useState } from 'react'
import { getOperationsTitlesList } from '../../../../../store/technolog/calculation';

import { useDispatch, useSelector } from 'react-redux';

import { Table } from 'rsuite'
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import SelectForTable from '../../../../../components/ui/inputs/selectForTable';
import { getRankList } from '../../../../../store/technolog/rank';
import InputWithSuggestions from '../../../../../components/ui/inputs/inputWithSuggestions';
import AddCombination from './../modals/addCombination';
import EditCombinations from '../modals/editCombinations';
import MultiImagePicker from '../../../../../components/ui/imagePickers/multiImagePicker';

const { Column, HeaderCell, Cell } = Table;

const CombinationsPrint = forwardRef(({ existingImages, setExistingImages, setDeleteImages, newImages, setNewImages }, ref) => {

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

  const sumChildValues = (children, key) => {
    if (!children || children.length === 0) return 0;
    return children.reduce((acc, item) => acc + (Number(item[key]) || 0), 0).toFixed(2);
  };


  return (
    <div ref={ref} className='my-3'>
        <div>
            <MultiImagePicker
                existingImages={existingImages}
                setExistingImages={setExistingImages}
                setDeleteImages={setDeleteImages}
                newImages={newImages}
                setNewImages={setNewImages}
            />
        </div>

         <Table
            data={combinations || []}
            bordered
            expandedRowKeys={combinations?.map((item) => item.id)}
            cellBordered
            autoHeight
            isTree
            virtualized
            rowKey='id'
        >
            <Column width={300}>
                <HeaderCell>Название</HeaderCell>
                <Cell>
                    {(rowData, index) =>
                        rowData.children ? 
                            <span className='font-inter'>
                                {rowData?.title}
                            </span>
                        : (
                            <span className='font-inter'>
                                {rowData?.title}
                            </span>
                        )
                    }
                </Cell>
            </Column>
            <Column width={100}>
                <HeaderCell>Время (сек)</HeaderCell>
                <Cell align='center'>
                    {(rowData) =>
                        rowData.children ? (
                            <span className="p-2">
                                {sumChildValues(rowData.children, 'time')}
                            </span>
                        ) : (
                            <span>{rowData.time}</span>
                        )
                    }
                </Cell>
            </Column>
            <Column width={100}>
                <HeaderCell>Разряд</HeaderCell>
                <Cell align='center'>
                    {(rowData, index) =>
                        rowData.children ? null : (
                            <span>{rank_list?.find(rank => rank.id === rowData.rank)?.title}</span>
                        )
                    }
                </Cell>
            </Column>
            <Column width={100}>
                <HeaderCell>Цена (сом)</HeaderCell>
                <Cell align='center'>
                    {(rowData) =>
                        rowData.children ? (
                            <span className='p-2'>
                                {sumChildValues(rowData.children, 'price')}
                            </span>
                        ) : (
                            <span>{rowData.price}</span>
                        )
                    }
                </Cell>
            </Column>
        </Table>
    </div>
  )
})

export default CombinationsPrint
