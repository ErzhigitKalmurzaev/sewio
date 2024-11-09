import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditMainInfo from './components/editMainInfo';
import BackDrop from '../../../components/ui/backdrop';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../store/technolog/product';
import EditOperations from './components/editOperations';

const FillProduct = () => {

  const dispatch = useDispatch();
  const { id } = useParams();
  const { product, product_status } = useSelector(state => state.product);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getProductById({ id }));
  }, []);

  return (
    <div>
        {
            product_status === 'loading' && <BackDrop open={loading}/>
        }
        {
            product_status === 'success' && 
            <div className='flex flex-col gap-y-6'>
                <EditMainInfo product={product} setLoading={setLoading}/>
                <EditOperations operations={product.operations} />
            </div>
        }
    </div>
  )
}

export default FillProduct
