import React, { useState } from 'react'
import Title from '../../../../components/ui/title'
import { useDispatch } from 'react-redux';
import { Description } from '@mui/icons-material';
import MultiImagePicker from '../../../../components/ui/imagePickers/multiImagePicker';
import Input from '../../../../components/ui/inputs/input';
import NumInput from '../../../../components/ui/inputs/numInput';
import DataPicker from '../../../../components/ui/inputs/dataPicker';
import Textarea from '../../../../components/ui/inputs/textarea';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { postEquipment, postEquipmentFiles } from '../../../../store/technolog/equipment';
import Button from '../../../../components/ui/button';
import { formatedYYYYMMDD } from '../../../../utils/functions/dateFuncs';
import { Toggle } from 'rsuite';

const CreateEquipment = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [equipment, setEquipment] = useState({
    title: '',
    price: '',
    is_active: true,
    description: '',
    service_date: '',
    guarantee: ''
  });
  const [errors, setErrors] = useState({
    title: false,
    price: false,
    is_active: false,
    description: false,
    service_date: false,
    guarantee: false
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  const getValue = (name, value) => {
    setEquipment({
      ...equipment,
      [name]: value
    })
  }

  const validateFields = () => {
    const newErrors = {
        title: !equipment.title,
        price: !equipment.price,
        description: !equipment.description,
        service_date: !equipment.service_date,
        guarantee: !equipment.guarantee
      };
  
      setErrors(newErrors);
  
      // Return true if no errors
      return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
        dispatch(postEquipment({
            ...equipment,
            service_date: formatedYYYYMMDD(equipment.service_date),
            guarantee: formatedYYYYMMDD(equipment.guarantee)
        }))
            .then(res => {
                if(res.meta.requestStatus === 'fulfilled') {
                    dispatch(postEquipmentFiles({
                        equipment_id: res.payload.id,
                        images: images.map(image => image.blobFile),
                        delete_ids: deleteImages
                    })).then(res => {
                        if(res.meta.requestStatus === 'fulfilled') {
                            toast.success('Оборудование успешно создано!');
                            navigate(-1);
                        }
                    })
                }
            })
    } else {
        toast.error('Заполните все поля!');
    }
  }

  return (
    <div className='w-full min-h-[100vh] flex flex-col gap-y-5'>
        
        <div className='flex justify-between items-center'>
            <Title text="Создание оборудования" />
        </div>

        <div className='bg-white p-6 px-8 rounded-lg flex flex-col gap-y-3'>
            <p className='font-semibold font-inter'>Основная информация</p>
            <MultiImagePicker
                existingImages={existingImages}
                setExistingImages={setExistingImages}
                setDeleteImages={setDeleteImages}
                newImages={images}
                setNewImages={setImages}
            />
            <div className='w-1/2 flex flex-col gap-y-3'>
                <Input
                    type='text'
                    label='Название оборудования'
                    placeholder='Введите название оборудования'
                    value={equipment.title}
                    onChange={(e) => getValue('title', e.target.value)}
                    error={errors.title}
                />
                <NumInput
                    label='Цена (сом)'
                    placeholder='0'
                    value={`${equipment.price}`}
                    onChange={(e) => getValue('price', e)}
                    error={errors.price}
                />
            </div>
            <Toggle checked={equipment.is_active} onChange={(e) => getValue('is_active', e)}>
                Активный
            </Toggle>
        </div>

        <div className='bg-white p-6 px-8 rounded-lg flex flex-col gap-y-3 mt-5'>
            <p className='font-semibold font-inter'>Дополнительная информация</p>
            <div className='flex gap-x-6'>
                <DataPicker
                    label='Срок использования'
                    placeholder='Укажите срок использования'
                    value={equipment.service_date}
                    error={errors.service_date}
                    onChange={e => getValue('service_date', e)}
                />
                <DataPicker
                    label='Гарантия'
                    placeholder='Укажите срок гаранитии'
                    value={equipment.guarantee}
                    error={errors.guarantee}
                    onChange={e => getValue('guarantee', e)}
                />
            </div>
            <Textarea
                label='Описание'
                placeholder='Введите описание'
                value={equipment.description}
                onChange={(e) => getValue('description', e)}
                error={errors.description}
                rows={4}
            />
        </div>

        <div className='flex justify-center'>
            <Button width='200px' onClick={onSubmit}>Создать</Button>
        </div>
    </div>
  )
}

export default CreateEquipment
