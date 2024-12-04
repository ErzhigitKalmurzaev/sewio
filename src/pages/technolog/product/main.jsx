import React, { useEffect } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import Input from '../../../components/ui/inputs/input'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProductList } from '../../../store/technolog/product'
import ProductTable from '../../../components/tables/productTables/productTable'

const Products = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products_list, products_list_status } = useSelector(state => state.product);
  const [params, setParams] = useSearchParams();

  const urls = {
    is_active: params?.get("is_active") || "",
    page: params?.get("page") || 1,
    page_size: params.get("page_size") || 20,
    title: params.get("title") || ""
  };

  useEffect(() => {
    dispatch(getProductList({ urls }));
  }, [urls.is_active, urls.page, urls.page_size]);

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  const handleSearch = () => {
    dispatch(getProductList({ urls }))
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <div className='flex justify-between items-center'>
            <Title text="Товары"/>
            <Button onClick={() => navigate('create')}>+ Добавить товар</Button>
        </div>

        <div className='flex items-center my-2 gap-x-6'>
            <div className='flex justify-between items-center gap-x-3'>
                <Button variant={urls.is_active === "" ? "filterActive" : "filter"} onClick={() => handleChangeFilter("is_active", "")}>Все</Button>
                <Button variant={urls.is_active === 'true' ? "filterActive" : "filter"} onClick={() => handleChangeFilter("is_active", true)}>Активные</Button>
                <Button variant={urls.is_active === 'false' ? "filterActive" : "filter"} onClick={() => handleChangeFilter("is_active", false)}>Деактивные</Button>
            </div>
            <div className='w-3/6 mt-1'>
                <Input 
                  searchicon={true} 
                  placeholder='Поиск по названию и артикулу' 
                  type="text"
                  onChange={(e) => handleChangeFilter("title", e.target.value)}
                  searchHandle={handleSearch}
                  value={urls.title}
                />
            </div>

        </div>
        <div className='w-full h-full'>
            <ProductTable 
              data={products_list.results} 
              status={products_list_status}
              total={products_list?.count || 0}
              limit={urls.page_size}
              activePage={Number(urls.page || 1)}
              setPage={handleChangeFilter}
            />
        </div>

    </div>
  )
}

export default Products
