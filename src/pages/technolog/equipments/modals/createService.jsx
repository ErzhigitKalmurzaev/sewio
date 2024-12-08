import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import Input from '../../../../components/ui/inputs/input'
import { useDispatch, useSelector } from 'react-redux';
import { createEquipment, postEquipmentService } from '../../../../store/technolog/equipment';
import { toast } from 'react-toastify';
import Button from '../../../../components/ui/button';
import { getStaffList } from '../../../../store/technolog/staff';
import Select from '../../../../components/ui/inputs/select';
import NumInput from '../../../../components/ui/inputs/numInput';
import SelectUser from '../../../../components/ui/inputs/selectUser';
import { useParams } from 'react-router-dom';

const CreateService = ({ modals, setModals, setUpdate }) => {

  const dispatch = useDispatch();

  const { staff_list } = useSelector(state => state.staff);
  const { id } = useParams();

  const [service, setService] = useState({
      staff: '',
      text: '',
      price: ''
    });
  const [errors, setErrors] = useState({
      staff: false,
      text: false,
      price: false
  });

  useEffect(() => {
    dispatch(getStaffList({ urls: {search: '', role: '', is_active: ''} }))
  }, [])

  const getValue = (name, value) => {
    setService({
      ...service,
      [name]: value
    })
  }

  const validateFields = () => {
    const newErrors = {
      staff: !service.staff,
      text: !service.text,
      price: !service.price
    };
    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  }

  const onSubmit = () => {
    if(validateFields()) {
      dispatch(postEquipmentService({ 
        equipment: Number(id), 
        price: Number(service.price),
        ...service
      })).then((res) => {
        if(res.meta.requestStatus === 'fulfilled') {
          toast.success('Обслуживание успешно создано!');
          setUpdate(true);
          setModals({ ...modals, create_service: false });
          setService({
            staff: '',
            text: '',
            price: ''
          });
        } else {
          toast.error('Произошла ошибка!');
        }
      })
    } else {
      toast.error('Заполните все поля!');
    }
  }

  return (
    <Modal open={modals.create_service} onClose={() => setModals({ ...modals, create_service: false })}>
      <Modal.Header>
        <Modal.Title>Создание обслуживания</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='flex flex-col gap-y-4 px-3 my-4'>
            <SelectUser
                label='Ответственный'
                name='staff'
                placeholder='Выберите ответственного'
                error={errors.staff}
                onChange={(e) => getValue('staff', e)}
                data={staff_list}
                searchable={true}
                valueKey='id'
                labelKey='name'
            />
            <Input
                label='Тип обслуживания'
                name='title'
                placeholder='Введите тип'
                type='text'
                error={errors.text}
                onChange={(e) => getValue('text', e.target.value)}
            />
            <NumInput
                label='Стоимость'
                name='price'
                placeholder='Введите стоимость'
                error={errors.price}
                value={service.price}
                onChange={(e) => getValue('price', e)}
            />
        </div>
      </Modal.Body>
      <Modal.Footer>
          <div className='flex justify-center gap-x-5'>
              <Button variant='white' width='200px' onClick={() => setModals({ ...modals, create_service: false })}>
                  Отмена
              </Button>
              <Button width='200px' onClick={onSubmit}>
                  Создать
              </Button>
          </div>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateService
