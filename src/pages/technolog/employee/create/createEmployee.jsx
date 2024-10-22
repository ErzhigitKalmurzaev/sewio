import React, { useState } from 'react';
import Title from '../../../../components/ui/title';
import MyBreadcrums from '../../../../components/ui/breadcrums';
import Button from '../../../../components/ui/button';
import SingleImagePicker from '../../../../components/ui/imagePickers/singleImagePicker';
import Input from '../../../../components/ui/inputs/input';
import Select from '../../../../components/ui/inputs/select';

import { employeeRole, employeeSalaryType } from '../../../../utils/selectDatas/employeeDatas';
import TelInput from '../../../../components/ui/inputs/phoneInput';
import NumInput from '../../../../components/ui/inputs/numInput';

const CreateEmployee = () => {
  const breadcrumbs = [
    { label: 'Сотрудники', path: '/employee', active: false },
    { label: 'Создание сотрудника', path: '/employee/create', active: true },
  ];

  const [employee_data, setEmployee_data] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    salary_type: '',
    salary: 0
  })
  const [errors, setErrors] = useState({
    full_name: false,
    phone: false,
    email: false,
    password: false,
    role: false,
    salary_type: false,
    salary: false
  })

  const getValue = (e) => {
    const { name, value } = e.target;
    
    setEmployee_data({
      ...employee_data,
      [name]: value
    })
  }

  const validateFields = () => {
    const newErrors = {
      full_name: !employee_data.full_name,
      phone: !employee_data.phone || !/^\+?\d{10,13}$/.test(employee_data.phone), // Example phone validation
      email: !employee_data.email || !/\S+@\S+\.\S+/.test(employee_data.email),
      password: employee_data.password.length < 6,
      role: !employee_data.role,
      salary_type: !employee_data.salary_type,
      salary: employee_data.salary <= 0,
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateFields()) {
      // Submit form data if validation passes
      console.log('Form data is valid', employee_data);
    } else {
      console.log('Form contains errors');
    }
  };

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание сотрудника" />

      <form onSubmit={onSubmit}>
        <div className='w-full mx-auto flex flex-col bg-white p-5 px-10 rounded-xl mt-2 gap-y-5'>
          <div className='flex flex-col gap-y-4'>
            <p className='text-base font-semibold'>Основная информация</p>

            <div className='flex justify-between gap-x-10 items-center'>
              <SingleImagePicker />

              <div className='flex flex-col gap-y-6 w-full'>
                <div className='flex gap-x-6'>
                  <Input
                    type='text'
                    name='full_name'
                    label='Ф.И.О'
                    placeholder='Иванов Иван Иванович'
                    error={errors.full_name}
                    onChange={getValue}
                  />

                  <TelInput
                    label='Телефон'
                    value={employee_data.phone}
                    error={errors.phone}
                    onChange={e => getValue({ target: { value: e, name: 'phone' } })}
                  />
                </div>

                <div className='flex gap-x-6'>
                  <Input
                    label='Email'
                    name='email'
                    placeholder='technolog@gmail.com'
                    type='email'
                    error={errors.email}
                    onChange={getValue}
                  />

                  <Input
                    label='Пароль'
                    placeholder='********'
                    type='text'
                    name='password'
                    error={errors.password}
                    onChange={getValue}
                  />
                </div>
              </div>
            </div>

            <div className='flex gap-x-6'>
              <Select 
                label='Роль' 
                name='role' 
                placeholder='Выберите роль' 
                data={employeeRole} 
                error={errors.role} 
                onChange={e => getValue({ target: { value: e, name: 'role' } })}
              />
              <Select 
                label='Тип зарплаты' 
                name='salary_type'
                placeholder='Выберите тип зарплаты' 
                data={employeeSalaryType} 
                error={errors.salary_type} 
                onChange={e => getValue({ target: { value: e, name: 'salary_type' } })}
              />
            </div>

            <NumInput
              label='Зарплата'
              name='salary'
              placeholder='Введите зарплату'
              error={errors.salary}
              onChange={e => getValue({ target: { value: e, name: 'salary' } })}
            />
          </div>
        </div>

        <div className='flex justify-center'>
          <Button className='w-[300px]' type='submit'>Сохранить</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployee;
