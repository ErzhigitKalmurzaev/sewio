import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import InfoCard from '../../../../components/shared/infoCard'
import { useDispatch, useSelector } from 'react-redux'
import { getStaffSalaryHistory } from '../../../../store/technolog/staff'
import SalaryHistoryTable from '../components/tables/salaryHistoryTable'
import { useParams, useSearchParams } from 'react-router-dom'
import DateRangePickerInput from '../../../../components/ui/inputs/dateRangePicker'
import { formatedToDDMMYYYY, getDefaultDateRange } from '../../../../utils/functions/dateFuncs'
import { toast } from 'react-toastify'

const SalaryHistory = () => {

  const { id } = useParams()

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
        label: 'История выплат',
        path: '/employee/info/salary_history',
        active: true
    }
  ]

  const dispatch = useDispatch();

  const { salary_history, salary_history_status } = useSelector(state => state.staff);
  const [params, setParams] = useSearchParams();

  const urls = {
    from_date: params.get("from_date") || getDefaultDateRange().from_date,
    to_date: params.get("to_date") || getDefaultDateRange().to_date,
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20
  }

  const handleChangeFilter = (value, name) => {
    if(value?.length > 0) {
      params.set('from_date', formatedToDDMMYYYY(value[0], '-'));
      params.set('to_date', formatedToDDMMYYYY(value[1], '-'));
      setParams(params);
    } else {
      params.set(name, value);
      setParams(params)
    }
  }

  useEffect(() => {
    dispatch(getStaffSalaryHistory({ id, urls }))
      .then(res => {
        if(res.meta.requestStatus === 'rejected') {
          toast.error('Произошла ошибка!')
      }})
  }, [urls.from_date, urls.to_date, id])

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        
        <div className='flex justify-between items-center'>
          <Title text="История выдачи ЗП сотрудника"/>
          <div>
            <DateRangePickerInput date={[urls.from_date, urls.to_date]} setDate={handleChangeFilter} size='md'/>
          </div>
        </div>

        <div>
            <SalaryHistoryTable 
              data={salary_history?.results} 
              status={salary_history_status}
              total={salary_history?.count || 0}
              limit={urls.page_size}
              activePage={Number(urls.page)}
              setPage={handleChangeFilter}
            />
        </div>
    </div>
  )
}

export default SalaryHistory
