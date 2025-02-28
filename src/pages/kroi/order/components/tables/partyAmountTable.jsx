import React, { useState } from "react";
import { Table } from "rsuite";
import NumInputForTable from "../../../../../components/ui/inputs/numInputForTable";
import { getValueAmount } from "../../../../../store/kroi/order";
import { useDispatch, useSelector } from "react-redux";

const { Column, HeaderCell, Cell, ColumnGroup } = Table;

const PartyAmountTable = ({ data }) => {
  // Проверяем, есть ли вообще данные

  const dispatch = useDispatch();

  const { party_amounts } = useSelector(state => state.kroi_order);

  if (!data || data.length === 0) {
    return <p>Нет данных для отображения</p>;
  }


  // Функция обновления true_amount
  const getValue = (value, index, sIndex) => {
    // setTableData((prevData) =>
    //   prevData.map((row) =>
    //     row.size.id === id ? { ...row, true_amount: Number(value) || '' } : row
    //   )
    // );
    dispatch(getValueAmount({ index, value, sIndex }));
  };

  // Подсчет итогов
  const calculateTotals = (data) => data?.sizes?.reduce((total, item) => total + item.plan_amount, 0);

  const totals = {};
  
  return (
    <div className="rounded-lg">
      <Table
        bordered
        cellBordered
        autoHeight
        headerHeight={70}
        data={[
          ...party_amounts
        ] || []}
        className="rounded-lg border-2 border-borderGray"
      >
        {/* Колонка "Цвет" */}
        <Column width={100} align="center" verticalAlign="center">
          <HeaderCell>Цвет</HeaderCell>
          <Cell dataKey="color.title" />
        </Column>

        {
            party_amounts?.map((item, index) => (
                party_amounts[index]?.sizes?.map((sItem, sIndex) => (
                    <ColumnGroup header={sItem.size.title} verticalAlign="center" align="center">
                        <Column width={70} colSpan={2}>
                            <HeaderCell>План</HeaderCell>
                            <Cell>
                                {
                                    (rowData) => (
                                        <p>{sItem.plan_amount}</p>
                                    )
                                }
                            </Cell>
                        </Column>
                        <Column width={70}>
                            <HeaderCell>Факт</HeaderCell>
                            <Cell style={{ padding: '7px 6px' }}>
                                {
                                    (rowData) => (
                                        <NumInputForTable
                                            value={sItem.true_amount}
                                            onChange={(e) => getValue(e, index, sIndex)}
                                            placeholder='0'
                                        />
                                    )
                                }
                            </Cell>
                        </Column>
                    </ColumnGroup>
                ))
            ))
        }

      </Table>
    </div>
  );
};

export default PartyAmountTable;
