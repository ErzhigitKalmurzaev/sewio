import React, { useEffect, useState } from 'react';
import Title from '../../../../components/ui/title';
import MyBreadcrums from '../../../../components/ui/breadcrums';
import Button from '../../../../components/ui/button';
import SingleImagePicker from '../../../../components/ui/imagePickers/singleImagePicker';
import Input from '../../../../components/ui/inputs/input';
import Select from '../../../../components/ui/inputs/select';

import { employeeRole } from '../../../../utils/selectDatas/employeeDatas';
import TelInput from '../../../../components/ui/inputs/phoneInput';
import NumInput from '../../../../components/ui/inputs/numInput';
import { getRankList } from '../../../../store/technolog/rank';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployee } from '../../../../store/technolog/staff';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Toggle } from 'rsuite';

const CreateEmployee = () => {
  const breadcrumbs = [
    { label: 'Сотрудники', path: '/employee', active: false },
    { label: 'Создание сотрудника', path: '/employee/create', active: true },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { rank_list } = useSelector(state => state.rank);

  const [employee_data, setEmployee_data] = useState({
    name: '',
    surname: '',
    username: '',
    phone: '',
    password: '',
    role: '',
    rank: '',
    salary: 0,
    is_active: true
  })
  const [errors, setErrors] = useState({
    full_name: false,
    phone: false,
    password: false,
    role: false,
    rank: false,
    salary: false
  })
  const [image, setImage] = useState(null);
  
  useEffect(() => {
    if(!rank_list) {
      dispatch(getRankList())
    }
  }, [])

  const getValue = (e) => {
    const { name, value } = e.target;
    
    setEmployee_data({
      ...employee_data,
      [name]: value
    })
  }

  const validateFields = () => {
    const newErrors = {
      name: !employee_data.name,
      surname: !employee_data.surname,
      username: !employee_data.username,
      // email: !employee_data.email || !/\S+@\S+\.\S+/.test(employee_data.email),
      password: employee_data.password.length < 3,
      role: !employee_data.role,
      rank: !employee_data.rank
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateFields()) {
      dispatch(createEmployee({ ...employee_data, image }))
        .then(res => {
          navigate(-1)
          toast("Разряд создан успешно!")
        })
    } else {
      console.log('Form contains errors');
    }
  };

  return (
    <div className='flex h-auto flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание сотрудника" />

      <form onSubmit={onSubmit}>
        <div className='w-full mx-auto flex flex-col bg-white p-5 px-10 rounded-xl mt-2 gap-y-5'>
          <div className='flex flex-col gap-y-3'>
            <p className='text-base font-semibold'>Основная информация</p>

            <div className='flex justify-between gap-x-10 items-center'>
              <SingleImagePicker fileInfo={image} setFileInfo={setImage} />

              <div className='flex flex-col gap-y-6 w-full'>
                <div className='flex gap-x-3'>
                  <NumInput
                    width='140px'
                    label='ID'
                    name='number'
                    value={employee_data?.number || ''}
                    placeholder='ID'
                    onChange={e => getValue({ target: { value: e, name: 'number' } })}
                  />
                  <Input
                    type='text'
                    name='name'
                    label='Имя'
                    placeholder='Введите имя'
                    error={errors.name}
                    value={employee_data?.name}
                    onChange={getValue}
                  />

                  <Input
                    type='text'
                    name='surname'
                    label='Фамилия'
                    placeholder='Введите имя'
                    error={errors.surname}
                    value={employee_data?.surname}
                    onChange={getValue}
                  />
                </div>

                <div className='flex gap-x-6'>
                  <Input
                    label='Логин'
                    name='username'
                    placeholder='Введите логин'
                    type='text'
                    error={errors.username}
                    value={employee_data?.username}
                    onChange={getValue}
                  />

                  <Input
                    label='Пароль'
                    placeholder='********'
                    type='text'
                    name='password'
                    value={employee_data?.password}
                    error={errors.password}
                    onChange={getValue}
                  />
                </div>
              </div>
            </div>

            <div className='flex gap-x-6 items-center'>
              <Toggle 
                  className='flex w-[410px] justify-center items-center mt-5'
                  checked={employee_data?.is_active}
                  onChange={(e) => setEmployee_data({ ...employee_data, is_active: e })}
                >
                  Активный
              </Toggle>
              <TelInput
                label='Телефон (WhatsApp)'
                value={employee_data.phone}
                error={errors.phone}
                onChange={e => getValue({ target: { value: e, name: 'phone' } })}
              />
              
              <NumInput
                label='Зарплата'
                name='salary'
                placeholder='Введите зарплату'
                value={employee_data?.salary}
                error={errors.salary}
                onChange={e => getValue({ target: { value: e, name: 'salary' } })}
              />
            </div>

            <div className='flex gap-x-6'>
              <Select 
                label='Роль'
                data={employeeRole}
                value={employee_data.role}
                onChange={e => getValue({ target: { value: e, name: 'role' } })}
                error={errors.role} 
                placeholder='Выберите роль' 
              />
              <Select
                label='Разряд'
                placeholder='Выберите разряд'
                value={employee_data.rank}
                data={rank_list} 
                error={errors.rank} 
                labelKey='title'
                valueKey='id'
                onChange={e => getValue({ target: { value: e, name: 'rank' } })}
              />
            </div>
          </div>
        </div>

        <div className='flex justify-center mt-8'>
          <Button className='w-[300px]' type='submit'>Сохранить</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
