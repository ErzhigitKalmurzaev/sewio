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

    const { invoice_data } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(getInvoiceData(id));
    }, []);

    return (
        <div className="w-full my-5" ref={ref}>
            <Table
                bordered
                cellBordered
                autoHeight
                data={invoice_data || []}
                className="rounded-lg border border-borderGray"
                
            >
                <Column width={250}>
                    <HeaderCell>Название</HeaderCell>
                    <Cell dataKey="title" />
                </Column>

                <Column width={100}>
                    <HeaderCell>Цвет</HeaderCell>
                    <Cell>
                        {(rowData) => {
                            const colorKeys = Object.keys(rowData.colors || {});
                            return colorKeys.length > 0 ? colorKeys[0] : "-";
                        }}
                    </Cell>
                </Column>

                <Column width={100}>
                    <HeaderCell>Расход</HeaderCell>
                    <Cell>
                        {(rowData) => {
                            const colorKeys = Object.keys(rowData.colors || {});
                            return colorKeys.length > 0 ? rowData.colors[colorKeys[0]] : "-";
                        }}
                    </Cell>
                </Column>

                <Column width={100}>
                    <HeaderCell>Ед. изм.</HeaderCell>
                    <Cell>
                        {(rowData) => {
                            return <p>{materialUnits.find(el => el.value === rowData.unit)?.label}</p>
                        }}
                    </Cell>
                </Column>
            </Table>
        </div>
    );
});

export default InvoicePrint;
