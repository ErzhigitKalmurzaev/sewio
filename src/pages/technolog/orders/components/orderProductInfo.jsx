import React from 'react'

import { Table } from 'rsuite';
import { ReactComponent as Pencil } from '../../../../assets/icons/pencil.svg';
import EditProductModal from '../modals/EditProductModal';

const { Column, HeaderCell, Cell } = Table;

const OrderProductInfo = ({ products, product_list, modals, setModals, order, setOrder, size_category_list }) => {

  const [editProd, setEditProd] = React.useState({})

  const getProductValueWithKey = (key, id) => {
    //   return product_list?.find((product) => product.id === id)[key]
    const index = product_list?.findIndex((product) => product.id === id);
    return product_list[index][key]
  }

  const handleEditProduct = (product) => {
    setEditProd({})
    setModals({...modals, edit: true})
    setEditProd(product)
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
                        rowData.amounts.map((item, index) => (
                            <>
                                {size_category_list?.flatMap(category => category.sizes)?.find(size => size.id === item.size)?.title}
                                /
                                {item.amount}
                                {index !== rowData.amounts.length - 1 ? ', ' : ''}
                            </>
                        ))
                    )}
                </Cell>
        </Column>

        <Column width={100} align="center">
            <HeaderCell>Выбрать</HeaderCell>
            <Cell className='cursor-pointer'>
            {(rowData) => (
                <div onClick={() => handleEditProduct(rowData)}>
                    <Pencil/>
                </div>
            )}
            </Cell>
        </Column>
        </Table>
        <EditProductModal 
            modals={modals} 
            setModals={setModals} 
            products={product_list}
            editProd={editProd}
            setEditProd={setEditProd}
            order={order}
            setOrder={setOrder}
            size_category_list={size_category_list}
        />
    </div>
  )
}

export default OrderProductInfo
