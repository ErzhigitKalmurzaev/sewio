import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import { changeOperationValue, getOperationById, getOperationList } from '../../../../../store/technolog/operations';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../../../../components/ui/inputs/input';
import Select from '../../../../../components/ui/inputs/select';
import Button from '../../../../../components/ui/button';
import { toast } from 'react-toastify';
import { getEquipmentList } from './../../../../../store/technolog/equipment';
import { getRankList } from '../../../../../store/technolog/rank';
import NumInput from './../../../../../components/ui/inputs/numInput';
import { editOperationById } from '../../../../../store/technolog/product';
import { ShieldAlert } from 'lucide-react';
import { roundTo } from '../../../../../utils/functions/numFuncs';

const OperationOpenModal = ({ modals, setModals }) => {

  const dispatch = useDispatch();

  const { operation, operation_status, folders_list } = useSelector(state => state.operation);
  const { equipment_list } = useSelector(state => state.equipment);
  const { rank_list } = useSelector(state => state.rank);

  const [changed, setChanged] = useState(false);
  const [errors, setErrors] = useState({
    title: false,
    equipment: false,
    time: false,
    rank: false,
    price: false
  })

  useEffect(() => {
    if(modals.id) {
        dispatch(getOperationById({ id: modals.id }))
    }
    if(!equipment_list) {
        dispatch(getEquipmentList())
    }
    if(!rank_list) {
        dispatch(getRankList())
    }
  }, [modals.id])

  const getValue = (e, name) => {
    if(name === 'rank') {
        dispatch(changeOperationValue({ name, value: e }))
        dispatch(changeOperationValue({ name: 'price', value: roundTo(rank_list.find(item => item.id === e)?.percent * operation.time, 2) }))
        
    } else if(name === 'time') {
        dispatch(changeOperationValue({ name, value: e }))
        dispatch(changeOperationValue({ name: 'price', value: roundTo(rank_list.find(item => item.id === (operation.rank?.id || operation.rank))?.percent * e, 2) }))
    } else {
        dispatch(changeOperationValue({ name, value: e }))
    }
    setChanged(true);
    dispatch(changeOperationValue({ name, value: e }))
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
        dispatch(editOperationById({ id: modals.id, props: {
            ...operation,
            rank: operation?.rank?.id || operation?.rank,
            equipment: operation?.equipment?.id || operation?.equipment
        }}))
            .then(res => {
                if(res?.meta?.requestStatus === 'fulfilled') {
                    dispatch(getOperationList({ search: '' }))
                    toast.success("Изменения сохранены")
                    setModals({ ...modals, operation: false })
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
        {
            operation_status === 'loading' && <p>Loading...</p>
        }
        {
            operation_status === 'success' && (
                <>
                    <Modal.Header>
                        <Modal.Title>Операция: {operation?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='flex flex-col gap-y-3'>
                            <div className='flex gap-x-3'>
                                <Input
                                    label='Название'
                                    type='text'
                                    value={operation?.title}
                                    onChange={(e) => getValue(e.target.value, 'title')}
                                    error={changed && !operation?.title}
                                />

                                <Select
                                    label='Оборудование'
                                    data={equipment_list}
                                    value={operation?.equipment?.id || operation?.equipment}
                                    onChange={(e) => getValue(e, 'equipment')}
                                    error={changed && errors?.equipment}
                                    searchable
                                    placeholder='Выберите оборудование'
                                    labelKey={'title'}
                                    valueKey={'id'}
                                />
                            </div>

                            <div className='flex gap-x-3'>
                                <NumInput
                                    label='Время (сек)'
                                    value={`${operation?.time}`}
                                    onChange={(e) => getValue(e, 'time')}
                                    error={changed && errors?.time}
                                />
                                <Select
                                    label='Разряд'
                                    data={rank_list}
                                    value={operation?.rank?.id || operation?.rank}
                                    onChange={(e) => getValue(e, 'rank')}
                                    error={changed && errors?.rank}
                                    placeholder='Выберите разряд'
                                    labelKey={'title'}
                                    valueKey={'id'}
                                />
                                <NumInput
                                    label='Цена'
                                    value={`${operation?.price}`}
                                    onChange={(e) => getValue(e, 'price')}
                                    error={changed && errors?.price}
                                />
                            </div>
                            <Toggle 
                                checked={operation?.is_active}
                                onChange={(e) => getValue(e, 'is_active')}
                            >
                                Активный
                            </Toggle>

                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className='flex justify-end'>
                            {
                                changed ? 
                                    <Button onClick={onSubmit}>
                                        Сохранить
                                    </Button>
                                    :
                                    <Button onClick={() => setModals({ ...modals, operation: false })}>
                                        Закрыть
                                    </Button>
                            }
                        </div>
                    </Modal.Footer>
                </>
            )
        }
        {
            operation_status === 'error' && 
            <div className='flex flex-col justify-center items-center gap-y-1 py-4'>
                <ShieldAlert color='red' size={30}/>
                <p className='font-inter text-redd'>Произошла ошибка!</p>
            </div>
        }
    </Modal>
  )
}

export default OperationOpenModal
