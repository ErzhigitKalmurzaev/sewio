import React from 'react';
import { Table } from 'rsuite';
import { useSelector } from 'react-redux';
import { formatedToDDMMYYYYHHMM } from '../../../../../utils/functions/dateFuncs';
import { useNavigate } from 'react-router-dom';

const { Column, HeaderCell, Cell } = Table;

const statusMap = {
  1: 'В обработке',
  2: 'Успешное перемещение',
  3: 'Отмена перемещения',
  4: 'Списание',
  5: 'Возврат клиенту',
  6: 'Брак',
  7: 'В заказ'
};

const statusColorMap = {
    1: 'text-yellow-500',   // В обработке
    2: 'text-green-600',    // Успешное перемещение
    3: 'text-gray-400',     // Отмена перемещения
    4: 'text-red-600',      // Списание
    5: 'text-blue-500',     // Возврат клиенту
    6: 'text-rose-500',     // Брак
    7: 'text-green-500'     // В заказ
  };

const getMovementType = (item, currentWarehouseId) => {
  if (item.status === 2 || item.status === 3) {
    const { in_warehouse, out_warehouse } = item.quantity || {};

    if (!out_warehouse) return 'Пополнение';
    if (!in_warehouse) return 'Отправка';

    if (in_warehouse?.id === currentWarehouseId) return 'Приход';
    if (out_warehouse?.id === currentWarehouseId) return 'Отправка';
    return 'Перемещение';
  }

  return '-';
};

const HistoryTable = ({ data = [], meWarehouseId, status }) => {

  const navigate = useNavigate();

  return (
    <div className='min-h-[500px] font-inter bg-white rounded-xl'>
        <Table
            height={600}
            data={data}
            loading={status === 'loading'}
            rowKey="id"
            bordered
            cellBordered
            className="rounded-lg border border-borderGray"
            onRowClick={(row) => navigate(`${row?.id}`)}
            rowClassName={'cursor-pointer'}
        >
            <Column width={80} align='center'>
                <HeaderCell>ID</HeaderCell>
                <Cell dataKey="id" />
            </Column>

            <Column width={200}>
                <HeaderCell>Сотрудник</HeaderCell>
                <Cell>
                {row => `${row.staff_name || '-'} ${row.staff_surname || ''}`}
                </Cell>
            </Column>

            <Column flexGrow={1}>
                <HeaderCell>Статус</HeaderCell>
                <Cell>
                    {row => {
                    const text = statusMap[row.status] || '-';
                    const colorClass = statusColorMap[row.status] || 'text-black';
                    return <span className={`${colorClass} font-medium`}>{text}</span>;
                    }}
                </Cell>
            </Column>

            <Column width={180}>
                <HeaderCell>Дата</HeaderCell>
                <Cell>
                {row => formatedToDDMMYYYYHHMM(row.created_at)}
                </Cell>
            </Column>

            <Column width={140}>
                <HeaderCell>Тип</HeaderCell>
                <Cell>
                {row => getMovementType(row, meWarehouseId)}
                </Cell>
            </Column>

            <Column flexGrow={1}>
                <HeaderCell>Склад-получатель</HeaderCell>
                <Cell>
                {row => row.quantity?.in_warehouse?.title || '-'}
                </Cell>
            </Column>

            <Column flexGrow={1}>
                <HeaderCell>Склад-отправитель</HeaderCell>
                <Cell>
                {row => row.quantity?.out_warehouse?.title || '-'}
                </Cell>
            </Column>
        </Table>
    </div>
  );
};

export default HistoryTable;
