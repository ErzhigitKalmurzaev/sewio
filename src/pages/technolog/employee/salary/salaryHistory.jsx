import React from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import InfoCard from '../../../../components/shared/infoCard'

const SalaryHistory = () => {

  const breadcrumbs = [
    {
        label: 'Сотрудники',
        path: '/employee',
        active: false
    },
    {
        label: 'Редактирование сотрудника',
        path: '/employee/info',
        active: false
    },
    {
        label: 'История выплат',
        path: '/employee/info/salary_history',
        active: true
    }
  ]
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
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        <Title text="История выдачи ЗП сотрудника: Александр Сергеев"/>

        <div className='flex gap-x-5'>
            {
                statistics.map(item => (
                    <InfoCard data={item}/>
                  ))
            }
        </div>

        <div>
            
        </div>
    </div>
  )
}

export default SalaryHistory
