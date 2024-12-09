import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useDispatch } from 'react-redux'
import { createSizeCategory, editSizeCategory } from '../../../../store/technolog/size'
import { toast } from 'react-toastify'
import { Trash2 } from 'lucide-react'

const EditCategory = ({ modals, setModals, data, setUpdate }) => {

  const dispatch = useDispatch();

  const [category, setCategory] = useState({
    title: data.title,
    is_active: data.is_active
  })
  const [errors, setErrors] = useState({
    title: false,
    is_active: false
  })
  const [sizes, setSizes] = useState([])
  const [newSize, setNewSize] = useState({
    title: ''
  });
  const [addSize, setAddSize] = useState(false);
  const [delete_ids, setDeleteIds] = useState([]);

  useEffect(() => {
    if(data?.title) {
        setCategory({
            title: data.title,
            is_active: data.is_active
        })
        setSizes([...data?.sizes])
    }
  }, [data.title])
  
  const getValue = (e) => {
    const { name, value } = e.target;
    setCategory({
        ...category,
        [name]: value
    })
  }

  const deleteSize = (data, index) => {
    if(data?.id) {
        setDeleteIds(prev => [...prev, data.id]);
        setSizes(prev => prev.filter(item => item.id !== data.id));
    } else {
        setSizes(prev => prev.filter((item, i) => i !== index));
    }
  }

  const addNewSize = () => {
    setSizes(prev => [...prev, newSize]);
    setNewSize({ title: '' });
    setAddSize(false);
  }

  const getNewSizeValue = (value) => {
    if(value?.length < 6) {
        setNewSize({
            ...newSize,
            title: value
        })
    } else {
        toast.error('Слишком длинное название!')
    }
  }
  
  const onSubmit = () => {
    dispatch(editSizeCategory({ id: data.id, props: {
        title: category.title,
        is_active: category.is_active,
        sizes_add: sizes.filter(item => !item.id && item.title),
        sizes_delete: delete_ids
    }}))
        .then(res => {
            if(res.meta.requestStatus === 'fulfilled') {
                toast("Категория изменена успешно!");
                setModals({ ...modals, edit: false });
                setUpdate(prev => !prev);
                setCategory({
                    title: '',
                    is_active: true
                })
            }
        })
  }

  return (
    <Modal open={modals.edit} onClose={() => setModals({ ...modals, edit: false })} className='my-auto'>
        <Modal.Header>
            <Modal.Title>
                <p className='text-lg font-bold font-inter'>Редактирование категории</p>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className='flex flex-col gap-y-5'>
            <div className='flex flex-col gap-y-4'>
                <Input
                    label='Название'
                    name='title'
                    placeholder='Введите название'
                    type='text'
                    value={category.title || data?.title}
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
                            sizes?.length > 0 ? 
                            sizes?.map((item, index) => (
                                <div key={index} className='w-full flex justify-between p-2 px-3 border border-gray rounded-md'>
                                    <p>{item.title}</p>
                                    <Trash2 color='red' className='cursor-pointer' size={20} onClick={() => deleteSize(item, index)}/>
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
                                onChange={(e) => getNewSizeValue(e.target.value)}
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
            <Button width='385px' onClick={onSubmit}>Сохранить</Button>
        </Modal.Footer>
    </Modal>
  )
}

export default EditCategory
