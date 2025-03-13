import React, { useEffect } from 'react'
import { Button, Table } from 'rsuite'
import { useDispatch, useSelector } from 'react-redux';
import NumInputForTable from '../../../../../components/ui/inputs/numInputForTable';
import { addDetail, getStaffList, removeDetail, updateDetail } from '../../../../../store/foreman/order';
import { CircleMinus, Plus } from 'lucide-react';
import EmployeeIdInput from '../../../../../components/ui/inputs/employeeIdInput';
import { toast } from 'react-toastify';

const { Column, HeaderCell, Cell } = Table;

const AccWorkTable = ({ data, status, amount }) => {

  const dispatch = useDispatch();
  const { staff_list } = useSelector(state => state.foreman_order);

  useEffect(() => {
    if (!staff_list) {
      dispatch(getStaffList())
    }
  }, []);

  const getAmountValue = (value, rowData, index) => {
      if (value > amount) {
        toast.error(`Максимально допустимое количество: ${amount}`);
        dispatch(updateDetail({ operationId: rowData.id, index, field: "count", value: '' }));
      } else {
        dispatch(updateDetail({ operationId: rowData.id, index, field: "count", value }));
      }
  }

  const maxDetails = Math.max(...data.map((op) => op.details.length));
  
  return (
    <div className="min-h-[300px] rounded-lg">
      <Table
        data={data || []}
        loading={status === 'loading'}
        autoHeight
        bordered
        cellBordered
        className="rounded-lg"
      >
        <Column width={170} fixed>
          <HeaderCell className="">Операция</HeaderCell>
          <Cell dataKey="title" className="text-sm font-medium" />
        </Column>

        {/* Динамические пары (Сотрудник + Кол-во + Удаление) */}
        {Array.from({ length: maxDetails }).map((_, index) => (
          <>
            <Column key={`staff-${index}`} width={130}>
              <HeaderCell>Сотрудник {index + 1}</HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => rowData.details[index] ? (
                  <EmployeeIdInput
                    employees={staff_list}
                    value={rowData.details[index]?.staff || ""}
                    onChange={(value) =>
                      dispatch(updateDetail({ operationId: rowData.id, index, field: "staff", value }))
                    }
                  />
                ) : null}
              </Cell>
            </Column>

            <Column key={`count-${index}`} width={100}>
              <HeaderCell>Кол-во 
                <span className='font-inter font-bold ml-2' style={{ color: amount ? 'green' : '#C2185B' }}>({amount ? amount : '--'})</span>
              </HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => rowData.details[index] ? (
                  <NumInputForTable
                    placeholder="Кол-во"
                    value={rowData.details[index]?.count || ""}
                    onChange={(value) => getAmountValue(value, rowData, index)}
                    max={amount}
                    className="w-full"
                  />
                ) : null}
              </Cell>
            </Column>

            {/* Кнопка удаления для каждой пары */}
            <Column key={`delete-${index}`} width={70} align="center">
              <HeaderCell>Удалить</HeaderCell>
              <Cell style={{ padding: '6.5px' }}>
                {(rowData) => rowData.details[index] ? (
                  <Button
                    size="xs"
                    appearance="subtle"
                    onClick={() => dispatch(removeDetail({ operationId: rowData.id, index }))}
                    className="p-1 rounded-md shadow-sm"
                  >
                    <CircleMinus size={18} color='#C2185B' />
                  </Button>
                ) : null}
              </Cell>
            </Column>
          </>
        ))}

        {/* Кнопка добавления нового сотрудника (в конце строки) */}
        <Column width={70} align="center">
          <HeaderCell>Добавить</HeaderCell>
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
}

export default AccWorkTable;
