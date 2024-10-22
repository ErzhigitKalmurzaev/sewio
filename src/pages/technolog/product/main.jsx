import React from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import Input from '../../../components/ui/inputs/input'
import { useNavigate } from 'react-router-dom'

const Products = () => {

  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <div className='flex justify-between items-center'>
            <Title text="Товары"/>
            <Button onClick={() => navigate('create')}>+ Добавить товар</Button>
        </div>

        <div className='flex items-center my-2 gap-x-6'>
            <div className='flex justify-between items-center gap-x-3'>
                <Button variant='filterActive'>Все</Button>
                <Button variant='filter'>Активные</Button>
                <Button variant='filter'>Деактивные</Button>
            </div>
            <div className='w-3/6 mt-1'>
                <Input searchicon={true} placeholder='Поиск по товарам' type="text"/>
            </div>
        </div>

    </div>
  )
}

export default Products
