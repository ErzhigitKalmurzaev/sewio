import React, { useEffect, useState } from 'react'
import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../../components/ui/inputs/input'
import { useDispatch, useSelector } from 'react-redux'
import { getClientList } from '../../../store/technolog/client'
import ClentsTable from '../../../components/tables/clientTables/clientTables'

const Clients = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { client_list, client_list_status } = useSelector(state => state.client);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  useEffect(() => {
    dispatch(getClientList({ search }));
  }, [])

  const handleSearchChange = (newSearch) => {
    setSearchParams({ search: newSearch });
  };

  const searchHandle = () => {
    dispatch(getClientList({ search }));
  }

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        <div className='flex justify-between items-center'>
            <Title text="Клиенты" />
            <div className='flex gap-x-5'>
                <Button onClick={() => navigate('create')}>+ Добавить клиента</Button>
            </div>
        </div>

        <div className='flex items-center my-2 gap-x-14'>
            <div className='w-3/6'>
                <Input 
                    searchicon={true} 
                    placeholder='Поиск по имени клиента и компании' 
                    type="text"
                    value={search}
                    onChange={e => handleSearchChange(e.target.value)}
                    searchHandle={searchHandle}
                />
            </div>
        </div>

        <div className='mt-2'>
            <ClentsTable data={client_list} status={client_list_status}/>
        </div>
    </div>
  )
}

export default Clients
