import React from 'react'
import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import { useNavigate } from 'react-router-dom'
import Input from '../../../components/ui/inputs/input'
import TechnologEmployeeTable from '../../../components/tables/employeeTables/technologTable'

const Employee = () => {

    const navigate = useNavigate();

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        <div className='flex justify-between items-center'>
            <Title text="Сотрудники" />
            <div className='flex gap-x-5'>
                <Button onClick={() => navigate('create')}>+ Добавить сотрудника</Button>
            </div>
        </div>

        <div className='flex items-center my-2 gap-x-14'>
            <div className='flex justify-between items-center gap-x-3'>
                <Button variant='filterActive'>Все</Button>
                <Button variant='filter'>ЗП</Button>
                <Button variant='filter'>Фиксированная</Button>
            </div>
            <div className='w-3/6'>
                <Input searchicon={true} placeholder='Поиск по сотрудникам' type="text"/>
            </div>
        </div>

        <div className='mt-5'>
            <TechnologEmployeeTable/>
        </div>
    </div>
  )
}

export default Employee
