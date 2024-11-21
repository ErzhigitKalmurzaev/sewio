import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../components/ui/breadcrums'
import Title from '../../../components/ui/title'
import SingleImagePicker from '../../../components/ui/imagePickers/singleImagePicker'
import Input from '../../../components/ui/inputs/input'
import Select from '../../../components/ui/inputs/select'
import Button from '../../../components/ui/button'
import { employeeRole, employeeSalaryType } from '../../../utils/selectDatas/employeeDatas'
import { Modal } from 'rsuite'
import Textarea from '../../../components/ui/inputs/textarea'
import NumInput from '../../../components/ui/inputs/numInput'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { editEmployeeInfo, getEmployeeInfo } from '../../../store/technolog/staff'
import TelInput from '../../../components/ui/inputs/phoneInput'
import { getRankList } from '../../../store/technolog/rank'
import { toast } from 'react-toastify'

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

  useEffect(() => {
    dispatch(getRankList());
    dispatch(getEmployeeInfo(id))
        .then(res => {
            setEmployee_data({
                name: res.payload?.name,
                surname: res.payload?.surname,
                username: res.payload?.user?.username,
                phone: res.payload?.phone,
                email: res.payload?.email,
                password: res.payload?.password,
                role: res.payload?.role,
                rank: res.payload?.rank?.id,
                salary: res.payload?.salary
            })
            setImage(res.payload?.image)
        })
  }, [])

  const [modals, setModals] = useState({ advance: false, fine: false })
  const [employee_data, setEmployee_data] = useState({
    name: '',
    surname: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    role: '',
    rank: '',
    salary: 0
  })
  const [errors, setErrors] = useState({
    name: false,
    surname: false,
    username: false,
    phone: false,
    email: false,
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
      email: !employee_data.email || !/\S+@\S+\.\S+/.test(employee_data.email),
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
      dispatch(editEmployeeInfo({ id, props: {...employee_data, image: image.blobFile} }))
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
      <Title text="Редактирование сотрудника"/>

      <form onSubmit={onSubmit}>
        <div className='w-full mx-auto flex flex-col bg-white p-5 px-10 rounded-xl mt-2 gap-y-5'>
          <div className='flex flex-col gap-y-4'>
            <p className='text-base font-semibold'>Основная информация</p>

            <div className='flex justify-between gap-x-10 items-center'>
              <SingleImagePicker fileInfo={image} setFileInfo={setImage} />

              <div className='flex flex-col gap-y-6 w-full'>
                <div className='flex gap-x-6'>
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

            <div className='flex gap-x-6'>
              <Input
                label='Email'
                name='email'
                placeholder='technolog@gmail.com'
                type='email'
                error={errors.email}
                value={employee_data.email}
                onChange={getValue}
              />
              <TelInput
                label='Телефон'
                value={employee_data?.phone}
                error={errors.phone}
                onChange={e => getValue({ target: { value: e, name: 'phone' } })}
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

            <NumInput
              label='Зарплата'
              name='salary'
              placeholder='Введите зарплату'
              error={errors.salary}
              value={employee_data?.salary}
              onChange={e => getValue({ target: { value: e, name: 'salary' } })}
            />
          </div>
        </div>

        <div className='flex justify-center mt-3'>
          <Button className='w-[300px]' type='submit'>Сохранить</Button>
        </div>
      </form>
      <div className='flex gap-x-5'>
            <Button onClick={() => navigate('salary_history')}>История расчета</Button>
            <Button onClick={() => setModals({ ...modals, advance: true })}>Аванс</Button>
            <Button variant='red' onClick={() => setModals({ ...modals, fine: true })}>Штраф</Button>
            <Button variant='blue' onClick={() => navigate('salary_payment')}>Рассчитать зарплату</Button>
      </div>

      <Modal open={modals.advance} onClose={() => setModals({ ...modals, advance: false })} className='my-auto'>
            <Modal.Header>
                <Modal.Title>
                    <p className='text-lg font-bold font-inter'>Выдача аванса</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex flex-col gap-y-5'>
                <div className='flex justify-between bg-[#467070] text-white font-inter p-5 rounded-2xl'>
                    <div className='w-1/2 flex flex-col'>
                        <p className='text-sm'>Заработанная сумма</p>
                        <p className='text-xl'>50 000 сом</p>
                    </div>
                    <div className='w-1/2 flex flex-col'>
                        <p className='text-sm'>Штрафы</p>
                        <p className='text-xl'>5 000 сом</p>
                    </div>
                </div>
                <div className='flex flex-col gap-y-4'>
                    <NumInput label='Сумма аванса' placeholder='50 000 сом' type='text'/>
                    <Textarea label='Комментарий' placeholder='Комментарий'/>
                </div>
            </Modal.Body>
            <Modal.Footer className='flex justify-center'>
                <Button width='385px'>Выдать</Button>
            </Modal.Footer>
      </Modal>
      <Modal open={modals.fine} onClose={() => setModals({ ...modals, fine: false })} className='my-auto'>
            <Modal.Header>
                <Modal.Title>
                    <p className='text-lg font-bold font-inter'>Учет штрафа</p>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='flex flex-col gap-y-5'>
                <div className='flex flex-col gap-y-4'>
                    <NumInput label='Сумма аванса' placeholder='50 000 сом' type='text'/>
                    <Textarea label='Комментарий' placeholder='Комментарий'/>
                    <div className='flex flex-col gap-y-1'>
                        <label style={{ fontSize: '13px', fontFamily: 'Inter', fontWeight: '400', color: 'rgba(52, 64, 84, 1)'}}>
                            Закрепить фото
                        </label>
                        <SingleImagePicker width='100%'/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className='flex justify-center'>
                <Button width='385px'>Выдать</Button>
            </Modal.Footer>
      </Modal>
    </div>
  )
}

export default EditEmployee
