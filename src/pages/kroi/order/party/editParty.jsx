import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { changePartyNumber, getPartyById, patchParty } from '../../../../store/kroi/order';
import Title from '../../../../components/ui/title';
import PartyAmountTable from '../components/tables/partyAmountTable';
import ConsumablesTable from '../components/tables/consumablesTable';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import Button from '../../../../components/ui/button';
import { toast } from 'react-toastify';
import TextInputForTable from '../../../../components/ui/inputs/textInputForTable';
import { Print } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

// Компонент для печатной версии - официальный формат
const PrintableReport = React.forwardRef((props, ref) => {
  const { party, party_amounts, party_consumables } = props;

  // Группировка данных по цветам для горизонтального отображения
  const groupedData = party_amounts?.reduce((acc, item) => {
    if (!acc[item.color?.title || 'Без цвета']) {
      acc[item.color?.title || 'Без цвета'] = [];
    }
    acc[item.color?.title || 'Без цвета'] = item.sizes || [];
    return acc;
  }, {});

  // Получение всех уникальных размеров
  const allSizes = [...new Set(party_amounts?.flatMap(item => 
    item.sizes?.map(size => size.size?.title) || []
  ) || [])];

  return (
    <div ref={ref} className='bg-white p-6 text-black' style={{ fontSize: '12px', fontFamily: 'Arial, sans-serif', lineHeight: '1.3' }}>
      
      {/* Шапка документа */}
      <div className='text-center mb-5 border-b-2 border-black pb-3'>
        <div className='font-bold text-base mb-2'>ПРОИЗВОДСТВЕННЫЙ ОТЧЕТ</div>
        <div className='flex justify-between text-sm'>
          <span>Заказ № {party?.order}</span>
          <span>Партия № {party?.number}</span>
          <span>Дата: {new Date().toLocaleDateString('ru-RU')}</span>
        </div>
      </div>

      {/* Информация о товаре */}
      <div className='mb-4 text-sm'>
        <div><strong>Товар:</strong> {party?.nomenclature?.title}</div>
        {party?.nomenclature?.vendor_code && (
          <div><strong>Артикул:</strong> {party?.nomenclature?.vendor_code}</div>
        )}
      </div>

      {/* Основная таблица - горизонтальная компоновка */}
      <table className='w-full border-collapse mb-5' style={{ border: '1px solid black', fontSize: '11px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid black', padding: '4px 6px', width: '100px' }}>Цвет/Размер</th>
            {allSizes.map(size => (
              <th key={size} style={{ border: '1px solid black', padding: '4px 6px', minWidth: '45px' }}>
                {size}
              </th>
            ))}
            <th style={{ border: '1px solid black', padding: '4px 6px', width: '60px' }}>Итого</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedData || {}).map(([colorName, sizes]) => (
            <React.Fragment key={colorName}>
              {/* Строка плана */}
              <tr>
                <td style={{ border: '1px solid black', padding: '4px 6px', fontWeight: 'bold' }}>
                  {colorName} (план)
                </td>
                {allSizes.map(sizeName => {
                  const sizeData = sizes.find(s => s.size?.title === sizeName);
                  return (
                    <td key={sizeName} style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center' }}>
                      {sizeData?.plan_amount || 0}
                    </td>
                  );
                })}
                <td style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>
                  {sizes.reduce((sum, s) => sum + (s.plan_amount || 0), 0)}
                </td>
              </tr>
              
              {/* Строка факта */}
              <tr>
                <td style={{ border: '1px solid black', padding: '4px 6px', fontWeight: 'bold' }}>
                  {colorName} (факт)
                </td>
                {allSizes.map(sizeName => {
                  const sizeData = sizes.find(s => s.size?.title === sizeName);
                  return (
                    <td key={sizeName} style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center' }}>
                      {sizeData?.true_amount || 0}
                    </td>
                  );
                })}
                <td style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center', fontWeight: 'bold' }}>
                  {sizes.reduce((sum, s) => sum + (s.true_amount || 0), 0)}
                </td>
              </tr>
            </React.Fragment>
          ))}
          
          {/* Итоговые строки */}
          <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid black', padding: '4px 6px' }}>ПЛАН ОБЩИЙ</td>
            {allSizes.map(sizeName => {
              const totalPlan = Object.values(groupedData || {}).reduce((total, sizes) => {
                const sizeData = sizes.find(s => s.size?.title === sizeName);
                return total + (sizeData?.plan_amount || 0);
              }, 0);
              return (
                <td key={sizeName} style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center' }}>
                  {totalPlan}
                </td>
              );
            })}
            <td style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center' }}>
              {party_amounts?.reduce((total, item) => 
                total + item.sizes?.reduce((sum, size) => sum + (size.plan_amount || 0), 0), 0
              ) || 0}
            </td>
          </tr>
          
          <tr style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
            <td style={{ border: '1px solid black', padding: '4px 6px' }}>ФАКТ ОБЩИЙ</td>
            {allSizes.map(sizeName => {
              const totalFact = Object.values(groupedData || {}).reduce((total, sizes) => {
                const sizeData = sizes.find(s => s.size?.title === sizeName);
                return total + (sizeData?.true_amount || 0);
              }, 0);
              return (
                <td key={sizeName} style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center' }}>
                  {totalFact}
                </td>
              );
            })}
            <td style={{ border: '1px solid black', padding: '4px 6px', textAlign: 'center' }}>
              {party_amounts?.reduce((total, item) => 
                total + item.sizes?.reduce((sum, size) => sum + (size.true_amount || 0), 0), 0
              ) || 0}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Расходные материалы - обновленная структура */}
      {party_consumables && party_consumables.length > 0 && (
        <div className='mb-4'>
          <div className='font-bold text-sm mb-2'>РАСХОДНЫЕ МАТЕРИАЛЫ:</div>
          <table className='w-full border-collapse' style={{ border: '1px solid black', fontSize: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'left', minWidth: '100px' }}>Материал</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '55px' }}>Паспорт длина</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '55px' }}>Настил длина</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '45px' }}>Слои</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '45px' }}>Кол-во ед.</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '60px' }}>Маркировка</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '45px' }}>Перестил</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '40px' }}>Брак</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '45px' }}>Остаток</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '50px' }}>Факт длина</th>
                <th style={{ border: '1px solid black', padding: '3px 4px', width: '45px' }}>Недосдача</th>
              </tr>
            </thead>
            <tbody>
              {party_consumables.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid black', padding: '3px 4px', fontWeight: '500' }}>
                    {item.title || 'Материал не указан'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.passport_length || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.table_length || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.layers_count || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.count_in_layer || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.number_of_marker || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.restyled || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.defect || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.remainder || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.fact_length || '-'}
                  </td>
                  <td style={{ border: '1px solid black', padding: '3px 4px', textAlign: 'center' }}>
                    {item.fail || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Подпись */}
      <div className='mt-6 text-sm flex justify-between'>
        <div>Ответственный: _________________ </div>
        <div>Контролер: _________________</div>
      </div>
    </div>
  );
});

const EditParty = () => {

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const printRef = useRef();

  const { party, party_status, party_amounts, party_consumables, party_active_sizes } = useSelector(state => state.kroi_order);

  useEffect(() => {
    dispatch(getPartyById({ id }))
  }, [id]);

  const setParty = (e) => {
    dispatch(changePartyNumber({ value: e }))
  }
  
  const validateField = () => {
    if(!party.number && id) {
      return false;
    }
    return true;
  }

  const onSubmit = () => {
    if(validateField()) {
        const new_party = {
          order: Number(party.order),
          nomenclature: party.nomenclature.id,
          number: party.number,
          details: party_amounts.flatMap(item => (
            item.sizes.map(sizeData => ({
              color: item.color.id,
              size: sizeData.size.id,
              plan_amount: sizeData.plan_amount,
              true_amount: Number(sizeData.true_amount)
            }))
          )),
          consumptions: party_consumables
            .filter(item => item.nomenclature)
            .map(item => ({
              nomenclature: item.nomenclature,
              consumption: Number(item.consumption),
              defect: Number(item.defect),
              left: Number(item.left)
            }))
        
        }
        dispatch(patchParty({ id, props: new_party })).then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            toast.success('Партия успешно изменена!');
            navigate(-1)
          }
        })
      } else {
        toast.error('Заполните поле № партии!')
      }
  }

  const handlePrint = useReactToPrint({
    documentTitle: `Отчёт_о_партии_${party?.number || 'без_номера'}`,
    contentRef: printRef,
    pageStyle: `
      @page {
        size: A4;
        margin: 1cm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial, sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      }
    `
  });

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <div className='flex justify-between items-center'>
          <Title text={`Редактирование партии № ${party?.number}`}/>
          <Button 
            onClick={handlePrint} 
            className='w-max px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
          >
            <Print className='mr-2'/>
            Распечатать
          </Button>
        </div>
        
        {/* Обычное представление для редактирования */}
        <div className='flex flex-col gap-y-10 bg-white rounded-lg p-4'>
          <div className='flex gap-x-16 items-center border-b border-borderGray py-2'>
              <div className='flex items-center gap-x-4'>
                  <span className='text-base font-semibold font-inter'>Заказ</span>
                  <span className='text-base font-semibold font-inter text-fprimary'>№ {party?.order}</span>
                  <span className='text-base font-semibold font-inter'> партия</span>
                  <span>
                      <TextInputForTable
                          placeholder={'№ партии'}
                          width={'100px'}
                          value={party?.number}
                          onChange={(e) => setParty(e.target.value)}
                      />
                  </span>
              </div>
              <div className='flex items-center gap-x-6'>
                  <span className='text-base font-semibold font-inter'>
                      Товар: 
                      <span className='text-fprimary ml-3'>{party?.nomenclature?.title}</span>
                  </span>
                  <span className='text-base font-semibold font-inter'>
                      Артикул: 
                      <span className='text-fprimary ml-3'>{party?.nomenclature?.vendor_code}</span>
                  </span>
              </div>
          </div>

          <PartyAmountTable data={party_amounts} status={party_status} />

          <ConsumablesTable type='edit' status={party_status} />
        </div>

        {/* Скрытый компонент для печати */}
        <div style={{ display: 'none' }}>
          <PrintableReport 
            ref={printRef} 
            party={party} 
            party_amounts={party_amounts} 
            party_consumables={party_consumables}
          />
        </div>
        
        <div className='flex justify-center'>
            <Button width='180px' onClick={onSubmit}>Сохранить</Button>
        </div>
    </div>
  )
}

export default EditParty