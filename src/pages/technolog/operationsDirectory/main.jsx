import React, { useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GeneralTables from './components/shared/generalTables'
import Input from '../../../components/ui/inputs/input'
import { getCombinationList, getFolderList, getOperationList } from '../../../store/technolog/operations'
import CreateFolder from './components/modals/createFolder'
import CreateCombination from './components/modals/createCombination'
import CreateOperation from './components/modals/createOperation'

const page_types = [
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
  const [modals, setModals] = useState({ folder: false, combination: false, operation: false });

  const urls = {
    activePage: params.get('activePage') || 'combination',
    search: params.get('search') || '',
    page: params.get('page') || 1,
    page_size: params.get('page_size') || 20,
    stage: params.get('stage') || 1,
    folder: params.get('folder') || ''
  }

  const handleChangeFilter = (name, value) => {
    if(name === 'activePage') {
      params.set(name, value);
      params.set('search', '');
      params.set('stage', 1)
      setParams(params);
    } else {
      params.set(name, value);
      setParams(params);
    }
  }

  const handleSearch = () => {
    switch(urls.activePage) {
      case 'folder':
          return dispatch(getFolderList({ search: urls.search }));
      case 'combination': 
          return dispatch(getCombinationList({ search: urls.search }));
      case 'operation': 
          return dispatch(getOperationList({ search: urls.search }))
      default: 
        return dispatch(getFolderList({ search: urls.search })); 
    }
  }


  return (
    <div className="w-full min-h-[100vh] flex flex-col gap-y-5">
      <div className="flex justify-between items-center">
        <Title text="Справочник операций" />
      </div>

      <div className='flex justify-between items-center my-2 gap-x-14'>
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
                searchHandle={handleSearch}
            />
        </div>
        <div>
          {
            urls.activePage === 'folder' && 
            <Button onClick={() => setModals({ ...modals, folder: true })}>+ Добавить папку</Button>
          }
          {
            urls.activePage === 'combination' && 
            <Button onClick={() => setModals({ ...modals, combination: true })}>+ Добавить комбинацию</Button>
          }
          {
            urls.activePage === 'operation' && 
            <Button onClick={() => setModals({ ...modals, operation: true })}>+ Добавить операцию</Button>
          }
        </div>
      </div>

      <GeneralTables urls={urls} params={params} setParams={setParams}/>

      {/* MODALS */}

      <CreateFolder modals={modals} setModals={setModals}/>
      <CreateCombination modals={modals} setModals={setModals}/>
      <CreateOperation modals={modals} setModals={setModals}/>
    </div>
  )
}

export default OperationDirectory
