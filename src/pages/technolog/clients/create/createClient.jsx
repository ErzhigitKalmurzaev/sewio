import React, { useEffect, useState } from 'react';
import Title from '../../../../components/ui/title';
import MyBreadcrums from '../../../../components/ui/breadcrums';
import Button from '../../../../components/ui/button';
import SingleImagePicker from '../../../../components/ui/imagePickers/singleImagePicker';
import Input from '../../../../components/ui/inputs/input';

import TelInput from '../../../../components/ui/inputs/phoneInput';
import NumInput from '../../../../components/ui/inputs/numInput';
import { getRankList } from '../../../../store/technolog/rank';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { createClient, createClientFiles } from '../../../../store/technolog/client';
import { Uploader } from 'rsuite';
import { CloudUpload } from 'lucide-react';

const CreateClient = () => {
  const breadcrumbs = [
    { label: 'Клиенты', path: '/clients', active: false },
    { label: 'Создание клиента', path: '/clients/create', active: true },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rank_list } = useSelector(state => state.rank);

  const [employee_data, setEmployee_data] = useState({
    name: '',
    surname: '',
    username: '',
    phone: '',
    password: '',
    company_title: '',
    address: ''
  })
  const [errors, setErrors] = useState({
    full_name: false,
    phone: false,
    password: false,
    company_title: false,
    address: false
  })
  const [image, setImage] = useState(null);
  const [files, setFiles] = useState([])

  useEffect(() => {
    dispatch(getRankList())
  }, [])

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
      username: !employee_data.username,
      phone: !employee_data.phone || !/^\+?\d{10,13}$/.test(employee_data.phone),
      password: employee_data.password.length < 3,
      company_title: !employee_data.company_title,
      address: !employee_data.address,
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateFields()) {
      dispatch(createClient({ ...employee_data, image: image?.blobFile }))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            dispatch(createClientFiles({ 
              client_id: res.payload.id,
              files: files.map(item => item.blobFile),
              delete_ids: []
             }))
              .then(res => {
                if(res.meta.requestStatus === 'fulfilled') {
                  navigate(-1)
                  toast("Клиент создан успешно!")
                }
              })
          } else {
            if(res.payload?.username) {
              toast.error('Пользователь с таким логином уже существует!')
            } else {
              toast.error("Произошла ошибка!")
            }
          }
        })
    } else {
      toast.error("Заполните все поля!")
    }
  };

  return (
    <div className='flex flex-col gap-y-5 mb-5'>
      <MyBreadcrums items={breadcrumbs} />
      <Title text="Создание клиента" />

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
                    value={employee_data?.name}
                    placeholder='Введите имя'
                    error={errors.name}
                    onChange={getValue}
                  />

                  <Input
                    type='text'
                    name='surname'
                    label='Фамилия'
                    value={employee_data?.surname}
                    placeholder='Введите имя'
                    error={errors.surname}
                    onChange={getValue}
                  />
                </div>

                <div className='flex gap-x-6'>
                  <Input
                    label='Логин'
                    name='username'
                    value={employee_data?.username}
                    placeholder='Введите логин'
                    type='text'
                    error={errors.username}
                    onChange={getValue}
                  />

                  <Input
                    label='Пароль'
                    placeholder='********'
                    value={employee_data?.password}
                    type='text'
                    name='password'
                    error={errors.password}
                    onChange={getValue}
                  />
                </div>
              </div>
            </div>

            <div className='flex gap-x-6 items-center'>
              <TelInput
                label='Телефон'
                value={employee_data.phone}
                error={errors.phone}
                onChange={e => getValue({ target: { value: e, name: 'phone' } })}
              />
              <Input
                  label='Компания'
                  name='company_title'
                  value={employee_data?.company_title}
                  placeholder='Введите название компании'
                  type='text'
                  error={errors.company_title}
                  onChange={getValue}
              />
            </div>

            <div className='flex gap-x-6'>
                <Input
                    width='49%'
                    label='Адрес'
                    name='address'
                    value={employee_data?.address}
                    placeholder='Введите адрес'
                    type='text'
                    error={errors.address}
                    onChange={getValue}
                />
            </div>

            <p className='text-base font-semibold'>Файлы</p>
            <div className='w-1/2 flex flex-col'>
                <Uploader fileList={files} onChange={setFiles} autoUpload={false}>
                    <Button>
                        <CloudUpload className='mr-2' size={18}/>
                        Загрузите файл или изображение
                    </Button>
                </Uploader>
            </div>

          </div>
        </div>

        <div className='flex justify-center mt-3'>
          <Button className='w-[300px]' type='submit'>Сохранить</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateClient;
