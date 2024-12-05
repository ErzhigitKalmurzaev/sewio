import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import DateRangePickerInput from '../../../components/ui/inputs/dateRangePicker';
import InfoCard from '../../../components/shared/infoCard';
import { useDispatch } from 'react-redux';
import { getStatistic } from '../../../store/technolog/statistic';

const Statistic = () => {

  const statistics = [
    {
      plan: true,
      title: 'Доход',
      planSum: 320000,
      factSum: 200000,
      start_date: '11.11.2024', 
      end_date: '12.11.2024',
      month: '12.11.2024' 
    },
    {
      plan: false,
      title: 'Расход',
      planSum: 0,
      factSum: 200000,
      start_date: '11.11.2024', 
      end_date: '12.11.2024',
      month: '12.11.2024' 
    },
    {
      plan: false,
      title: 'Прибыль',
      planSum: 320000,
      factSum: 200000,
      start_date: '11.11.2024', 
      end_date: '12.11.2024',
      month: '12.11.2024' 
    },
    {
      plan: true,
      title: 'Заказы',
      planSum: 2000,
      factSum: 1950,
      start_date: '11.11.2024', 
      end_date: '12.11.2024',
      month: '12.11.2024' 
    }
  ]

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStatistic())
  }, [])

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-12'>
        <div className='flex justify-between items-center'>
            <Title text="Общая статистика" />
            <div className='flex gap-x-5'>
                <DateRangePickerInput/>
                <Button>+ Создать план</Button>
            </div>
        </div>
        <div className='flex flex-col gap-y-4'>
          <div>
              <Button variant='filterActive'>По заказам</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              {
                statistics?.map(item => (
                  <InfoCard data={item}/>
                ))
              }
          </div>
        </div>
    </div>
  )
}

export default Statistic
