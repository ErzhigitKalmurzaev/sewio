import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, deleteProduct, getOrderProductList } from '../../../../store/technolog/order';
import { Panel, PanelGroup, Table } from 'rsuite';
import EditProdPanel from './editProdPanel';
import { motion, AnimatePresence } from "framer-motion";

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
          <AnimatePresence>
            {edit_products_in_order.map((product, index) => (
                <motion.div 
                    key={product.id} // Уникальный ключ
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }} 
                >
                    <Panel header={
                        <div className="flex justify-between items-center w-full pr-2">
                          <span className='flex items-center gap-x-3'>
                            {product.title || `Продукт №${product.id}`} 
                            <span className='ml-3 font-semibold text-sm text-fprimary'>Арт: {product.vendor_code}</span>
                          </span>
                        </div>
                      } key={product.id} defaultExpanded> {/* Измени key на product.id */}
                        <EditProdPanel product={product} id={index}/> {/* Тоже передай id */}
                    </Panel>
                </motion.div>
            ))}
          </AnimatePresence>
        </PanelGroup>
    </div>
  )
}

export default EditAmountsTable
