import React, { useEffect } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import SalaryPaymentTable from '../../../../components/common/tables/salaryPaymentTable'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clear_payment_info, getStaffPaymentDetail } from '../../../../store/technolog/staff'
import PaymentInfoTable from '../../../../components/common/tables/paymentInfoTable'
import BackDrop from '../../../../components/ui/backdrop'

const PaymentInfo = () => {

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
        label: 'Информация о выплате',
        path: '/employee/info/salary_payment',
        active: true
    }
  ]

  const { id } = useParams();
  const dispatch = useDispatch();

  const { payment_detail, payment_detail_status } = useSelector(state => state.staff);

  useEffect(() => {
    dispatch(clear_payment_info())
    dispatch(getStaffPaymentDetail({ id }))
  }, [id, dispatch])

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        <Title text="Информация о выплате"/>

        {
          payment_detail_status === 'loading' && <BackDrop open={true}/>
        }

        <div className='w-2/3'>
          <PaymentInfoTable
            data={payment_detail}
            status={payment_detail?.status}
          />
        </div>
        
        {
          payment_detail?.files?.length > 0 &&
          <div className='flex flex-col gap-y-4'>
            <p className='text-lg font-semibold font-inter'>Картинки</p>
            <div className='flex gap-x-4'>
              {
                payment_detail?.files?.map((item, index) => (
                  <div className='w-[200px] h-[200px] rounded-lg border border-borderGray'>
                      <img 
                        src={item.file} 
                        alt="image" 
                        key={index}
                        className='w-full h-full object-contain'
                      />
                  </div>
                ))
              }
            </div>
          </div>
        }
    </div>
  )
}

export default PaymentInfo
