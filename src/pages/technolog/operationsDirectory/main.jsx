import React, { useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GeneralTables from './components/shared/generalTables'
import Input from '../../../components/ui/inputs/input'

const page_types = [
  {
    type: 'folder',
    title: 'Папки',
    id: 1
  },
  {
    type: 'combination',
    title: 'Комбинации',
    id: 2
  },
  {
    type: 'operation',
    title: 'Операции',
    id: 3
  }
]

const OperationDirectory = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams();

  const urls = {
    activePage: params.get('activePage') || 'folder',
    search: params.get('search') || '',
    page: params.get('page') || 1,
    page_size: params.get('page_size') || 20
  }

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  return (
    <div className="w-full min-h-[100vh] flex flex-col gap-y-5">
      <div className="flex justify-between items-center">
        <Title text="Справочник операций" />
      </div>

      <div className='flex items-center my-2 gap-x-14'>
        <div className='flex justify-between items-center gap-x-3'>
            {
              page_types.map(page => (
                <Button
                  key={page.id}
                  onClick={() => handleChangeFilter('activePage', page.type)}
                  variant={page.type === urls.activePage ? 'filterActive' : 'filter'}
                >
                  {page.title}
                </Button>
              ))
            }
        </div>
        <div className='w-3/6'>
            <Input
                searchicon={true} 
                placeholder='Поиск по названию' 
                type="text"
                value={urls.search}
                onChange={e => handleChangeFilter('search', e.target.value)}
                // searchHandle={handleSearch}
            />
        </div>
      </div>

      <GeneralTables urls={urls}/>
    </div>
  )
}

export default OperationDirectory
