import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Table, Tag } from 'rsuite';
import { useReactToPrint } from 'react-to-print';

import { getHistoryById } from '../../../store/warehouse/warehouse';
import MyBreadcrums from '../../../components/ui/breadcrums';
import Title from '../../../components/ui/title';
import { formatedToDDMMYYYYHHMM } from '../../../utils/functions/dateFuncs';
import { materialUnits } from '../../../utils/selectDatas/productDatas';
import Button from '../../../components/ui/button';
import { Print } from '@mui/icons-material';

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

// Компонент для печати
const PrintComponent = React.forwardRef(({ data }, ref) => {
  const quantities = data?.quantity?.quantities || [];
  const status = statusMap[data?.status];

  return (
    <div ref={ref} style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Заголовок */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0' }}>
          ДЕТАЛИ ПЕРЕМЕЩЕНИЯ СЫРЬЯ
        </h1>
        <p style={{ fontSize: '14px', color: '#666', margin: '5px 0 0 0' }}>
          ID: {data?.id} | Дата: {formatedToDDMMYYYYHHMM(data?.created_at)}
        </p>
      </div>

      {/* Компактные детали */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '10px', 
        marginBottom: '20px',
        fontSize: '12px'
      }}>
        <div style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
          <strong>Сотрудник:</strong> {data?.staff_name} {data?.staff_surname}
        </div>
        <div style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
          <strong>Статус:</strong> {status?.label}
        </div>
        <div style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
          <strong>Склад-отправитель:</strong> {data?.quantity?.out_warehouse?.title || '-'}
        </div>
        <div style={{ border: '1px solid #ddd', padding: '8px', borderRadius: '4px' }}>
          <strong>Склад-получатель:</strong> {data?.quantity?.in_warehouse?.title || '-'}
        </div>
      </div>

      {/* Таблица */}
      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
          Список сырья
        </h3>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          fontSize: '11px',
          border: '1px solid #000'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>
                Название
              </th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>
                Артикул
              </th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                Кол-во
              </th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                Ед. изм.
              </th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                Цена
              </th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>
                Комментарий
              </th>
            </tr>
          </thead>
          <tbody>
            {quantities.map((row, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #000', padding: '4px' }}>
                  {row.nomenclature?.title || '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px' }}>
                  {row.nomenclature?.vendor_code || '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>
                  {row.amount || '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>
                  {materialUnits.find(u => u.value === row.nomenclature?.unit)?.label || '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>
                  {row.price ? `${row.price} сом` : '-'}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px' }}>
                  {row.comment || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Подпись внизу */}
      <div style={{ 
        marginTop: '30px', 
        display: 'flex', 
        justifyContent: 'space-between',
        fontSize: '12px'
      }}>
        <div>
          <p>Ответственный: _________________</p>
        </div>
        <div>
          <p>Дата печати: {new Date().toLocaleDateString('ru-RU')}</p>
        </div>
      </div>
    </div>
  );
});

PrintComponent.displayName = 'PrintComponent';

const HistoryDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const printRef = useRef();

  const { history_details } = useSelector(state => state.ware_warehouse);

  useEffect(() => {
    dispatch(getHistoryById(id));
  }, [dispatch, id]);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Детали_перемещения_${id}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 1cm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `
  });

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

      <div className="flex justify-between items-center">
        <Title text="Детали перемещения" />
        <Button
          onClick={handlePrint}
          disabled={!data}
        >
          <Print className='mr-2'/>
          Печать
        </Button>
      </div>

      {data && (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-8">
            {/* Инфо блоки */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoBlock label="ID" value={data.id} />
                <InfoBlock label="Дата" value={formatedToDDMMYYYYHHMM(data.created_at)} />
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

      {/* Скрытый компонент для печати */}
      <div style={{ display: 'none' }}>
        <PrintComponent ref={printRef} data={data} />
      </div>
    </div>
  );
};

export default HistoryDetail;