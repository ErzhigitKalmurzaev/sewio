import React from 'react'
import { useSelector } from 'react-redux'
import { Panel, PanelGroup, Table } from 'rsuite';
import SelectForTable from '../../../../components/ui/inputs/selectForTable';
import { formatedToDDMMYYYY } from './../../../../utils/functions/dateFuncs';

const { Cell, Column, HeaderCell } = Table;

const PartiesPanel = () => {

  const { order_parties } = useSelector(state => state.order);
  const { colors_list } = useSelector(state => state.material);

  const uniqueSizes = (index) => {
    return Array.from(
        new Set(order_parties[index]?.amounts?.flatMap(colorItem => colorItem.sizes.map(size => size.size.id)))
      )
        .map(sizeId => order_parties[index]?.amounts?.flatMap(colorItem => colorItem.sizes).find(size => size.size.id === sizeId)?.size)
        .filter(Boolean);
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

          <Table
            bordered
            cellBordered
            data={party.amounts || []}
            autoHeight
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
        </Panel>
      ))}
    </PanelGroup>
  )
}

export default PartiesPanel
