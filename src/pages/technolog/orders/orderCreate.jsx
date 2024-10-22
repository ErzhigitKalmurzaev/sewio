import React from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import Input from '../../../components/ui/inputs/input'
import OrderInfoItem from '../../../components/shared/order/orderInfoItem'
import Button from '../../../components/ui/button'

const OrderCreate = () => {

  const breadcrumbs = [
    {
        label: 'Заказы',
        path: '/orders',
        active: false
    },
    {
        label: 'Создание заказа',
        path: '/orders/create',
        active: true
    }
  ]

  const info = [
    {
        label: 'Общее кол-во:',
        value: 120,
        measure: 'шт.'
    },
    {
        label: 'Общий доход:',
        value: 12000,
        measure: 'сом'
    },
    {
        label: 'Общие расходы:',
        value: 12000,
        measure: 'сом'
    },
    {
        label: 'Общая прибыль:',
        value: 12000,
        measure: 'сом'
    },
    {
        label: 'Время выполнения:',
        value: 120,
        measure: 'ч'
    },
    {
        label: 'Статус заказа:',
        value: '120',
        measure: 'шт.'
    }
  ]

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        <Title text="Создание заказа"/>

        <div className='w-full flex gap-x-7'>
            <div className='w-1/2 flex flex-col gap-y-2 bg-white rounded-lg px-8 py-5'>
                <p className='text-base font-bold font-inter mb-3'>Основная информация</p>
                <Input width='100%' type='text' label='Ф.И.О' placeholder='Введите Ф.И.О' />
                <Input width='70%' type='text' label='Почта' placeholder='Введите почта' />
                <Input width='70%' type='text' label='Телефон' placeholder='Введите телефон' />
                <Input width='70%' type='text' label='Срок сдачи' placeholder='Введите срок сдачи' />
            </div>

            <div className='w-1/2 flex flex-col gap-y-4'>
                <div className='flex flex-col gap-y-5 bg-white rounded-lg px-8 py-8'>
                    <p className='text-base font-bold font-inter text-center'>Информация о заказе:</p>

                    <div className='flex flex-col justify-center gap-y-8'>
                        <div className='flex justify-between gap-x-5'>
                            <OrderInfoItem label='Общее кол-во:' value={120} measure='шт.' />
                            <OrderInfoItem label='Общий доход:' value={12000} measure='сом' />
                            <OrderInfoItem label='Общие расходы:' value={12000} measure='сом' />
                        </div>
                        <div className='flex justify-between gap-x-5'>
                            <OrderInfoItem label='Общая прибыль:' value={12000} measure='сом' />
                            <OrderInfoItem label='Время выполнения:' value={120} measure='ч' />
                            <OrderInfoItem label='Статус заказа:' value='Новый' measure='' />
                        </div>
                        <div className='flex justify-center'>
                            <Button width='250px'>+ Добавить товар</Button>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-y-5 bg-white rounded-lg px-8 py-8'>

                </div>
            </div>
        </div>

    </div>
  )
}

export default OrderCreate
