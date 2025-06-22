import React, { useEffect } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import SalaryPaymentTable from '../../../../components/common/tables/salaryPaymentTable'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStaffPaymentInfo } from '../../../../store/technolog/staff'

const SalaryPayment = () => {

  const { id } = useParams();

  const breadcrumbs = [
    {
        label: 'Сотрудники',
        path: '/employee',
        active: false
    },
    {
        label: 'Редактирование сотрудника',
        path: `/employee/${id}`,
        active: false
    },
    {
        label: 'Информация о выплате',
        path: '/employee/info/salary_payment',
        active: true
    }
  ]

  const dispatch = useDispatch();

  const { payment_info, payment_info_status } = useSelector(state => state.staff);

  useEffect(() => {
    dispatch(getStaffPaymentInfo({ id }))
  }, [id, dispatch])

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        <Title text="Расчёт ЗП сотрудника"/>

        <div className='w-2/3'>
          <SalaryPaymentTable
            data={payment_info}
            status={payment_info_status}
            staff_id={Number(id)}
          />
        </div>
    </div>
  )
}

export default SalaryPayment
