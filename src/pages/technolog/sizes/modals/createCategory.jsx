import React, { useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSizeCategory } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'

const CreateCategory = ({ modals, setModals, setUpdate }) => {

  const dispatch = useDispatch();

  const [category, setCategory] = useState({
    title: '',
    is_active: true
  })
  const [newSizes, setNewSizes] = useState([]);
  const [newSize, setNewSize] = useState({
    title: ''
  })
  const [addSize, setAddSize] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    is_active: false
  })


  const getValue = (e) => {
    const { name, value } = e.target;
    setCategory({
        ...category,
        [name]: value
    })
  }

  const addNewSize = () => {
    if(newSize.title) {
        setNewSizes(prev => [...prev, newSize]);
        setNewSize({ title: '' });
        setAddSize(false);
    } else {
        toast.error('Заполните все поля!')
    }
  }

  const onSubmit = () => {
    dispatch(createSizeCategory({
        title: category.title,
        is_active: category.is_active,
        sizes_add: newSizes,
        sizes_delete: []
    }))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Категория создана успешно!");
                setModals({ ...modals, create_category: false })
                setUpdate(prev => !prev)
                setCategory({
                    title: '',
                    is_active: true
                })
                setNewSizes([]);
            }
        })
  }

  return (
    <Modal open={modals.create_category} onClose={() => setModals({ ...modals, create_category: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Создание категории</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-4'>
                <Input
                    label='Название'
                    name='title'
                    placeholder='Введите название'
                    type='text'
                    value={category.title}
                    error={errors.username}
                    onChange={getValue}
                />
                <div className='flex justify-between items-center'>
                    <Toggle checked={category.is_active} onChange={(e) => getValue({ target: { value: e, name: 'is_active' } })}>
                        Активный
                    </Toggle>
                    <Button onClick={() => setAddSize(true)}>
                        + Размер
                    </Button>
                </div>
                <div className='flex flex-col gap-y-3'>
                    <div className='flex flex-col gap-y-3'>
                        <p className='font-semibold font-inter'>Размеры</p>
                        {
                            newSizes?.length > 0 ? 
                            newSizes.map((item, index) => (
                                <div key={index} className='w-full flex justify-between p-2 px-3 border border-gray rounded-md'>
                                    <p>{item.title}</p>
                                    <Trash2 color='red' className='cursor-pointer' size={20} onClick={() => setNewSizes(newSizes.filter((_, i) => i !== index))}/>
                                </div>
                            )) :
                            addSize ? <></> : <p className='text-center'>Размеры не созданы</p>
                        }
                    </div>
                    {
                        addSize &&
                        <div className='flex justify-between items-end gap-x-3'>
                            <Input
                                label='Название размера'
                                name='title'
                                placeholder='Введите название размера'
                                type='text'
                                value={newSize.title}
                                onChange={(e) => setNewSize({ ...newSize, title: e.target.value })}
                            />
                            <Button width='100px' style={{ marginBottom: '4.5px', height: '35.6px' }} onClick={addNewSize}>
                                Добавить
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-center'>
            <Button width='385px' onClick={onSubmit}>Создать</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateCategory
