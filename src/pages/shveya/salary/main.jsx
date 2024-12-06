import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Title from '../../../components/ui/title';
import InfoCard from '../../../components/shared/infoCard';
import { getMySalaryList } from '../../../store/shveya/salary';
import MySalaryTable from './components/tables/MySalaryTable';
import { useSearchParams } from 'react-router-dom';
import { formatedToDDMMYYYY, getDefaultDateRange } from '../../../utils/functions/dateFuncs';
import DateRangePickerInput from '../../../components/ui/inputs/dateRangePicker';

const MySalary = () => {

  const dispatch = useDispatch();
  const { me_info } = useSelector(state => state.auth);
  const { salary_list, salary_list_status } = useSelector(state => state.sh_salary);
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

  useEffect(() => {
    dispatch(getMySalaryList({ urls }))
  }, [urls.page, urls.from_date, urls.to_date])

  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <div className='flex flex-col gap-y-2'>
          <p className='font-semibold font-inter'>Фильтрация по дате:</p>
          <DateRangePickerInput 
            date={[urls.from_date, urls.to_date]} 
            setDate={handleChangeFilter} 
            placement='bottomLeft'
            size='sm'
          />
        </div>

        {/* <div className='flex gap-x-5 my-3'>
            {
                statistics.map(item => (
                    <InfoCard data={item}/>
                  ))
            }
        </div> */}

        <div>
          <MySalaryTable
            data={salary_list?.results}
            status={salary_list_status}
            total={salary_list?.count || 0}
            limit={urls.page_size}
            activePage={Number(urls.page)}
            setPage={handleChangeFilter}
          />
        </div>
    </div>
  )
}

export default MySalary
