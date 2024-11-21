import React, { useEffect } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import Input from '../../../components/ui/inputs/input'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getWarehouseList } from '../../../store/technolog/warehouse'
import WarehouseTable from '../../../components/tables/warehouse/warehouseTable'

const Sklad = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { warehouse_list, warehouse_list_status } = useSelector(state => state.warehouse)

  useEffect(() => {
    dispatch(getWarehouseList())
  }, [])

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <Title text="Склады"/>

        <div className='flex items-center justify-between my-2 gap-x-6'>
            <div className='w-3/6'>
                <Input searchicon={true} placeholder='Поиск по адресу' type="text"/>
            </div>
            <div className='2/6'>
                <Button onClick={() => navigate('create')}>+ Добавить склад</Button>
            </div>
        </div>

        <div className='mt-2'>
            <WarehouseTable data={warehouse_list} status={warehouse_list_status} />
        </div>

    </div>
  )
}

export default Sklad
