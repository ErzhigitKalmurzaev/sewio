import React, { forwardRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceData } from "../../../../store/technolog/order";
import { useParams } from "react-router-dom";
import { materialUnits } from "../../../../utils/selectDatas/productDatas";
import { Table, Divider } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const { Cell, HeaderCell, Column } = Table;

const InvoicePrint = forwardRef(({ images, productInfo }, ref) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { invoice_data: rawData } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getInvoiceData(id));
  }, [dispatch, id]);

  // Transform data like in MainTable - each color becomes a separate row
  const transformedData = [];
  (rawData || []).forEach((material, materialIndex) => {
    material?.colors.forEach((color, colorIndex) => {
      transformedData.push({
        // Material data
        materialId: materialIndex + 1,
        materialTitle: material.title,
        materialUnit: material.unit,
        materialRowSpan: colorIndex === 0 ? material?.colors?.length : 0,
        
        // Color data
        color: color?.color || "Без цвета",
        need: color?.need,
        stock: color?.stock,
        shortage: color?.shortage,
        
        // Helper flags
        isFirstInGroup: colorIndex === 0
      });
    });
  });

  return (
    <div
      className="w-full min-h-screen bg-white font-sans text-black p-6"
      ref={ref}
    >
      <h1 className="text-lg text-center font-bold uppercase tracking-wide mb-2">
        Накладная на материалы для заказа №{id}
      </h1>

      {/* Images */}
      {images?.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap">
            {images?.map((img, i) => (
              <div key={i} className="rounded border border-borderGray p-2">
                <img
                  src={img.image}
                  alt={`Изображение ${i + 1}`}
                  className="w-full h-24 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials Table */}
      <div className="mb-6">
        
        <div className="overflow-x-auto border border-borderGray">
          <Table
            data={transformedData || []}
            height={600}
            bordered
            cellBordered
            className="rounded-none"
          >

            <Column width={220} verticalAlign="middle" rowSpan={rowData => rowData.materialRowSpan}>
              <HeaderCell className="bg-gray-200 font-bold text-sm border-black">
                Наименование материала
              </HeaderCell>
              <Cell dataKey="materialTitle" />
            </Column>

            <Column width={90} align="center" verticalAlign="middle" rowSpan={rowData => rowData.materialRowSpan}>
              <HeaderCell className="bg-gray-200 font-bold text-sm border-black">
                Ед. изм.
              </HeaderCell>
              <Cell>
                {(rowData) => 
                  materialUnits.find(unit => unit.value === rowData.materialUnit)?.label || "—"
                }
              </Cell>
            </Column>

            <Column width={90} align="center" verticalAlign="middle">
              <HeaderCell className="bg-gray-200 font-bold text-sm border-black">
                Цвет
              </HeaderCell>
              <Cell>
                {(rowData) => rowData.color}
              </Cell>
            </Column>

            <Column width={90} align="center" verticalAlign="middle">
              <HeaderCell className="bg-gray-200 font-bold text-sm border-black">
                Требуется
              </HeaderCell>
              <Cell>
                {(rowData) => rowData.need.toFixed(1)}
              </Cell>
            </Column>

            <Column width={90} align="center" verticalAlign="middle">
              <HeaderCell className="bg-gray-200 font-bold text-sm border-black">
                На складе
              </HeaderCell>
              <Cell>
                {(rowData) => rowData.stock.toFixed(1)}
              </Cell>
            </Column>

            <Column width={90} align="center" verticalAlign="middle">
              <HeaderCell className="bg-gray-200 font-bold text-sm border-black">
                Нехватка
              </HeaderCell>
              <Cell>
                {(rowData) => rowData.shortage.toFixed(1)}
              </Cell>
            </Column>
          </Table>
        </div>
      </div>
    </div>
  );
});

export default InvoicePrint;