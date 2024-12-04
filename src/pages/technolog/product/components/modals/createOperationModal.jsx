import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../../components/ui/inputs/input'
import Select from '../../../../../components/ui/inputs/select'
import { useDispatch, useSelector } from 'react-redux'
import { getRankList } from '../../../../../store/technolog/rank'
import { getEquipmentList } from '../../../../../store/technolog/equipment'
import NumInput from '../../../../../components/ui/inputs/numInput'
import MaterialActions from '../shared/materialActions'
import { createOperation, getProductById } from '../../../../../store/technolog/product'
import { toast } from 'react-toastify'
import Button from '../../../../../components/ui/button'

const CreateOperationModal = ({ modals, setModals, id_product }) => {

  const dispatch = useDispatch();

  const { rank_list } = useSelector(state => state.rank)
  const { equipment_list } = useSelector(state => state.equipment)

  const [newOperation, setNewOperation] = useState({
    title: '',
    time: '',
    price: '',
    equipment: '',
    rank: '',
    is_active: true,
    nomenclature: Number(id_product),
    op_noms: []
  })
  const [errors, setErrors] = useState({
    title: false,
    time: false,
    price: false,
    equipment: false,
    rank: false,
    is_active: false,
    op_noms: false
  })

  useEffect(() => {
    if(!rank_list) {
      dispatch(getRankList())
    }
    if(!equipment_list) {
      dispatch(getEquipmentList())
    }
  }, [])

  const getValue = (e) => {
    const { name, value } = e.target;
    if(name === 'price' || name === 'time') {
      setNewOperation({
        ...newOperation,
        [name]: Number(value)
      })
    } else {
      setNewOperation({
        ...newOperation,
        [name]: value
      })
    }
  }

  const validateFields = () => {
    const newErrors = {
      title: !newOperation.title,
      time:  !newOperation.time,
      price: !newOperation.price,
      equipment: !newOperation.equipment,
      rank: !newOperation.rank,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error === true);
  }

  const onSubmit = () => {
    if(validateFields()) {
      dispatch(createOperation(newOperation))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            toast("Операция создана успешно!");
            setModals({ ...modals, create: false })
            dispatch(getProductById({ id: id_product }))
          }
        })
    } else {
      toast("Заполните все поля!");
    }
  }

  return (
    <Modal open={modals.create} onClose={() => setModals({ ...modals, create: false})} size='lg' overflow={true}>
        <form>
          <Modal.Header>
            <Modal.Title>Создание операции</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='flex flex-col gap-y-3'>
                  <div className='flex gap-x-3 justify-between'>
                    <Input 
                      name="title"
                      type='text'
                      label="Название"
                      placeholder="Введите название"
                      value={newOperation.title}
                      onChange={getValue}
                      error={errors.title}
                    />
                    <NumInput
                      label="Время"
                      placeholder="Введите время"
                      value={newOperation.time}
                      onChange={e => getValue({ target: { value: e, name: 'time' } })}
                      error={errors.time}
                    />
                    <NumInput
                      label="Стоимость"
                      placeholder="Введите стоимость"
                      value={newOperation.price}
                      onChange={e => getValue({ target: { value: e, name: 'price' } })}
                      error={errors.price}
                    />
                  </div>
                  <div className='flex gap-x-3'>
                    <Select
                      label='Разряд'
                      placeholder='Выберите разряд' 
                      data={rank_list} 
                      error={errors.rank}
                      labelKey='title'
                      valueKey='id' 
                      onChange={e => getValue({ target: { value: e, name: 'rank' } })}
                    />
                    <Select
                      label='Оборудование'
                      placeholder='Выберите оборудование' 
                      data={equipment_list} 
                      error={errors.equipment}
                      labelKey='title'
                      valueKey='id' 
                      onChange={e => getValue({ target: { value: e, name: 'equipment' } })}
                    />
                  </div>
                  <div className='my-3'>
                    <Toggle 
                      checked={newOperation?.is_active}
                      onChange={(e) => getValue({ target: { value: e, name: 'is_active' }})}
                    >
                      Активный
                    </Toggle>
                  </div>
                  <div>
                    <MaterialActions 
                      newOperation={newOperation} 
                      setNewOperation={setNewOperation}
                    />
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>
            <div className='flex justify-center gap-x-10'>
              <Button width='150px' variant='white' onClick={() => setModals({ ...modals, create: false })}>Отмена</Button>
              <Button width='150px' onClick={onSubmit}>Сохранить</Button>
            </div>
          </Modal.Footer>
        </form>
    </Modal>
  )
}

export default CreateOperationModal
