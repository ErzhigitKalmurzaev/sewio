import React, { useState } from "react";
import { Table } from "rsuite";
import NumInputForTable from "../../../../../components/ui/inputs/numInputForTable";
import { getValueAmount } from "../../../../../store/kroi/order";
import { useDispatch, useSelector } from "react-redux";

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const PartyAmountTable = ({ data }) => {
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
    <div className="rounded-lg">
      <Table
        bordered
        cellBordered
        autoHeight
        headerHeight={70}
        data={[...party_amounts] || []}
        className="rounded-lg border-2 border-borderGray"
      >
        {/* Колонка "Цвет" */}
        <Column width={100} align="center" verticalAlign="center">
          <HeaderCell>Цвет</HeaderCell>
          <Cell dataKey="color.title" />
        </Column>

        {party_amounts[0]?.sizes?.map((sItem, sIndex) => (
          <ColumnGroup key={sIndex} header={sItem.size.title} verticalAlign="center" align="center">
            <Column width={70} colSpan={2}>
              <HeaderCell>План</HeaderCell>
              <Cell dataKey={`sizes[${sIndex}].plan_amount`} />
            </Column>
            <Column width={70}>
              <HeaderCell>Факт</HeaderCell>
              <Cell style={{ padding: '7px 6px' }}>
                {(rowData, rowIndex) => (
                  <NumInputForTable
                    value={rowData.sizes[sIndex]?.true_amount || ''}
                    onChange={(e) => getValue(e, rowIndex, sIndex)}
                    placeholder='0'
                  />
                )}
              </Cell>
            </Column>
          </ColumnGroup>
        ))}

        {/* Итоги по строкам */}
        <Column width={100} align="center" verticalAlign="center">
          <HeaderCell>ИТОГО</HeaderCell>
          <Cell>
            {(rowData, rowIndex) => (
              <p>
                {totalByColor[rowIndex].plan} / {totalByColor[rowIndex].fact}
              </p>
            )}
          </Cell>
        </Column>
      </Table>

    </div>
  );
};

export default PartyAmountTable;
