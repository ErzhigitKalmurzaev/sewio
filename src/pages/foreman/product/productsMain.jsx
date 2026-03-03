import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Input from '../../../components/ui/inputs/input'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../../../store/foreman/order'
import BackDrop from '../../../components/ui/backdrop'
import { Package, Search } from 'lucide-react'

const ProductsMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { products_list, products_list_status } = useSelector(state => state.foreman_order);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products_list && Array.isArray(products_list)) {
      // Фильтрация продуктов по поисковому запросу
      if (searchQuery.trim() === '') {
        setFilteredProducts(products_list);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = products_list.filter(product => {
          const title = product[1]?.toLowerCase() || '';
          const id = String(product[0]) || '';
          return title.includes(query) || id.includes(query);
        });
        setFilteredProducts(filtered);
      }
    }
  }, [products_list, searchQuery]);

  const handleProductClick = (productId, product) => {
    localStorage.setItem('order', JSON.stringify(product));
    navigate(`${productId}`);
  };

  const handleSearch = () => {
    // Поиск уже работает через useEffect
  };

  if (products_list_status === 'loading') {
    return <BackDrop open={true} />;
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <div className='flex justify-between items-center'>
        <Title text="Товары"/>
      </div>

      <div className='flex items-center my-2 gap-x-6'>
        <div className='w-full max-w-2xl'>
          <Input 
            searchicon={true} 
            placeholder='Поиск по названию или ID' 
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            searchHandle={handleSearch}
            value={searchQuery}
          />
        </div>
        <div className='flex items-center gap-x-2 text-gray-600'>
          <span className='text-sm font-medium'>Всего:</span>
          <span className='text-lg font-semibold text-blue-600'>
            {filteredProducts.length}
          </span>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className='w-full h-96 flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200'>
          <Search size={48} className='text-gray-400 mb-4' />
          <p className='text-gray-500 text-lg'>
            {searchQuery ? 'Товары не найдены' : 'Нет доступных товаров'}
          </p>
          {searchQuery && (
            <p className='text-gray-400 text-sm mt-2'>
              Попробуйте изменить запрос
            </p>
          )}
        </div>
      ) : (
        <div className='w-full bg-white rounded-lg p-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {filteredProducts.map((product, index) => {
              const productId = product[0];
              const productTitle = product[1];
              
              return (
                <div
                  key={`${productId}_${index}`}
                  onClick={() => handleProductClick(productId, product)}
                  className='bg-white border border-slate-400 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-400 hover:scale-105 active:scale-100'
                >
                  <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center'>
                      <Package size={24} className='text-blue-600' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-xs text-gray-500 mb-1'>ID: {productId}</p>
                      <h3 className='text-sm font-semibold text-gray-900 line-clamp-2 leading-tight'>
                        {productTitle}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsMain;