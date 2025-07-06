import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Table, Tag, Uploader } from 'rsuite';

import { getHistoryById } from '../../../store/warehouse/warehouse';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import { formatedToDDMMYYYY } from '../../../utils/functions/dateFuncs';
import { materialUnits } from '../../../utils/selectDatas/productDatas';

const { Column, HeaderCell, Cell } = Table;

const statusMap = {
  1: { label: 'В обработке', color: 'orange' },
  2: { label: 'Успешное перемещение', color: 'green' },
  3: { label: 'Отмена перемещения', color: 'red' },
  4: { label: 'Списание', color: 'violet' },
  5: { label: 'Возврат клиенту', color: 'cyan' },
  6: { label: 'Брак', color: 'red' },
};

const InfoBlock = ({ label, value }) => (
  <div className="bg-gray-50 border border-borderGray rounded-lg px-4 py-3 shadow-sm">
    <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
    <div className="text-sm font-medium text-gray-800 break-words">{value || '-'}</div>
  </div>
);

const HistoryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { history_details } = useSelector(state => state.ware_warehouse);

  useEffect(() => {
    dispatch(getHistoryById(id));
  }, [dispatch, id]);

  const data = history_details;
  const quantities = data?.quantity?.quantities || [];
  const status = statusMap[data?.status];

  return (
    <div className="flex flex-col gap-y-6 mb-10">
      <MyBreadcrums
        items={[
          { label: 'Главная', path: '/main' },
          { label: 'История', path: '/main/history' },
          { label: 'Детали', path: `/main/history/${id}`, active: true },
        ]}
      />

      <Title text="Детали перемещения" />

      {data && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
            {/* Инфо блоки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoBlock label="ID" value={data.id} />
                <InfoBlock label="Дата" value={formatedToDDMMYYYY(data.created_at)} />
                <InfoBlock label="Сотрудник" value={`${data.staff_name} ${data.staff_surname}`} />
                <InfoBlock
                label="Статус"
                value={<Tag color={status?.color} size="sm">{status?.label}</Tag>}
                />
                <InfoBlock label="Склад-получатель" value={data.quantity?.in_warehouse?.title} />
                <InfoBlock label="Склад-отправитель" value={data.quantity?.out_warehouse?.title} />
            </div>

            {/* файлы*/}
            {data.quantity?.files?.length > 0 && (
                <div className="border border-borderGray bg-gray-50 rounded-lg px-4 py-3">
                    <p className="text-sm text-gray-500 mb-3 font-semibold">Файлы</p>
                    <ul>
                        {data.quantity.files.map((file, i) => (
                            <li key={i} className="flex gap-x-5 items-center py-1">
                            <span className="text-sm text-gray-800 break-all">
                                {decodeURIComponent(file.file.split('/').pop()) || `Файл ${i + 1}`}
                            </span>
                            <a
                                href={file.file}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Скачать
                            </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}


          {/* Таблица сырья */}
          <div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Список сырья</h3>
            <Table
              autoHeight
              bordered
              maxHeight={600}
              cellBordered
              data={quantities}
              wordWrap='break-all'
              className="rounded-md border border-gray-200"
              rowClassName={() => 'hover:bg-gray-50 transition-all'}
            >
              <Column width={180} minWidth={160}>
                <HeaderCell>Название</HeaderCell>
                <Cell dataKey="nomenclature.title" />
              </Column>

              <Column width={120} minWidth={120}>
                <HeaderCell>Артикул</HeaderCell>
                <Cell dataKey="nomenclature.vendor_code" />
              </Column>

              <Column width={100} align="center">
                <HeaderCell>Кол-во</HeaderCell>
                <Cell dataKey="amount" />
              </Column>

              <Column width={110} align="center">
                <HeaderCell>Ед. изм.</HeaderCell>
                <Cell>
                  {row => materialUnits.find(u => u.value === row.nomenclature.unit)?.label || '-'}
                </Cell>
              </Column>

              <Column width={110} align="center">
                <HeaderCell>Цена</HeaderCell>
                <Cell>{row => row.price ? `${row.price} сом` : '-'}</Cell>
              </Column>

              <Column flexGrow={1}>
                <HeaderCell>Комментарий</HeaderCell>
                <Cell>{row => row.comment || '-'}</Cell>
              </Column>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryDetail;
