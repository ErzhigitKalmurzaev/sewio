import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import SingleImagePicker from '../../../components/ui/imagePickers/singleImagePicker'
import Input from '../../../components/ui/inputs/input'
import Select from '../../../components/ui/inputs/select'
import Button from '../../../components/ui/button'
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas'
import { Modal, Toggle } from 'rsuite'
import Textarea from '../../../components/ui/inputs/textarea'
import NumInput from '../../../components/ui/inputs/numInput'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editEmployeeInfo, getEmployeeInfo } from '../../../store/technolog/staff'
import TelInput from '../../../components/ui/inputs/phoneInput'
import { getRankList } from '../../../store/technolog/rank'
import { toast } from 'react-toastify'
import AdvanceModal from './components/modals/advanceModal'
import FineModal from './components/modals/fineModal'
import BackDrop from '../../../components/ui/backdrop'
import BonusModal from './components/modals/bonusModal';

const EditEmployee = () => {

  const breadcrumbs = [
    {
        label: 'Сотрудники',
        path: '/employee',
        active: false
    },
    {
        label: 'Редактирование сотрудника',
        path: '/employee/info',
        active: true
    }
  ]

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { staff_info, staff_info_status } = useSelector(state => state.staff);
  const { rank_list } = useSelector(state => state.rank);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    dispatch(getRankList());
    dispatch(getEmployeeInfo(id))
        .then(res => {
            setEmployee_data({
                name: res.payload?.name,
                surname: res.payload?.surname,
                username: res.payload?.user?.username,
                phone: res.payload?.phone,
                role: res.payload?.role,
                rank: res.payload?.rank?.id,
                salary: `${res.payload?.salary}`,
                number: res.payload?.number,
                is_active: res.payload?.user?.is_active
            })
            setImage(res.payload?.image)
        })
  }, [])

  const [modals, setModals] = useState({ advance: false, fine: false, bonus: false });
  const [employee_data, setEmployee_data] = useState({
    name: '',
    surname: '',
    username: '',
    phone: '',
    role: '',
    rank: '',
    salary: '',
    is_active: true
  })
  const [errors, setErrors] = useState({
    name: false,
    surname: false,
    username: false,
    phone: false,
    password: false,
    role: false,
    rank: false,
    salary: false
  })
  const [image, setImage] = useState(null);

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
      phone: !employee_data.phone || !/^\+?\d{10,13}$/.test(employee_data.phone),
      role: !employee_data.role,
      rank: !employee_data.rank,
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateFields()) {
      const { password, ...datas} = employee_data
      const finalData = password ? { ...datas, password } : datas


      const props = image ? image?.blobFile ? { ...finalData, image: image?.blobFile } 
      : finalData : { ...finalData, image_delete: true } 

      dispatch(editEmployeeInfo({ id, props }))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            toast("Данные сотрудника успешно изменены!");
          } else {
            toast.error("Произошла ошибка!")
          }
        })
    } else {
      console.log('Form contains errors');
    }
  };

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs}/>

      {
        staff_info_status === 'loading' && <BackDrop/>
      }
      
      <div className='flex justify-between items-center'>
        <Title text="Редактирование сотрудника"/>
        
        <div className='flex gap-x-5'>
            <Button onClick={() => navigate('salary_history')}>История расчета</Button>
            <Button variant='white' onClick={() => setModals({ ...modals, advance: true })}>Аванс</Button>
            <Button variant='green' onClick={() => setModals({ ...modals, bonus: true })}>Бонус</Button>
            <Button variant='red' onClick={() => setModals({ ...modals, fine: true })}>Штраф</Button>
            <Button variant='blue' onClick={() => navigate('salary_calculate')}>Рассчитать зарплату</Button>
        </div>
      </div>

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
                    value={employee_data.name}
                    onChange={getValue}
                  />

                  <Input
                    type='text'
                    name='surname'
                    label='Фамилия'
                    placeholder='Введите имя'
                    error={errors.surname}
                    value={employee_data.surname}
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
                    value={employee_data.username}
                    onChange={getValue}
                  />

                  <Input
                    label='Пароль'
                    placeholder='********'
                    type='text'
                    name='password'
                    error={errors.password}
                    value={employee_data.password}
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
                value={employee_data?.phone}
                error={errors.phone}
                onChange={e => getValue({ target: { value: e, name: 'phone' } })}
              />

              <NumInput
                label='Зарплата'
                name='salary'
                placeholder='Введите зарплату'
                error={errors.salary}
                value={`${employee_data?.salary}`}
                onChange={e => getValue({ target: { value: e, name: 'salary' } })}
              />
            </div>

            <div className='flex gap-x-6'>
              <Select 
                label='Роль' 
                name='role' 
                placeholder='Выберите роль' 
                data={employeeRole} 
                error={errors.role} 
                value={employee_data?.role}
                onChange={e => getValue({ target: { value: e, name: 'role' } })}
              />
              <Select 
                label='Разряд' 
                name='rank'
                placeholder='Выберите разряд' 
                data={rank_list} 
                error={errors.rank} 
                value={employee_data?.rank}
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

      <AdvanceModal
        modals={modals}
        setModals={setModals}
        update={update}
        setUpdate={setUpdate}
      />
      <FineModal
        modals={modals}
        setModals={setModals}
        setUpdate={setUpdate}
      />
      <BonusModal
        modals={modals}
        setModals={setModals}
        setUpdate={setUpdate}
      />
    </div>
  )
}

export default EditEmployee
