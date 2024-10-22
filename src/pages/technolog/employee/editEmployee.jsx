import { Avatar } from '@mui/material'
import React, { useState } from 'react'
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
import { useNavigate } from 'react-router-dom'

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

  const navigate = useNavigate();

  const [role, setRole] = React.useState('');
  const [salary, setSalary] = React.useState('');
  const [modals, setModals] = useState({ advance: false, fine: false })

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs}/>
      <Title text="Редактирование сотрудника"/>

      <div className='w-full mx-auto flex flex-col bg-white p-5 px-10 rounded-xl mt-2 gap-y-5'>
        <div className='flex flex-col justify-between gap-y-4'>
            <p className='text-base font-semibold'>Основная информация</p>
            
            <div className='flex justify-between gap-x-10 items-center'>
                <SingleImagePicker/>
                <div className='flex flex-col justify-between gap-y-6 w-full'>
                    <div className='flex gap-x-6'>
                        <Input label='ФИО' placeholder='Иванов Иван Иванович'/>
                        <Input label='Телефон' placeholder='+996 708 32 32 32'/>
                    </div>
                    <div className='flex gap-x-6'>
                        <Input label='Email' placeholder='technolog@gmail.com'/>
                        <Input label='Пароль' placeholder='********'/>
                    </div>
                </div>
            </div>
            <div className='flex gap-x-6'>
                <Select label='Роль' placeholder='Выберите роль' data={employeeRole} onChange={setRole} />
                <Select label='Тип зарплаты' placeholder='Выберите тип зарплаты' data={employeeSalaryType} onChange={setSalary} />
            </div>
            <Select label='Склад' placeholder='Выберите склад'/>
        </div>
      </div>
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
