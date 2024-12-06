import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getMySalaryDetail } from '../../../store/shveya/salary'
import SalaryDetailTable from './components/tables/salaryDetailTable'
import BackDrop from '../../../components/ui/backdrop'

const MySalaryDetail = () => {

  const { id } = useParams();
  const dispatch = useDispatch();

  const { payment_detail, payment_detail_status } = useSelector(state => state.sh_salary);

  useEffect(() => {
    dispatch(getMySalaryDetail({ id }))
  }, [id, dispatch])

  return (
    <div className='flex flex-col gap-y-5 mb-5 overflow-y-scroll'>
        <p className='font-semibold font-inter'>Информация о выплате</p>
        {payment_detail_status === 'loading' && <BackDrop open={payment_detail_status === 'loading'}/>}


        <div className='w-2/3'>
          <SalaryDetailTable
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

export default MySalaryDetail
