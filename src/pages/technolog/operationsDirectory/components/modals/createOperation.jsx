import React, { useEffect, useState } from 'react'
import { Modal } from 'rsuite'
import { changeOperationValue, getOperationById, getOperationList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';
import Button from '../../../../../components/ui/button';
import { toast } from 'react-toastify';
import { getEquipmentList } from './../../../../../store/technolog/equipment';
import { getRankList } from '../../../../../store/technolog/rank';
import NumInput from './../../../../../components/ui/inputs/numInput';
import { createOperation, editOperationById } from '../../../../../store/technolog/product';

const CreateOperation = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { equipment_list } = useSelector(state => state.equipment);
  const { rank_list } = useSelector(state => state.rank);

  const [operation, setOperation] = useState({
    title: '',
    equipment: '',
    time: '',
    rank: '',
    price: ''
  })
  const [errors, setErrors] = useState({
    title: false,
    equipment: false,
    time: false,
    rank: false,
    price: false
  })

  useEffect(() => {
    if(!equipment_list) {
        dispatch(getEquipmentList())
    }
    if(!rank_list) {
        dispatch(getRankList())
    }
  }, [modals.id])

  const getValue = (e, name) => {
    if(name === 'rank') {
        setOperation({
            ...operation,
            [name]: e,
            price: rank_list.find(item => item.id === e)?.percent * Number(operation.time)
        })
    } else if(name === 'time') {
        setOperation({
            ...operation,
            [name]: e,
            price: rank_list.find(item => item.id === operation.rank)?.percent * e
        })
    } else {
        setOperation({
            ...operation,
            [name]: e
        })
    }
  }

  const validateField = () => {
    const newErrors = {
        title: !operation.title,
        equipment: !operation.equipment,
        price: !operation.price,
        time: !operation.time,
        rank: !operation.rank
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some(Boolean);
  }

  const onSubmit = () => {
    if(validateField()) {
        dispatch(createOperation({
            ...operation,
            is_sample: true
        }))
            .then(res => {
                if(res?.meta?.requestStatus === 'fulfilled') {
                    dispatch(getOperationList({ search: '' }))
                    toast.success("Операция создана!")
                    setModals({ ...modals, operation: false })
                    setOperation({
                        title: '',
                        equipment: '',
                        time: '',
                        rank: '',
                        price: ''
                    })
                } else {
                    toast.error("Произошла ошибка!")
                }
            })
    } else {
        toast.error("Заполните все поля!")
    }
  }


  return (
    <Modal open={modals?.operation} onClose={() => setModals({ ...modals, operation: false })}>
        <Modal.Header>
            <Modal.Title>Создание операции</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='flex flex-col gap-y-3'>
                <div className='flex gap-x-3'>
                    <Input
                        label='Название'
                        type='text'
                        placeholder='Введите название'
                        value={operation?.title}
                        onChange={(e) => getValue(e.target.value, 'title')}
                        error={errors?.title}
                    />

                    <Select
                        label='Оборудование'
                        data={equipment_list}
                        value={operation?.equipment}
                        onChange={(e) => getValue(e, 'equipment')}
                        error={errors?.equipment}
                        searchable
                        placeholder='Выберите оборудование'
                        labelKey={'title'}
                        valueKey={'id'}
                    />
                </div>

                <div className='flex gap-x-3'>
                    <NumInput
                        label='Время (сек)'
                        placeholder='0'
                        value={`${operation?.time}`}
                        onChange={(e) => getValue(e, 'time')}
                        error={errors?.time}
                    />
                    <Select
                        label='Разряд'
                        data={rank_list}
                        value={operation?.rank}
                        onChange={(e) => getValue(e, 'rank')}
                        error={errors?.rank}
                        placeholder='Выберите разряд'
                        labelKey={'title'}
                        valueKey={'id'}
                    />
                    <NumInput
                        label='Цена'
                        placeholder='0'
                        value={`${operation?.price}`}
                        onChange={(e) => getValue(e, 'price')}
                        error={errors?.price}
                    />
                </div>

            </div>
        </Modal.Body>
        <Modal.Footer>
            <div className='flex justify-end'>
                <Button onClick={onSubmit}>
                    Сохранить
                </Button>
            </div>
        </Modal.Footer>
    </Modal>
  )
}

export default CreateOperation
