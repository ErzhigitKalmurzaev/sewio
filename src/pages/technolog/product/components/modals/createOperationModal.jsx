import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../../components/ui/inputs/input'
import Select from '../../../../../components/ui/inputs/select'
import { useDispatch, useSelector } from 'react-redux'
import { getRankList } from '../../../../../store/technolog/rank'
import { getEquipmentList } from '../../../../../store/technolog/equipment'
import NumInput from '../../../../../components/ui/inputs/numInput'
import MaterialActions from '../shared/materialActions'

const CreateOperationModal = ({ modals, setModals }) => {

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
    setNewOperation({
      ...newOperation,
      [name]: value
    })
  }

  return (
    <Modal open={modals.create} onClose={() => setModals({ ...modals, create: false})} size='lg'>
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
                    <MaterialActions/>
                  </div>
              </div>
          </Modal.Body>
          <Modal.Footer>

          </Modal.Footer>
        </form>
    </Modal>
  )
}

export default CreateOperationModal


// {
//   "title": "string",
//   "time": 2147483647,
//   "price": 999999999,
//   "nomenclature": 0,
//   "equipment": 0,
//   "rank": 0,
//   "is_active": true,
//   "op_noms": [
//     {
//       "nomenclature": 0,
//       "consumables": [
//         {
//           "size": 0,
//           "consumption": 999999999,
//           "waste": 999999999
//         }
//       ]
//     }
//   ]
// }