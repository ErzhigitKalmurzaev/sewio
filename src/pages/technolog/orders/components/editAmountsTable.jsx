import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, deleteProduct, getOrderProductList } from '../../../../store/technolog/order';
import { Panel, PanelGroup, Table } from 'rsuite';
import EditProdPanel from './editProdPanel';
import { motion, AnimatePresence } from "framer-motion";
import { ReactComponent as Pencil } from '../../../../assets/icons/pencil.svg';
import { useNavigate } from 'react-router-dom';

const { Cell, Column, HeaderCell } = Table;

const EditAmountsTable = ({ status }) => {

  const dispatch = useDispatch();    
  const navigate = useNavigate();

  const { edit_products_in_order } = useSelector(state => state.order);

  const [loading, setLoading] = useState(false);

  const addRow = () => {
    dispatch(addProduct());
  }

  return (
    <div className='flex flex-col gap-y-4 px-3 py-2'>
        <div className='flex justify-between items-center'>
            <p className='text-base font-semibold'>Товары в заказе:</p>
            {/* <Button onClick={addRow}>+Добавить</Button> */}
        </div>

        <PanelGroup accordion>
          <AnimatePresence>
            {edit_products_in_order.map((product, index) => (
                <motion.div 
                    key={product.id || index} // ✅ Используем уникальный ключ
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.3 } }} 
                >
                    <Panel 
                        key={`panel-${product.id || index}`}
                        collapsible={product?.nomenclature ? false : true}
                        style={{ border: '1px solid rgba(208, 213, 221, 1)' }}
                        header={
                            <div className="flex justify-between items-center w-full pr-2">
                                <span className='flex items-center gap-x-3'>
                                    {product.title || `Продукт №${product.id}`} 
                                    <span className='ml-3 font-semibold text-sm text-fprimary'>
                                        Арт: {product.vendor_code}
                                    </span>
                                    {
                                        status !== 2 && 
                                        <Pencil className='ml-5 mb-2' onClick={() => navigate(`/crm/product/${product.nomenclature}?order_product=true`)}/>
                                    }
                                </span>
                            </div>
                        }
                        defaultExpanded
                    >
                        <EditProdPanel product={product} id={index} /> 
                    </Panel>
                </motion.div>
            ))}
          </AnimatePresence>
        </PanelGroup>
    </div>
  )
}

export default EditAmountsTable
