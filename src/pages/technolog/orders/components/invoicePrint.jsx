import React, { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceData } from "../../../../store/technolog/order";
import { useParams } from "react-router-dom";
import { materialUnits } from "../../../../utils/selectDatas/productDatas";
import { Table } from "rsuite";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";

const InvoicePrint = forwardRef(({}, ref) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { invoice_data } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getInvoiceData(id));
  }, [dispatch, id]);

  // 1. Собираем все уникальные цвета из всех materials
  const uniqueColors = Array.from(
    new Set(
      (invoice_data || []).flatMap((item) => Object.keys(item.colors || {}))
    )
  );

  return (
    <div className="w-full my-5" ref={ref}>
      <Table
        bordered
        cellBordered
        autoHeight
        data={invoice_data || []}
        className="rounded-lg border border-borderGray"
      >
        <Column width={180} align="left" fixed>
          <HeaderCell>Название</HeaderCell>
          <Cell dataKey="title" />
        </Column>

        {/* Динамические колонки по цветам */}
        {uniqueColors.map((color, idx) => (
          <Column key={idx} flex={1} align="center">
            <HeaderCell>{color}</HeaderCell>
            <Cell>
              {(rowData) => rowData.colors?.[color] ?? ""}
            </Cell>
          </Column>
        ))}

        <Column flex={1} align="center" fixed>
          <HeaderCell>Ед. изм.</HeaderCell>
          <Cell>
            {(rowData) =>
              materialUnits.find((el) => el.value === rowData.unit)?.label || "-"
            }
          </Cell>
        </Column>
      </Table>
    </div>
  );
});

export default InvoicePrint;
