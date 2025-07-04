import React, { useEffect, useState } from 'react'
import Title from '../../../../components/ui/title'
import { useDispatch, useSelector } from 'react-redux';
import MultiImagePicker from '../../../../components/ui/imagePickers/multiImagePicker';
import Input from '../../../../components/ui/inputs/input';
import NumInput from '../../../../components/ui/inputs/numInput';
import DataPicker from '../../../../components/ui/inputs/dataPicker';
import Textarea from '../../../../components/ui/inputs/textarea';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { getEquipmentById, getEquipmentServices, patchEquipment, postEquipment, postEquipmentFiles } from '../../../../store/technolog/equipment';
import Button from '../../../../components/ui/button';
import { formatedToDDMMYYYY, formatedYYYYMMDD } from '../../../../utils/functions/dateFuncs';
import { Toggle } from 'rsuite';
import ServiceTable from '../tables/serviceTable';
import CreateService from '../modals/createService';

const EditEquipment = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { equipment_info, equipment_info_status } = useSelector(state => state.equipment);

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
  const [modals, setModals] = useState({ create_service: false });
  const [update, setUpdate] = useState(false);

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);

  useEffect(() => {
    dispatch(getEquipmentById({ id }))
      .then(({ payload }) => {
        setExistingImages(payload.images);
        setEquipment({
          title: payload.title,
          price: `${payload.price}`,
          description: payload.description,
          is_active: payload.is_active,
          service_date: formatedToDDMMYYYY(payload.service_date, '.'),
          guarantee: formatedToDDMMYYYY(payload.guarantee, '.')
        })
      })
  }, [id, update]);
  
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
        service_date: !equipment.service_date,
        guarantee: !equipment.guarantee
      };
  
      setErrors(newErrors);
  
      // Return true if no errors
      return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
        dispatch(patchEquipment({
            id: Number(id),
            props: {
                ...equipment,
                service_date: formatedYYYYMMDD(equipment.service_date, '.'),
                guarantee: formatedYYYYMMDD(equipment.guarantee, '.'),
            }
        }))
            .then(res => {
                if(res.meta.requestStatus === 'fulfilled') {
                    dispatch(postEquipmentFiles({
                        equipment_id: res.payload.id,
                        images: images.map(image => image.blobFile),
                        delete_ids: deleteImages
                    })).then(res => {
                        if(res.meta.requestStatus === 'fulfilled') {
                            toast.success('Оборудование успешно изменено!');
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
            <Title text="Редактирование оборудования" />
            <Button width='120px' onClick={onSubmit}>Сохранить</Button>
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
            <p className='font-semibold font-inter mb-2'>Дополнительная информация</p>
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

        <div className='bg-white p-6 px-8 rounded-lg flex flex-col gap-y-3 mt-5'>
            <div className='flex justify-between items-center'>
                <p className='font-semibold font-inter mb-2'>История обслуживания</p>
                <Button width='120px' onClick={() => setModals({ ...modals, create_service: true })}>+ Добавить</Button>
            </div>
            
            <div>
                <ServiceTable
                    data={equipment_info?.services}
                    status={equipment_info_status}
                />
            </div>
        </div>
        <CreateService
            modals={modals}
            setModals={setModals}
            setUpdate={setUpdate}
        />
    </div>
  )
}

export default EditEquipment
