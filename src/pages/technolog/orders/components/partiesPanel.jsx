import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Panel, PanelGroup, Table, Checkbox } from 'rsuite';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import { formatedToDDMMYYYY } from './../../../../utils/functions/dateFuncs';
import { getColors } from '../../../../store/technolog/material';

const { Cell, Column, HeaderCell } = Table;

const PartiesPanel = () => {

  const dispatch = useDispatch();
  const { order_parties } = useSelector(state => state.order);
  const { colors_list } = useSelector(state => state.material);

  useEffect(() => {
    dispatch(getColors());
  }, [dispatch]);

  const uniqueSizes = (index) => {
    return Array.from(
        new Set(order_parties[index]?.amounts?.flatMap(colorItem => colorItem.sizes.map(size => size.size.id)))
      )
        .map(sizeId => order_parties[index]?.amounts?.flatMap(colorItem => colorItem.sizes).find(size => size.size.id === sizeId)?.size)
        .filter(Boolean);
  }

  const kroi_details = {
    passport_length: 'Длина в паспорте',
    table_length: 'Длина настила',
    layers_count: 'Кол-во слоев',
    number_of_marker: 'Номер маркировки',
    restyled: 'Перестил',
    defect: 'Брак',
    remainder: 'Конц-й остаток',
    fact_length: 'Факт. длина',
    fail: 'Недосдача',
    count_in_layer: 'Кол-во единиц',
  }
  console.log(order_parties)
  return (
    <PanelGroup accordion bordered>
      {order_parties.map((party, index) => (
        <Panel header={party.number} key={index} defaultExpanded>
          <div className='flex my-2 items-center justify-between'>
            <p className='font-inter text-sm font-semibold'>Сотрудник: {party.staff?.name} {party.staff?.surname}</p>
            <p className='font-inter text-sm font-semibold'>Дата: {formatedToDDMMYYYY(party?.created_at)}</p>
          </div>  

          {/* Таблица с количествами по размерам и цветам */}
          <Table
            bordered
            cellBordered
            data={party.amounts || []}
            autoHeight
            className="mb-4"
          >
            
            <Table.Column width={150} align='center' verticalAlign='middle' fixed>
                <Table.HeaderCell>Цвет</Table.HeaderCell>
                <Table.Cell style={{ padding: '6px' }}>
                {(rowData) => (
                    <SelectForTable
                        data={colors_list || []}
                        value={rowData.color}
                        placeholder="Цвет"
                        labelKey={'title'}
                        valueKey={'id'}
                        colors={true}
                        disabled={true}
                    />
                )}
                </Table.Cell>
            </Table.Column>

            
            {uniqueSizes(index)?.map((sizeItem, sIndex) => (
                    <Table.Column key={`cut-${sIndex}`} width={70} align='center' verticalAlign='middle'>
                        <Table.HeaderCell>{sizeItem.title}</Table.HeaderCell>
                        <Table.Cell style={{ padding: "6px" }}>
                        {(rowData) => {
                            const sizeData = rowData.sizes.find(s => s.size.id === sizeItem.id);
                            return <p className="text-center">{sizeData?.true_amount || 0}</p>;
                        }}
                        </Table.Cell>
                    </Table.Column>
            ))}
          </Table>

          {/* Таблица с материалами (consumables) */}
          {party.consumables && party.consumables.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 font-inter text-sm font-semibold">Расход материалов</h4>
              <Table
                bordered
                cellBordered
                wordWrap="break-word"
                headerHeight={54}
                autoHeight
                data={party.consumables || []}
                className="rounded-lg border-2 border-borderGray"
              >
                {/* Чекбокс главная ткань */}
                {/* <Column width={70} verticalAlign="middle" align="center">
                  <HeaderCell>Главная ткань</HeaderCell>
                  <Cell align="center">
                    {(rowData) => (
                      <Checkbox
                        className="p-0"
                        checked={Boolean(rowData?.is_main)} 
                        disabled={true}
                      />
                    )}
                  </Cell>
                </Column> */}

                {/* Название материала */}
                <Column width={150} verticalAlign="middle">
                  <HeaderCell>Название</HeaderCell>
                  <Cell>
                    {(rowData) => rowData?.nomenclature?.title || '-'}
                  </Cell>
                </Column>

                {/* Цвет материала */}
                <Column width={60}>
                  <HeaderCell align="center">Цвет</HeaderCell>
                  <Cell style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {rowData => (
                      rowData?.nomenclature?.color ? (
                        <div style={{ 
                          background: rowData?.nomenclature.color?.code,
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: '1px solid rgba(208, 213, 221, 1)'
                        }}></div> 
                      ) : (
                        <p>-</p>
                      )
                    )}
                  </Cell>
                </Column>

                {/* Динамические колонки для всех полей из kroi_details */}
                {Object.keys(kroi_details).map((key, columnIndex) => (
                  <Column width={85} key={columnIndex} verticalAlign="middle">
                    <HeaderCell>{kroi_details[key]}</HeaderCell>
                    <Cell style={{ padding: '6.5px', textAlign: 'center' }}>
                      {(rowData) => (
                        <span>{rowData[key] || rowData[key] === 0 ? rowData[key] : '-'}</span>
                      )}
                    </Cell>
                  </Column>
                ))}
              </Table>
            </div>
          )}
        </Panel>
      ))}
    </PanelGroup>
  )
}

export default PartiesPanel