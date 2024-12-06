import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import DateRangePickerInput from '../../../components/ui/inputs/dateRangePicker';
import InfoCard from '../../../components/shared/infoCard';
import { useDispatch, useSelector } from 'react-redux';
import { getStatistic } from '../../../store/technolog/statistic';
import { useSearchParams } from 'react-router-dom';
import { getDefaultDateRange } from '../../../utils/functions/dateFuncs';
import { ChartColumn, CircleCheckBig, CircleDollarSign, Package, Star, Wrench } from 'lucide-react';

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

  const { statistic_list, statistic_list_status } = useSelector(state => state.statistic);
  const [params, setParams] = useSearchParams();

  const urls = {
    from_date: params.get("from_date") || getDefaultDateRange().from_date,
    to_date: params.get("to_date") || getDefaultDateRange().to_date,
  }

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

        {/* По заказам */}
        <div className='flex flex-col gap-y-4'>
          <div>
              <Button variant='filterActive'>По заказам</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              <InfoCard
                title='Доход'
                plan={statistic_list?.order?.plan?.income || 0}
                plan_status={true}
                value={statistic_list?.order?.fact?.income || 0}
                date={urls}
              />
              <InfoCard
                title='Расход'
                plan_status={false}
                value={statistic_list?.order?.fact?.consumption || 0}
                date={urls}
                icon={<CircleDollarSign color='red' size={20}/>}
              />
              <InfoCard
                title='Прибыль'
                plan_status={false}
                value={statistic_list?.order?.fact?.profit || 0}
                date={urls}
                icon={<CircleDollarSign color='green' size={20}/>}
              />
              <InfoCard
                title='Заказы'
                plan={statistic_list?.order?.plan?.orders || 0}
                plan_status={true}
                value={statistic_list?.order?.fact?.orders || 0}
                date={urls}
              />
          </div>
        </div>

        {/* По сотрудникам */}
        <div className='flex flex-col gap-y-4'>
          <div>
              <Button variant='filterActive'>По сотрудникам</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              <InfoCard
                title='Ср. производительность'
                plan_status={false}
                value={statistic_list?.staff?.avg_performance || 0}
                date={urls}
                icon={<ChartColumn color='blue' size={20} />}
              />
              <InfoCard
                title='Сделано'
                plan_status={false}
                value={statistic_list?.staff?.done || 0}
                date={urls}
                icon={<CircleCheckBig color='green' size={20}/>}
              />
              <InfoCard
                title='Штрафы'
                plan_status={false}
                value={statistic_list?.staff?.fine || 0}
                date={urls}
                icon={<CircleDollarSign color='red' size={20}/>}
              />
              <InfoCard
                title='Работа машин'
                plan_status={false}
                value={statistic_list?.staff?.machine || 0}
                date={urls}
                icon={<Wrench color='gray' size={20} />}
              />
          </div>
        </div>

        {/* По продуктам */}
        <div className='flex flex-col gap-y-4'>
          <div>
              <Button variant='filterActive'>По продуктам</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              <InfoCard
                title='Произведено'
                plan_status={false}
                value={statistic_list?.product?.produced || 0}
                date={urls}
                icon={<Package color='gray' size={20} />}
              />
              <InfoCard
                title='Популярный'
                plan_status={false}
                value={statistic_list?.product?.popular || 0}
                date={urls}
                icon={<Star color='gold' fill='gold' size={20}/>}
              />
          </div>
        </div>
        
    </div>
  )
}

export default Statistic
