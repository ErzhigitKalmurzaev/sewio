import React from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import SalaryPaymentTable from '../../../../components/common/tables/salaryPaymentTable'

const SalaryPayment = () => {

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
        label: 'Выплата зарплаты',
        path: '/employee/info/salary_payment',
        active: true
    }
  ]

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        <Title text="Выдача ЗП сотруднику: Александр Сергеев"/>

        <div className='w-2/3'>
          <SalaryPaymentTable/>
        </div>
    </div>
  )
}

export default SalaryPayment
