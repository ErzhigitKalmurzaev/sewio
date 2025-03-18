import React, { useEffect, useState } from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import DateRangePickerInput from '../../../components/ui/inputs/dateRangePicker';
import InfoCard from '../../../components/shared/infoCard';
import { useDispatch, useSelector } from 'react-redux';
import { getStatistic } from '../../../store/technolog/statistic';
import { useSearchParams } from 'react-router-dom';
import { formatedToDDMMYYYY, formatedToDDMMYYYY2, getDefaultDateRange } from '../../../utils/functions/dateFuncs';
import { ChartColumn, CircleCheckBig, CircleDollarSign, Clock, Package, Pickaxe, Star, Wrench } from 'lucide-react';
import DataPicker from '../../../components/ui/inputs/dataPicker';

const Statistic = () => {

  const dispatch = useDispatch();

  const { statistic_list, statistic_list_status } = useSelector(state => state.statistic);
  const [params, setParams] = useSearchParams();

  const urls = {
    date: params.get("date") || getDefaultDateRange().to_date,
  }

  const handleChangeFilter = (value) => {
    console.log(value)
    params.set('date', formatedToDDMMYYYY2(value, '-'));
    setParams(params);
  }

  useEffect(() => {
    dispatch(getStatistic({ date: urls.date }));
  }, [])

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-12'>
        <div className='flex justify-between items-center'>
            <Title text="Общая статистика" />
            <div className='w-[300px] flex gap-x-5 items-center justify-end'>
                <DataPicker
                  value={urls.date.split('-').join('.')}
                  onChange={handleChangeFilter}
                  placeholder='Дата'
                />
                {/* <Button width='200px' style={{ marginBottom: '5px' }}>+ Создать план</Button> */}
            </div>
        </div>

        {/* По заказам */}
        <div className='flex flex-col gap-y-3'>
          <div>
              <Button variant='filterActive'>По заказам</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              <InfoCard
                title='Доход'
                plan={statistic_list?.order?.plan?.income || 0}
                plan_status={false}
                value={statistic_list?.order?.fact?.income || 0}
                date={urls}
                unit=' сом'
                icon={<CircleDollarSign color='green' size={20}/>}
              />
              <InfoCard
                title='Расход'
                plan_status={false}
                value={statistic_list?.order?.fact?.consumption || 0}
                date={urls}
                unit=' сом'
                icon={<CircleDollarSign color='red' size={20}/>}
              />
              <InfoCard
                title='Прибыль'
                plan_status={false}
                value={statistic_list?.order?.fact?.profit || 0}
                date={urls}
                unit=' сом'
                icon={<CircleDollarSign color='green' size={20}/>}
              />
              <InfoCard
                title='Заказы'
                plan={statistic_list?.order?.plan?.orders || 0}
                plan_status={false}
                value={statistic_list?.order?.fact?.orders || 0}
                date={urls}
                unit=''
                icon={<ChartColumn color='blue' size={20} />}
              />
          </div>
        </div>

        {/* По сотрудникам */}
        <div className='flex flex-col gap-y-3'>
          <div>
              <Button variant='filterActive'>По сотрудникам</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              <InfoCard
                title='Ср. производительность'
                plan_status={false}
                value={statistic_list?.staff?.avg_performance.toFixed(1) || 0}
                date={urls}
                unit=' шт.'
                icon={<ChartColumn color='blue' size={20} />}
              />
              <InfoCard
                title='Зарплаты'
                plan_status={false}
                value={statistic_list?.staff?.done || 0}
                date={urls}
                unit=' сом'
                icon={<CircleCheckBig color='green' size={20}/>}
              />
              <InfoCard
                title='Штрафы'
                plan_status={false}
                value={statistic_list?.staff?.fine || 0}
                date={urls}
                unit=' сом'
                icon={<CircleDollarSign color='red' size={20}/>}
              />
              <InfoCard
                title='Произведено операций'
                plan_status={false}
                value={statistic_list?.staff?.performance || 0}
                date={urls}
                unit=' шт.'
                icon={<Pickaxe color='gray' size={20} />}
              />
          </div>
          <div className='flex gap-x-5'>
              <InfoCard
                title='Время работы'
                plan_status={false}
                value={(statistic_list?.staff?.time / 3600).toFixed(1) || 0}
                date={urls}
                unit=' ч.'
                icon={<Wrench color='gray' size={20} />}
              />
          </div>
        </div>

        {/* По продуктам */}
        <div className='flex flex-col gap-y-3'>
          <div>
              <Button variant='filterActive'>По продуктам</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              <InfoCard
                title='Произведено'
                plan_status={false}
                value={statistic_list?.product?.produced || 0}
                date={urls}
                unit=' шт.'
                icon={<Package color='gray' size={20} />}
              />
          </div>
        </div>

        {/* По оборудованию */}
        <div className='flex flex-col gap-y-3'>
          <div>
              <Button variant='filterActive'>По оборудованиям</Button>
          </div>
          <div className='flex gap-x-5 my-3'>
              <InfoCard
                title='Время работы'
                plan_status={false}
                value={(statistic_list?.machine?.time / 3600)?.toFixed(1) || 0}
                date={urls}
                unit=' ч.'
                icon={<Clock color='gray' size={20} />}
              />
              <InfoCard
                title='Расходы обслуживания'
                plan_status={false}
                value={statistic_list?.machine?.service || 0}
                date={urls}
                unit=' сом'
                icon={<CircleDollarSign color='red' size={20}/>}
              />
          </div>
        </div>
        
    </div>
  )
}

export default Statistic
