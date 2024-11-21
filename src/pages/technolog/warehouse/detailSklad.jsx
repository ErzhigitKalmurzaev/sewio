import React from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import Input from '../../../components/ui/inputs/input'
import { useNavigate } from 'react-router-dom'

const DetailSklad = () => {

    const breadcrumbs = [
        {
            label: 'Склады',
            path: '/sklad',
            active: false
        },
        {
            label: 'Информация о складе',
            path: '/sklad/info',
            active: true
        }
    ]

    const { navigate } = useNavigate();

    return (
        <div className='flex flex-col gap-y-5 mb-5'>
            <MyBreadcrums items={breadcrumbs}/>
            
            <div className='flex items-center justify-between'>
                <Title text="Информация о складе #123"/>
                <div className='flex items-center gap-x-3'>
                    <Button variant='red'>Учет брака</Button>
                    <Button>Выдать сырье</Button>
                    <Button variant='white'>Поступление</Button>
                </div>
            </div>

            <div className='flex items-center my-2 gap-x-8'>
                <div className='flex justify-between items-center gap-x-3'>
                    <Button variant='filterActive'>Все</Button>
                    <Button variant='filter'>Активные</Button>
                    <Button variant='filter'>Деактивные</Button>
                </div>
                <div className='w-4/6'>
                    <Input searchicon={true} placeholder='Поиск по адресу' type="text"/>
                </div>
            </div>
        </div>
    )
}

export default DetailSklad
