import React, { useEffect } from 'react';
import { Button, Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { addDetail, getStaffList, removeDetail, updateDetail, toggleExpanded } from '../../../../../store/foreman/order';
import { CircleMinus, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import EmployeeIdInput from '../../../../../components/ui/inputs/employeeIdInput';
import { toast } from 'react-toastify';
import { getRankList } from './../../../../../store/technolog/rank';

const { Column, HeaderCell, Cell } = Table;

const AccWorkTable = ({ data = [], status, amount }) => {
  const dispatch = useDispatch();
  const { staff_list, staff_list_status } = useSelector(state => state.foreman_order);
  const { rank_list } = useSelector(state => state.rank)

  useEffect(() => {
    if (!staff_list) {
      dispatch(getStaffList());
    }
    dispatch(getRankList());
  }, [dispatch, staff_list]);

  const getAmountValue = (value, rowData, index) => {
    const totalCount = rowData.details.reduce((sum, detail, i) => {
      if (i === index) {
        return sum + (Number(value) || 0);
      }
      return sum + (Number(detail.count) || 0);
    }, 0);

    if (totalCount > amount) {
      dispatch(updateDetail({ combinationId: rowData.id, index, field: 'count', value: '' }));
      toast.error(`Общее количество (${totalCount}) превышает максимально допустимое: ${amount}`, {
        autoClose: 4000
      });
    } else {
      dispatch(updateDetail({ combinationId: rowData.id, index, field: 'count', value }));
    }
  };

  const maxDetails = data.length > 0 ? Math.max(...data.map(comb => comb.details?.length || 1), 1) : 1;

  const getTotalCount = (arr, excludeIndex) => {
    return amount - arr?.reduce((sum, item, index) => {
      if (index === excludeIndex) return sum;
      const value = Number(item.count) || 0;
      return sum + value;
    }, 0);
  }

  const handleToggleExpanded = (combinationId) => {
    dispatch(toggleExpanded({ combinationId }));
  };

  const expandedData = [];
  data.forEach((combination) => {
    // Добавляем саму комбинацию
    expandedData.push({
      ...combination,
      rowType: 'combination'
    });

    // Если развернуто, добавляем операции
    if (combination.expanded && combination.operations?.length > 0) {
      combination.operations.forEach((operation, idx) => {
        expandedData.push({
          ...operation,
          combinationId: combination.id,
          rowType: 'operation',
          operationIndex: idx
        });
      });
    }
  });
  
  return (
    <div className="min-h-[300px] rounded-lg">
      <Table
        data={expandedData}
        loading={status === 'loading' || staff_list_status === 'loading'}
        autoHeight
        bordered
        cellBordered
        className="rounded-lg"
        rowClassName={(rowData) => {
          if (rowData?.rowType === 'operation') return 'bg-blue-50';
          return '';
        }}
      >
        <Column width={70} align="center">
          <HeaderCell>№</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData?.rowType === 'combination') {
                const combinationIndex = data.findIndex(c => c.id === rowData.id);
                return <p className="font-semibold">{combinationIndex + 1}</p>;
              }
              return null;
            }}
          </Cell>
        </Column>

        <Column width={400} fixed>
          <HeaderCell>Combination / Operation</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData?.rowType === 'combination') {
                return (
                  <div className="flex items-center gap-2">
                    {rowData.operations?.length > 0 && (
                      <Button
                        size="xs"
                        appearance="subtle"
                        onClick={() => handleToggleExpanded(rowData.id)}
                        className="p-0 min-w-[24px]"
                      >
                        {rowData.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </Button>
                    )}
                    <span className="text-sm font-semibold">{rowData.title}</span>
                    {rowData.operations?.length > 0 && (
                      <span className="text-xs text-gray-500">
                        ({rowData.operations.length})
                      </span>
                    )}
                  </div>
                );
              } else if (rowData?.rowType === 'operation') {
                return (
                  <div className="ml-2 flex items-center gap-3">
                    <span className="text-sm text-gray-700 min-w-[180px]">{rowData.title}</span>
                    <span className="text-xs text-gray-600"><strong>{rowData.time}</strong> sec</span>
                    <span className="text-xs text-gray-600"><strong>{rank_list.find(r => r.id === rowData.rank)?.title}</strong></span>
                    <span className="text-xs text-gray-600"><strong>{Number(rowData.price).toFixed(2)}</strong> som</span>
                  </div>
                );
              }
              return null;
            }}
          </Cell>
        </Column>

        {Array.from({ length: maxDetails }).map((_, index) => (
          <React.Fragment key={`detail-${index}`}>
            <Column width={130}>
              <HeaderCell>Employee {index + 1}</HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => {
                  if (rowData?.rowType === 'combination' && rowData.details?.[index]) {
                    return (
                      <EmployeeIdInput
                        employees={staff_list || []}
                        disabled={rowData.details[index].status === 1 || !amount}
                        value={rowData.details[index].staff || ''}
                        onChange={value => dispatch(updateDetail({ 
                          combinationId: rowData.id, 
                          index, 
                          field: 'staff', 
                          value 
                        }))}
                      />
                    );
                  }
                  return null;
                }}
              </Cell>
            </Column>

            <Column width={100}>
              <HeaderCell>
                Quan-y
                <span className="font-inter font-bold ml-1 text-xs" style={{ color: amount ? 'green' : '#C2185B' }}>
                  ({amount || '--'})
                </span>
              </HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => {
                  if (rowData?.rowType === 'combination' && rowData.details?.[index]) {
                    return (
                      <NumInputForTable
                        value={rowData.details[index].count || ''}
                        disabled={rowData.details[index].status === 1 || !amount}
                        onChange={value => getAmountValue(value, rowData, index)}
                        max={getTotalCount(rowData.details, index)}
                        className="w-full"
                      />
                    );
                  }
                  return null;
                }}
              </Cell>
            </Column>

            <Column width={70} align="center">
              <HeaderCell>Delete</HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => {
                  if (rowData?.rowType === 'combination' && rowData.details?.[index] && rowData.details.length > 1) {
                    return (
                      <Button
                        size="xs"
                        appearance="subtle"
                        onClick={() => dispatch(removeDetail({ 
                          combinationId: rowData.id, 
                          index 
                        }))}
                        className="p-1 rounded-md shadow-sm"
                        disabled={rowData.details[index].status === 1}
                      >
                        <CircleMinus size={18} color={rowData.details[index].status === 1 ? "#ccc" : "#C2185B"} />
                      </Button>
                    );
                  }
                  return null;
                }}
              </Cell>
            </Column>
          </React.Fragment>
        ))}

        <Column width={70} align="center">
          <HeaderCell>Add</HeaderCell>
          <Cell style={{ padding: '6.5px' }}>
            {(rowData) => {
              if (rowData?.rowType === 'combination') {
                return (
                  <Button
                    size="xs"
                    appearance="subtle"
                    onClick={() => dispatch(addDetail({ combinationId: rowData.id }))}
                    className="p-1 rounded-md shadow-sm bg-green-100 active:scale-95"
                    disabled={!amount}
                  >
                    <Plus size={18} />
                  </Button>
                );
              }
              return null;
            }}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default AccWorkTable;