import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, deleteProduct, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { CircleMinus, Plus, Trash } from 'lucide-react';
import { Panel, PanelGroup, Table } from 'rsuite';
import InputWithSuggestions from '../../../../components/ui/inputs/inputWithSuggestions';
import ProdPanel from './prodPanel';
import Button from '../../../../components/ui/button';

const { Cell, Column, HeaderCell } = Table;

const AmountsTable = () => {

  const dispatch = useDispatch();    

  const { products_to_order, product_list } = useSelector(state => state.order);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getOrderProductList());
  }, [])

  const addRow = () => {
    dispatch(addProduct());
  }

  const deleteRow = (index) => {
    dispatch(deleteProduct({ index }));
  }


  return (
    <div className='flex flex-col gap-y-4'>
        <div className='flex justify-between items-center'>
            <p className='text-base font-semibold'>Товары в заказе:</p>
            <Button onClick={addRow}>+Добавить</Button>
        </div>

        <PanelGroup accordion bordered>
            {
                products_to_order.map((product, index) => (
                    <Panel header={
                        <div className="flex justify-between items-center w-full pr-2">
                          <span>{product.title || `Продукт №${index + 1}`}</span>
                          <Button variant='red' onClick={() => deleteRow(index)}>Удалить</Button>
                        </div>
                      }  key={index} defaultExpanded>
                        <ProdPanel product={product} id={index}/>
                    </Panel>
                ))
            }
        </PanelGroup>
    </div>
  )
}

export default AmountsTable
