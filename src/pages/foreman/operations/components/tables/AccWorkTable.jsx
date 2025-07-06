import React, { useEffect } from 'react';
import { Button, Table } from 'rsuite';
import { useDispatch, useSelector } from 'react-redux';
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { addDetail, getStaffList, removeDetail, updateDetail } from '../../../../../store/foreman/order';
import { CircleMinus, Plus } from 'lucide-react';
import EmployeeIdInput from '../../../../../components/ui/inputs/employeeIdInput';
import { toast } from 'react-toastify';

const { Column, HeaderCell, Cell } = Table;

const AccWorkTable = ({ data, status, amount }) => {
  const dispatch = useDispatch();
  const { staff_list, staff_list_status } = useSelector(state => state.foreman_order);

  useEffect(() => {
    if (!staff_list) {
      dispatch(getStaffList());
    }
  }, [dispatch, staff_list]);

  const getAmountValue = (value, rowData, index) => {
    const totalCount = rowData.details.reduce((sum, detail, i) => {
      if (i === index) {
        return sum + (Number(value) || 0);
      }
      return sum + (Number(detail.count) || 0);
    }, 0);

    if (totalCount > amount) {
      dispatch(updateDetail({ operationId: rowData.id, index, field: 'count', value: '' }));
      toast.error(`Общее количество (${totalCount}) превышает максимально допустимое: ${amount}`, {
        autoClose: 4000
      });
    } else {
      dispatch(updateDetail({ operationId: rowData.id, index, field: 'count', value }));
    }
  };

  const maxDetails = Math.max(...data.map(op => op.details.length));

  return (
    <div className="min-h-[300px] rounded-lg">
      <Table
        data={[...data]} // новая ссылка для принудительного обновления
        loading={status === 'loading' || staff_list_status === 'loading'}
        autoHeight
        bordered
        cellBordered
        className="rounded-lg"
      >
        <Column width={70} align="center">
          <HeaderCell>Number</HeaderCell>
          <Cell>{(rowData, rowIndex) => <p>{rowIndex + 1}</p>}</Cell>
        </Column>

        <Column width={170} fixed>
          <HeaderCell>Operation</HeaderCell>
          <Cell dataKey="title" className="text-sm font-medium" />
        </Column>

        {/* Динамические колонки сотрудников и количеств */}
        {Array.from({ length: maxDetails }).map((_, index) => (
          <React.Fragment key={index}>
            <Column width={130}>
              <HeaderCell>Employee {index + 1}</HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => rowData.details[index] ? (
                  <EmployeeIdInput
                    employees={staff_list || []}
                    value={rowData.details[index].staff || ''}
                    onChange={value => dispatch(updateDetail({ operationId: rowData.id, index, field: 'staff', value }))}
                  />
                ) : null}
              </Cell>
            </Column>

            <Column width={100}>
              <HeaderCell>
                Quantity
                <span className="font-inter font-bold ml-2" style={{ color: amount ? 'green' : '#C2185B' }}>({amount || '--'})</span>
              </HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => rowData.details[index] ? (
                  <NumInputForTable
                    value={rowData.details[index].count || ''}
                    onChange={value => getAmountValue(value, rowData, index)}
                    max={amount}
                    className="w-full"
                    disabled={!amount}
                  />
                ) : null}
              </Cell>
            </Column>

            <Column width={70} align="center">
              <HeaderCell>Delete</HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => rowData.details[index] ? (
                  <Button
                    size="xs"
                    appearance="subtle"
                    onClick={() => dispatch(removeDetail({ operationId: rowData.id, index }))}
                    className="p-1 rounded-md shadow-sm"
                  >
                    <CircleMinus size={18} color="#C2185B" />
                  </Button>
                ) : null}
              </Cell>
            </Column>
          </React.Fragment>
        ))}

        <Column width={70} align="center">
          <HeaderCell>Add</HeaderCell>
          <Cell style={{ padding: '6.5px' }}>
            {(rowData) => (
              <Button
                size="xs"
                appearance="subtle"
                onClick={() => dispatch(addDetail({ operationId: rowData.id }))}
                className="p-1 rounded-md shadow-sm bg-green-100 active:scale-95"
              >
                <Plus size={18} />
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
    </div>
  );
};

export default AccWorkTable;
