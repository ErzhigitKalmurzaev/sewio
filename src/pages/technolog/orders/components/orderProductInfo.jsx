import React from 'react'

import { Table } from 'rsuite';
import { ReactComponent as Pencil } from '../../../../assets/icons/pencil.svg';

const { Column, HeaderCell, Cell } = Table;

const OrderProductInfo = ({ products, product_list, modals, setModals }) => {

  const getProductValueWithKey = (key, id) => {
    //   return product_list?.find((product) => product.id === id)[key]
    const index = product_list?.findIndex((product) => product.id === id);
    return product_list[index][key]
  }

  return (
    <div>
        <Table
        height={300}
        data={products}
        rowHeight={50}
        >
        <Column width={100} align="center" fixed>
            <HeaderCell>Артикул</HeaderCell>
            <Cell>
            {(rowData) => (
                <p>
                {getProductValueWithKey('vendor_code', rowData.nomenclature)}
                </p>
            )}
            </Cell>
        </Column>

        <Column width={200} fixed>
            <HeaderCell>Название</HeaderCell>
            <Cell>
            {(rowData) => (
                <p>
                {getProductValueWithKey('title', rowData.nomenclature)}
                </p>
            )}
            </Cell>
        </Column>

        <Column width={100} fixed>
            <HeaderCell>Статус</HeaderCell>
            <Cell>
            {(rowData) => (
                <p>
                {getProductValueWithKey('is_active', rowData.nomenclature) ? 'Активен' : 'Не активен'}
                </p>
            )}
            </Cell>
        </Column>

        <Column width={150} align="center">
            <HeaderCell>Себестоимость</HeaderCell>
            <Cell>
            {(rowData) => (
                <p>
                {getProductValueWithKey('cost_price', rowData.nomenclature)}
                </p>
            )}
            </Cell>
        </Column>

        <Column width={150} align="center">
            <HeaderCell>Цена в заказе</HeaderCell>
            <Cell dataKey="price" />
        </Column>

        <Column width={200} align="center">
            <HeaderCell>Размер/Количество</HeaderCell>
                <Cell>
                    {(rowData) => (
                        rowData.amounts.map(item => (
                            <>{item.size}/{item.amount}, </>
                        ))
                    )}
                </Cell>
        </Column>

        <Column width={100} align="center">
            <HeaderCell>Выбрать</HeaderCell>
            <Cell onClick={() => setModals({ ...modals, edit: true })}>
            {(rowData) => (
                <Pencil/>
            )}
            </Cell>
        </Column>
        </Table>
        
    </div>
  )
}

export default OrderProductInfo
