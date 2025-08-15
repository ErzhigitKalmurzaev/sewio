import React, { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceData } from "../../../../store/technolog/order";
import { useParams } from "react-router-dom";
import { materialUnits } from "../../../../utils/selectDatas/productDatas";
import { Table } from "rsuite";
import Column from "rsuite/esm/Table/TableColumn";

const { Cell, HeaderCell, ColumnGroup } = Table;

const InvoicePrint = forwardRef(({ images }, ref) => {
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
    <div className="w-full my-5 flex flex-col gap-y-5" ref={ref}>
      {/* ✅ Блок картинок */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {images.map((img, i) => (
            <div key={i} className="w-auto">
              <img
                src={img.image}
                alt={`Изображение товара ${i + 1}`}
                className="w-full h-[130px] object-contain"
              />
            </div>
          ))}
        </div>
      )}
      <Table
        bordered
        cellBordered={true}
        headerHeight={70}
        row
        data={invoice_data || []}
        className="rounded-lg border border-borderGray"
      >
        <Column width={180} align="left" verticalAlign="middle" fixed>
          <HeaderCell>Название</HeaderCell>
          <Cell dataKey="title" />
        </Column>

        {/* Динамические колонки по цветам с подколонками */}
        {uniqueColors.map((color, idx) => (
          <ColumnGroup key={idx} header={color} align="center">
            <Column width={60} align="center">
              <HeaderCell className="text-3xs">Треб.</HeaderCell>
              <Cell>
                {(rowData) => {
                  const colorData = rowData.colors?.[color];
                  return colorData?.need !== undefined ? Number(colorData.need) : 0;
                }}
              </Cell>
            </Column>
            <Column width={60} align="center">
              <HeaderCell className="text-3xs">На складе</HeaderCell>
              <Cell>
                {(rowData) => {
                  const colorData = rowData.colors?.[color];
                  return colorData?.stock !== undefined ? Number(colorData.stock) : 0;
                }}
              </Cell>
            </Column>
            <Column width={60} align="center">
              <HeaderCell className="text-3xs">Нехватка</HeaderCell>
              <Cell>
                {(rowData) => {
                  const colorData = rowData.colors?.[color];
                  return colorData?.shortage !== undefined ? Number(colorData.shortage) : 0;
                }}
              </Cell>
            </Column>
          </ColumnGroup>
        ))}

        <Column flex={1} align="center" verticalAlign="middle">
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