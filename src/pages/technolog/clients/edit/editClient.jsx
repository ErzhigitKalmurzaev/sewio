import React, { useEffect, useState } from 'react'
import MyBreadcrums from '../../../../components/ui/breadcrums'
import Title from '../../../../components/ui/title'
import SingleImagePicker from '../../../../components/ui/imagePickers/singleImagePicker'
import Input from '../../../../components/ui/inputs/input'
import Button from '../../../../components/ui/button'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import TelInput from '../../../../components/ui/inputs/phoneInput'
import { getRankList } from '../../../../store/technolog/rank'
import { toast } from 'react-toastify'
import { editClientInfo, getClientInfo } from '../../../../store/technolog/client'

const EditClient = () => {

  const breadcrumbs = [
    {
        label: 'Клиенты',
        path: '/clients',
        active: false
    },
    {
        label: 'Редактирование клиента',
        path: '/clients/info',
        active: true
    }
  ]

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getRankList());
    dispatch(getClientInfo(id))
        .then(res => {
            setClient_data({
                name: res.payload?.name,
                surname: res.payload?.surname,
                username: res.payload?.user?.username,
                phone: res.payload?.phone,
                email: res.payload?.email,
                password: res.payload?.password,
                company_title: res.payload?.company_title,
                address: res.payload?.address,
            })
            setImage(res.payload?.image)
        })
  }, [])

  const [client_data, setClient_data] = useState({
    name: '',
    surname: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    company_title: '',
    address: ''
  })
  const [errors, setErrors] = useState({
    name: false,
    surname: false,
    username: false,
    phone: false,
    email: false,
    password: false,
    company_title: false,
    address: false
  })
  const [image, setImage] = useState(null);

  const getValue = (e) => {
    const { name, value } = e.target;
    
    setClient_data({
      ...client_data,
      [name]: value
    })
  }

  const validateFields = () => {
    const newErrors = {
      name: !client_data.name,
      surname: !client_data.surname,
      username: !client_data.username,
      phone: !client_data.phone || !/^\+?\d{10,13}$/.test(client_data.phone),
      email: !client_data.email || !/\S+@\S+\.\S+/.test(client_data.email),
      company_title: !client_data.company_title,
      address: !client_data.address,
    };

    setErrors(newErrors);

    // Return true if no errors
    return !Object.values(newErrors).some((error) => error === true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    if (validateFields()) {
      dispatch(editClientInfo({ id, props: {...client_data, image: image?.blobFile} }))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            toast("Данные клиента успешно изменены!");
            navigate(-1)
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
      <Title text="Редактирование клиента"/>

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
                    value={client_data.name}
                    onChange={getValue}
                  />

                  <Input
                    type='text'
                    name='surname'
                    label='Фамилия'
                    placeholder='Введите имя'
                    error={errors.surname}
                    value={client_data.surname}
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
                    value={client_data.username}
                    onChange={getValue}
                  />

                  <Input
                    label='Пароль'
                    placeholder='********'
                    type='text'
                    name='password'
                    error={errors.password}
                    value={client_data.password}
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
                value={client_data.email}
                onChange={getValue}
              />
              <TelInput
                label='Телефон'
                value={client_data.phone}
                error={errors.phone}
                onChange={e => getValue({ target: { value: e, name: 'phone' } })}
              />
            </div>

            <div className='flex gap-x-6'>
                <Input
                    label='Компания'
                    name='company_title'
                    placeholder='Введите название компании'
                    type='text'
                    value={client_data.company_title}
                    error={errors.company_title}
                    onChange={getValue}
                />
                <Input
                    label='Адрес'
                    name='address'
                    placeholder='Введите адрес'
                    type='text'
                    value={client_data.address}
                    error={errors.address}
                    onChange={getValue}
                />
            </div>
          </div>
        </div>

        <div className='flex justify-center mt-3'>
          <Button className='w-[300px]' type='submit'>Сохранить</Button>
        </div>
      </form>
    </div>
  )
}

export default EditClient
