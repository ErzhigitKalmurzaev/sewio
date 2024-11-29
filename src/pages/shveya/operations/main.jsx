import React from 'react'
import Title from '../../../components/ui/title'
import Button from '../../../components/ui/button'
import Input from '../../../components/ui/inputs/input'

const MyOperations = () => {
  return (
    <div className='flex flex-col gap-y-4 mb-5'>
        <Title text={`Операции`}/>

        <div className='flex items-center my-2 gap-x-14'>
            <div className='flex justify-between items-center gap-x-3'>
                <Button variant='filterActive'>Все</Button>
                <Button variant='filter'>Новые</Button>
                <Button variant='filter'>В процессе</Button>
                <Button variant='filter'>Завершенные</Button>
            </div>
            <div className='w-3/6'>
                <Input searchicon={true} placeholder='Поиск по операциям' type="text"/>
            </div>
        </div>
    </div>
  )
}

export default MyOperations
