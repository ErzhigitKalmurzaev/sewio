import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import MyBreadcrums from '../../../../components/ui/breadcrums';
import Title from '../../../../components/ui/title';
import styled from '@emotion/styled/macro';
import Input from '../../../../components/ui/inputs/input';
import { useDispatch, useSelector } from 'react-redux';
import { getStaffList } from '../../../../store/technolog/staff';
import SelectStaffTable from '../components/tables/selectStaffsTable';
import { createWarehouse, postWarehouse } from '../../../../store/technolog/warehouse';
import { toast } from 'react-toastify';
import Button from '../../../../components/ui/button';
import { MoveRight } from 'lucide-react';

const CreateWarehouse = () => {

  const breadcrumbs = [
    {
        label: 'Склады',
        path: '/sklad',
        active: false
    },
    {
        label: 'Создание склада',
        path: '/sklad/create',
        active: true
    }
  ]

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { staff_list, staff_list_status } = useSelector(state => state.staff);

  const [warehouse, setWarehouse] = useState({
    title: '',
    address: '',
    staffs: []
  })
  const [errors, setErrors] = useState({
    title: false,
    address: false,
    staffs: false
  })
  const [params, setParams] = useSearchParams();

  const urls = {
    is_active: params?.get("active") || "",
    search: params?.get("search") || "",
    role: params.get("role") || "",
    salary_type: params.get("salary_type") || ""
  };

  useEffect(() => {
    dispatch(getStaffList({ urls }))
  }, [urls.role])

  const handleChangeFilter = (name, value) => {
    params.set(name, value);
    setParams(params);
  }

  const handleSearch = () => {
    dispatch(getStaffList({ urls }))
  }

  const validateField = () => {
    const newErrors = {
      title: !warehouse.title,
      address: !warehouse.address
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateField()) {
      dispatch(postWarehouse(warehouse))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            navigate(`${res.payload.id}`)
            toast("Склад успешно создан!")
          }
        })
    } else {
      toast("Заполните все поля!")
    }
  }

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
        <MyBreadcrums items={breadcrumbs}/>
        
        <div className='flex items-center justify-between'>
            <Title text="Создание склада"/>
        </div>

        <WhiteWrapper>
            <p className='text-base font-semibold'>Основная информация</p>

            <div className='flex justify-between gap-x-10'>
                <Input
                    type='text'
                    name='title'
                    label='Название склада'
                    placeholder='Введите название склада'
                    value={warehouse.title}
                    error={errors.title}
                    onChange={(e) => setWarehouse({...warehouse, title: e.target.value})}
                />

                <Input
                    type='text'
                    name='address'
                    label='Адрес склада'
                    placeholder='Введите адрес склада'
                    value={warehouse.address}
                    error={errors.address}
                    onChange={(e) => setWarehouse({...warehouse, address: e.target.value})}
                />
            </div>
        </WhiteWrapper>
        
        <div className='flex flex-col gap-y-5 bg-white rounded-lg p-5'>
                <Input
                    type='text'
                    width='50%'
                    placeholder='Поиск по сотрудникам'
                    value={urls.search}
                    handleSearch={handleSearch}
                    onChange={(e) => handleChangeFilter('search', e.target.value)}
                />

            <SelectStaffTable
                data={staff_list}
                status={staff_list_status}
                urls={urls}
                handleChangeFilter={handleChangeFilter}
                warehouse={warehouse}
                setWarehouse={setWarehouse}
            />
        </div>

        <div className='flex justify-center'>
          <Button width='200px' onClick={onSubmit}>
            Создать
          </Button>
        </div>

    </div>
  )
}

export default CreateWarehouse

const WhiteWrapper = styled("div")`
  width: 100%;
  background: white;
  border-radius: 12px;
  padding: 15px 20px 20px 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;