import React from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import Input from '../../../components/ui/inputs/input'
import { useNavigate } from 'react-router-dom'

const Sklad = () => {

  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <Title text="Склады"/>

        <div className='flex items-center justify-between my-2 gap-x-6'>
            <div className='flex justify-between items-center gap-x-3'>
                <Button variant='filterActive'>Все</Button>
                <Button variant='filter'>Активные</Button>
                <Button variant='filter'>Деактивные</Button>
            </div>
            <div className='w-4/6'>
                <Input searchicon={true} placeholder='Поиск по адресу' type="text"/>
            </div>
            <div className='2/6'>
                <Button onClick={() => navigate('create')}>+ Добавить склад</Button>
            </div>
        </div>

    </div>
  )
}

export default Sklad
