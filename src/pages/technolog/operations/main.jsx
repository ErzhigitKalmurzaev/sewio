import Button from '../../../components/ui/button'
import Title from '../../../components/ui/title'
import Input from '../../../components/ui/inputs/input'

const Operations = () => {
  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-3'>
        <div className='flex justify-between items-center'>
            <Title text="Операции" />
        </div>

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

export default Operations
