import React, { useState } from "react";
import { Table } from "rsuite";
import NumInputForTable from "../../../../../components/ui/inputs/numInputForTable";
import { getValueAmount } from "../../../../../store/kroi/order";
import { useDispatch, useSelector } from "react-redux";

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const PartyAmountTable = ({ data, status }) => {

  const dispatch = useDispatch();
  const { party_amounts } = useSelector(state => state.kroi_order);

  if (!data || data.length === 0) {
    return <p>Нет данных для отображения</p>;
  }

  const getValue = (value, index, sIndex) => {
    dispatch(getValueAmount({ index, value, sIndex }));
  };

  // Подсчет итогов по каждому цвету
  const totalByColor = party_amounts.map(item => {
    return {
      plan: item.sizes.reduce((sum, size) => sum + (size.plan_amount || 0), 0),
      fact: item.sizes.reduce((sum, size) => sum + (Number(size.true_amount) || 0), 0)
    };
  });


  return (
    <div className="flex flex-col gap-y-1">
      <Table
        bordered
        cellBordered
        autoHeight
        // minHeight={200}
        headerHeight={70}
        loading={status === 'loading'}
        data={[...party_amounts] || []}
        className="rounded-lg border-2 border-borderGray"
      >
        {/* Колонка "Цвет" */}
        <Column width={110} align="center" verticalAlign="center"fullText>
          <HeaderCell>Цвет</HeaderCell>
          <Cell dataKey="color.title" />
        </Column>

        {party_amounts[0]?.sizes?.map((sItem, sIndex) => (
          <ColumnGroup key={sIndex + 'tab'} header={sItem?.size?.title} verticalAlign="middle" align="center">
            <Column width={80} colSpan={2}>
              <HeaderCell>План</HeaderCell>
              <Cell>
                {
                  rowData => (
                    <p className="font-inter">{rowData?.sizes[sIndex]?.plan_amount}</p>
                  )
                }
              </Cell>
            </Column>
            <Column width={80}>
              <HeaderCell>Факт</HeaderCell>
              <Cell style={{ padding: '6px' }}>
                {(rowData, rowIndex) => (
                  <NumInputForTable
                    value={rowData?.sizes[sIndex]?.true_amount || ''}
                    onChange={(e) => getValue(e, rowIndex, sIndex)}
                    placeholder='0'
                  />
                )}
              </Cell>
            </Column>
          </ColumnGroup>
        ))}
        

        <ColumnGroup header={'ИТОГО'} verticalAlign="middle" align="center" fixed='right'>
            <Column width={70} colSpan={2}>
              <HeaderCell>План</HeaderCell>
              <Cell style={{ background: '#f9fbff' }}>
                {(rowData, rowIndex) => (
                  <p className="font-inter">{totalByColor[rowIndex]?.plan}</p>
                )}
              </Cell>
            </Column>
            <Column width={80}>
              <HeaderCell>Факт</HeaderCell>
              <Cell style={{ background: '#f9fbff' }}>
                {(rowData, rowIndex) => (
                  <p>{totalByColor[rowIndex]?.fact}</p>
                )}
              </Cell>
            </Column>
        </ColumnGroup>
      </Table>
    </div>
  );
};

export default PartyAmountTable;
