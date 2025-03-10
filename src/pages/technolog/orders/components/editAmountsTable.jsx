import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, deleteProduct, getOrderProductList } from '../../../../store/technolog/order';
import NumInputForTable from '../../../../components/ui/inputs/numInputForTable';
import { CircleMinus, Plus, Trash } from 'lucide-react';
import { Panel, PanelGroup, Table } from 'rsuite';
import InputWithSuggestions from '../../../../components/ui/inputs/inputWithSuggestions';
import ProdPanel from './prodPanel';
import Button from '../../../../components/ui/button';
import EditProdPanel from './editProdPanel';

const { Cell, Column, HeaderCell } = Table;

const EditAmountsTable = () => {

  const dispatch = useDispatch();    

  const { edit_products_in_order, product_list } = useSelector(state => state.order);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getOrderProductList());
  }, [])

  const addRow = () => {
    dispatch(addProduct());
  }

  return (
    <div className='flex flex-col gap-y-4 px-3 py-2'>
        <div className='flex justify-between items-center'>
            <p className='text-base font-semibold'>Товары в заказе:</p>
            {/* <Button onClick={addRow}>+Добавить</Button> */}
        </div>

        <PanelGroup accordion bordered>
            {
                edit_products_in_order.map((product, index) => (
                    <Panel header={
                        <div className="flex justify-between items-center w-full pr-2">
                          <span className='flex items-center gap-x-3'>
                            {product.title || `Продукт №${index + 1}`} 
                            <span className='ml-3 font-semibold text-sm text-fprimary'>Арт: {product.vendor_code}</span>
                          </span>
                        </div>
                      }  key={index} defaultExpanded>
                        <EditProdPanel product={product} id={index}/>
                    </Panel>
                ))
            }
        </PanelGroup>
    </div>
  )
}

export default EditAmountsTable
