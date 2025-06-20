import React, { useEffect } from 'react'
import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Input from '../../../components/ui/inputs/input'
import TechnologEmployeeTable from '../../../components/tables/employeeTables/technologTable'
import { useDispatch, useSelector } from 'react-redux'
import { getStaffList } from '../../../store/technolog/staff'

const Employee = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { staff_list, staff_list_status } = useSelector(state => state.staff);
  const [params, setParams] = useSearchParams();

  const urls = {
    is_active: params?.get("is_active") || "",
    search: params?.get("search") || "",
    role: params.get("role") || "",
    salary_type: params.get("salary_type") || ""
  };

  useEffect(() => {
    dispatch(getStaffList({ urls }))
  }, [urls.role, urls.is_active])

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  const handleSearch = () => {
    dispatch(getStaffList({ urls }))
  }

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        <div className='flex justify-between items-center'>
            <Title text="Сотрудники" />
            <div className='flex gap-x-5'>
                <Button onClick={() => navigate('create')}>+ Добавить сотрудника</Button>
            </div>
        </div>

        <div className='flex items-center my-2 gap-x-6'>
            <div className='flex justify-between items-center gap-x-3'>
                <Button variant={urls.is_active === "" ? "filterActive" : "filter"} onClick={() => handleChangeFilter("is_active", "")}>Все</Button>
                <Button variant={urls.is_active === 'true' ? "filterActive" : "filter"} onClick={() => handleChangeFilter("is_active", true)}>Активные</Button>
                <Button variant={urls.is_active === 'false' ? "filterActive" : "filter"} onClick={() => handleChangeFilter("is_active", false)}>Деактивные</Button>
            </div>
            <div className='w-3/6'>
                <Input 
                    searchicon={true} 
                    placeholder='Поиск по сотрудникам' 
                    type="text"
                    value={urls.search}
                    onChange={e => handleChangeFilter('search', e.target.value)}
                    searchHandle={handleSearch}
                />
            </div>
        </div>

        <div className='mt-2'>
            <TechnologEmployeeTable 
                data={staff_list}
                status={staff_list_status} 
                handleChangeFilter={handleChangeFilter}
                urls={urls}
            />
        </div>
    </div>
  )
}

export default Employee
