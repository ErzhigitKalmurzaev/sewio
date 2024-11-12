import React from 'react';
import { Table, Radio } from 'rsuite';

const { Column, HeaderCell, Cell } = Table;

const SelectProductTable = ({ products, selectedProduct, onSelectProduct }) => {
  return (
    <Table
      height={300}
      data={products}
      onRowClick={(data) => onSelectProduct(data)}
      rowHeight={50}
    >
      <Column width={100} align="center" fixed>
        <HeaderCell>Артикул</HeaderCell>
        <Cell dataKey="vendor_code" />
      </Column>

      <Column width={200} fixed>
        <HeaderCell>Название</HeaderCell>
        <Cell dataKey="title" />
      </Column>

      <Column width={200} fixed>
        <HeaderCell>Название</HeaderCell>
        <Cell dataKey="is_active">
          {(rowData) => (rowData.is_active ? 'Активен' : 'Не активен')}
        </Cell>
      </Column>

      <Column width={150} align="center">
        <HeaderCell>Себестоимость</HeaderCell>
        <Cell dataKey="cost_price">
          {(rowData) => `${rowData.cost_price} сом`}
        </Cell>
      </Column>

      <Column width={100} align="center">
        <HeaderCell>Выбрать</HeaderCell>
        <Cell>
          {(rowData) => (
            <Radio
              checked={selectedProduct?.id === rowData.id}
              onChange={() => onSelectProduct(rowData)}
            />
          )}
        </Cell>
      </Column>
    </Table>
  );
};

export default SelectProductTable;
