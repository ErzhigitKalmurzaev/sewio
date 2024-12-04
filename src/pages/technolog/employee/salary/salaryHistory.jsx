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

  const { id } = useParams()
  const dispatch = useDispatch();

  const { salary_history, salary_history_status } = useSelector(state => state.staff);
  const [params, setParams] = useSearchParams();

  const urls = {
    from_date: params.get("from_date") || getDefaultDateRange().from_date,
    to_date: params.get("to_date") || getDefaultDateRange().to_date,
    page: params.get("page") || 1,
    page_size: params.get("page_size") || 20
  }

  const handleChangeFilter = (value) => {
    if(value?.length > 0) {
      params.set('from_date', formatedToDDMMYYYY(value[0], '-'));
      params.set('to_date', formatedToDDMMYYYY(value[1], '-'));
      setParams(params);
    }
  }

  useEffect(() => {
    dispatch(getStaffSalaryHistory({ id, urls }));
  }, [urls.from_date, urls.to_date, id])

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        
        <div className='flex justify-between'>
          <Title text="История выдачи ЗП сотрудника"/>
          <div>
            <DateRangePickerInput date={[urls.from_date, urls.to_date]} setDate={handleChangeFilter}/>
          </div>
        </div>

        <div className='flex gap-x-5'>
            {
                statistics.map(item => (
                    <InfoCard data={item}/>
                  ))
            }
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
