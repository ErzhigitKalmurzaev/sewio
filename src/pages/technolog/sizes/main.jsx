import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import SizeTable from '../../../components/tables/sizes/sizeTable';
import { useDispatch, useSelector } from 'react-redux';
import { getSizesList } from '../../../store/technolog/size';
import CreateSize from './modals/createSize';
import EditSize from './modals/editSize';
import { useSearchParams } from 'react-router-dom';
import ColorTable from '../../../components/tables/sizes/colorTable';
import { getColors } from './../../../store/technolog/material';
import CreateColor from './modals/createColor';
import EditColor from './modals/editColor';

const Sizes = () => {

  const dispatch = useDispatch();
  const [params, setParams] = useSearchParams();

  const { sizes_list, sizes_list_status, colors_list, colors_list_status } = useSelector(state => state.size);

  const urls = {
    page: params.get("page") || 'size',
  };
  
  const [sizeModals, setSizeModals] = useState({ create: false, edit: false, id: null });
  const [colorModals, setColorModals] = useState({ create: false, edit: false, id: null });

  useEffect(() => {
    dispatch(getSizesList());
    dispatch(getColors());
  }, [])

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
      <div className='flex items-center justify-between'>
          <Title text="Атрибуты" />
          <div className='flex'>
              {
                urls.page === 'size' ?
                  <Button onClick={() => setSizeModals({...sizeModals, create: true})}>+ Создать размер</Button>
                  :
                  <Button onClick={() => setColorModals({...colorModals, create: true})}>+ Создать цвет</Button>
              }
          </div>
      </div>   
      <div className='flex gap-x-3 my-3'>
          <Button
            variant={urls.page === 'size' ? 'filterActive' : 'filter'}
            onClick={() => handleChangeFilter('page', 'size')}
          >
            Размеры
          </Button>
          <Button 
            variant={urls.page === 'color' ? 'filterActive' : 'filter'}
            onClick={() => handleChangeFilter('page', 'color')}
          >
            Цвета
          </Button>
      </div>

      
      {
        urls.page === 'size' ?
          <SizeTable 
            data={sizes_list}
            modals={sizeModals}
            setModals={setSizeModals}
            status={sizes_list_status}
          /> :
          <ColorTable
            data={colors_list}
            status={colors_list_status}
            modals={colorModals}
            setModals={setColorModals}
          />
      }

      {/* Modals */}
      <CreateSize modals={sizeModals} setModals={setSizeModals} />
      <EditSize modals={sizeModals} setModals={setSizeModals} />
      <CreateColor modals={colorModals} setModals={setColorModals} />
      <EditColor modals={colorModals} setModals={setColorModals} />
    </div>
  )
}

export default Sizes
