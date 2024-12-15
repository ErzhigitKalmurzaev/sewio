import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EditMainInfo from './components/editMainInfo';
import BackDrop from '../../../components/ui/backdrop';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../../store/technolog/product';
import EditOperations from './components/operations';
import Combinations from './components/combinations';
import ProductImages from './components/shared/productImages';

const FillProduct = () => {

  const dispatch = useDispatch();
  const { id } = useParams();
  const { product, product_status, update_product } = useSelector(state => state.product);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!product) {
      setLoading(true)
    }
    dispatch(getProductById({ id }))
      .then(res => {
        setLoading(false)
    })
  }, [id, dispatch, update_product]);

  return (
    <div>
        {
            loading && <BackDrop open={loading}/>
        }
        <div className='flex flex-col gap-y-6'>

            <EditMainInfo product={product} setLoading={setLoading}/>
            <ProductImages id_product={id}/>
            <Combinations combinations={product.combinations} operations={product.operations} id_product={id}/>
            <EditOperations operations={product.operations} id_product={id} />
        </div>
    </div>
  )
}

export default FillProduct
