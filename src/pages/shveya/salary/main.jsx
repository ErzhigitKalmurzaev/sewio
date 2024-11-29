import React from 'react'
import { useSelector } from 'react-redux';
import Title from '../../../components/ui/title';
import InfoCard from '../../../components/shared/infoCard';

const MySalary = () => {

  const { me_info } = useSelector(state => state.auth);

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

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <Title text={`ЗП: ${me_info?.name + ' ' + me_info?.surname}`}/>

        <div className='flex gap-x-5 my-3'>
            {
                statistics.map(item => (
                    <InfoCard data={item}/>
                  ))
            }
        </div>
    </div>
  )
}

export default MySalary
