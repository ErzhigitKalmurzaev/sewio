// ViewCombinationsTable.jsx
import React, { useEffect } from 'react';
import { Table, Button } from 'rsuite';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getRankList } from '../../../store/technolog/rank';
import { toggleExpanded } from '../../../store/foreman/order';

const { Column, HeaderCell, Cell } = Table;

const ViewCombinationsTable = ({ combinations = [], status }) => {
  const dispatch = useDispatch();
  const { rank_list } = useSelector(state => state.rank);

  useEffect(() => {
    dispatch(getRankList());
  }, [dispatch]);

  const handleToggleExpanded = (combinationIndex) => {
    dispatch(toggleExpanded({ combinationIndex }));
  };

  const sumOperationsValues = (operations, key) => {
    if (!operations || operations.length === 0) return 0;
    return operations.reduce((acc, item) => {
      const value = Number(item[key]) || 0;
      return acc + value;
    }, 0).toFixed(2);
  };

  const expandedData = [];
  combinations.forEach((combination, index) => {
    // Добавляем комбинацию
    expandedData.push({
      ...combination,
      rowType: 'combination',
      combinationIndex: index
    });

    // Если развернуто, добавляем операции
    if (combination.expanded && combination.operations?.length > 0) {
      combination.operations.forEach((operation, opIndex) => {
        expandedData.push({
          ...operation,
          rowType: 'operation',
          combinationIndex: index,
          operationIndex: opIndex
        });
      });
    }
  });

  if (status === 'loading') {
    return (
      <div className="min-h-[300px] rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  if (!combinations || combinations.length === 0) {
    return (
      <div className="min-h-[300px] rounded-lg flex items-center justify-center border border-gray-200">
        <div className="text-gray-500">Нет данных для отображения</div>
      </div>
    );
  }

  return (
    <div className="min-h-[300px] rounded-lg">
      <Table
        data={expandedData}
        bordered
        cellBordered
        autoHeight
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
                return <p className="font-semibold">{rowData.combinationIndex + 1}</p>;
              }
              return null;
            }}
          </Cell>
        </Column>

        <Column width={450} flexGrow={1}>
          <HeaderCell>Название комбинации / операции</HeaderCell>
          <Cell style={{ padding: '6px 7px' }}>
            {(rowData) => {
              if (rowData?.rowType === 'combination') {
                return (
                  <div className="flex items-center gap-2 py-2">
                    {rowData.operations?.length > 0 && (
                      <Button
                        size="xs"
                        appearance="subtle"
                        onClick={() => handleToggleExpanded(rowData.combinationIndex)}
                        className="p-0 min-w-[24px]"
                      >
                        {rowData.expanded ? 
                          <ChevronDown size={18} /> : 
                          <ChevronRight size={18} />
                        }
                      </Button>
                    )}
                    <span className="text-sm font-semibold">{rowData.title || 'Без названия'}</span>
                    {rowData.operations?.length > 0 && (
                      <span className="text-xs text-gray-500">
                        ({rowData.operations.length} {rowData.operations.length === 1 ? 'операция' : 'операций'})
                      </span>
                    )}
                  </div>
                );
              } else if (rowData?.rowType === 'operation') {
                return (
                  <div className="ml-8 py-2">
                    <span className="text-sm text-gray-700">{rowData.title || 'Без названия'}</span>
                  </div>
                );
              }
              return null;
            }}
          </Cell>
        </Column>

        <Column width={150}>
          <HeaderCell>Время (сек)</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData?.rowType === 'combination') {
                return (
                  <div className="flex items-center gap-2 py-2">
                    <span className="font-medium">{sumOperationsValues(rowData.operations, 'time')}</span>
                  </div>
                );
              } else if (rowData?.rowType === 'operation') {
                return (
                  <span className="text-sm">{Number(rowData.time || 0).toFixed(2)}</span>
                );
              }
              return null;
            }}
          </Cell>
        </Column>

        <Column width={150}>
          <HeaderCell>Разряд</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData?.rowType === 'operation' && rowData.rank) {
                const rankInfo = rank_list?.find(r => r.id === rowData.rank);
                return (
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{rankInfo?.title || rowData.rank}</span>
                  </div>
                );
              }
              return null;
            }}
          </Cell>
        </Column>

        <Column width={150}>
          <HeaderCell>Цена (сом)</HeaderCell>
          <Cell>
            {(rowData) => {
              if (rowData?.rowType === 'combination') {
                return (
                  <div className="flex items-center gap-2 py-2">
                    <span className="font-medium">{sumOperationsValues(rowData.operations, 'price')}</span>
                  </div>
                );
              } else if (rowData?.rowType === 'operation') {
                return (
                  <span className="text-sm">{Number(rowData.price || 0).toFixed(2)}</span>
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

export default ViewCombinationsTable;