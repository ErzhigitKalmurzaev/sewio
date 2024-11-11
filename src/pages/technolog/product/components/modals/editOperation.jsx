import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import Input from '../../../../../components/ui/inputs/input'
import Select from '../../../../../components/ui/inputs/select'
import { useDispatch, useSelector } from 'react-redux'
import { getRankList } from '../../../../../store/technolog/rank'
import { getEquipmentList } from '../../../../../store/technolog/equipment'
import NumInput from '../../../../../components/ui/inputs/numInput'
import MaterialActions from '../shared/materialActions'
import { createOperation, editOperationById } from '../../../../../store/technolog/product'
import { toast } from 'react-toastify'
import Button from '../../../../../components/ui/button'
import MaterialActionsEdit from '../shared/materialActionsEdit'

const EditOperationModal = ({ modals, setModals, operation }) => {

  const dispatch = useDispatch();

  const { rank_list } = useSelector(state => state.rank)
  const { equipment_list } = useSelector(state => state.equipment)

  const [editOperation, setEditOperation] = useState({
    title: operation.title,
    time: operation.time,
    price: operation.price,
    equipment: operation.equipment,
    rank: operation.rank,
    is_active: operation.is_active,
    nomenclature: operation.nomenclature,
    op_noms: operation.op_noms
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

//   const getOps = (ops) => {
//     if(!ops) return []
//     return ops.map(op => {
//         (
//             {
//                 consumables: op.consumables.map(item => {({
//                     size: item.size.id,
//                     consumption: item.consumption,
//                     waste: item.waste
//                 })}),
//                 nomenclature: op.nomenclature
//             }
//         )
//     })
//   }

  const getValue = (e) => {
    const { name, value } = e.target;
    if(name === 'price' || name === 'time') {
      setEditOperation({
        ...editOperation,
        [name]: Number(value)
      })
    } else {
        setEditOperation({
        ...editOperation,
        [name]: value
      })
    }
  }

  const validateFields = () => {
    const newErrors = {
      title: !editOperation.title,
      time:  !editOperation.time,
      price: !editOperation.price,
      equipment: !editOperation.equipment,
      rank: !editOperation.rank,
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error === true);
  }

  const reductPostData = (datas) => {
    let data = {...datas}
    let ops = data.op_noms.map(op => 
        op.id ? (
            {
                consumables: op.consumables.map(item => ({
                    size: item.size.id,
                    consumption: item.consumption,
                    waste: item.waste
                })),
                nomenclature: op.nomenclature.id
            }
        ) : op
    )
    data = {
        ...data,
        op_noms: ops
    }
  }

  const onSubmit = () => {
    if(validateFields()) {
      const trueData = reductPostData(editOperation)
      dispatch(editOperationById({ id: operation.id, props: trueData}))
        .then(res => {
          if(res.meta.requestStatus === 'fulfilled') {
            toast("Операция изменена успешно!");
            setModals({ ...modals, create: false })
          }
        })
    } else {
      toast("Заполните все поля!");
    }
  }

  return (
    <Modal open={modals.edit} onClose={() => setModals({ ...modals, edit: false})} size='lg' overflow={true}>
        <form>
          <Modal.Header>
            <Modal.Title>Редактирование операции</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='flex flex-col gap-y-3'>
                  <div className='flex gap-x-3 justify-between'>
                    <Input 
                      name="title"
                      type='text'
                      label="Название"
                      placeholder="Введите название"
                      value={editOperation.title}
                      onChange={getValue}
                      error={errors.title}
                    />
                    <NumInput
                      label="Время"
                      placeholder="Введите время"
                      value={editOperation.time}
                      onChange={e => getValue({ target: { value: e, name: 'time' } })}
                      error={errors.time}
                    />
                    <NumInput
                      label="Стоимость"
                      placeholder="Введите стоимость"
                      value={editOperation.price}
                      onChange={e => getValue({ target: { value: e, name: 'price' } })}
                      error={errors.price}
                    />
                  </div>
                  <div className='flex gap-x-3'>
                    <Select
                      label='Разряд'
                      placeholder='Выберите разряд' 
                      data={rank_list} 
                      value={editOperation.rank}
                      error={errors.rank}
                      labelKey='title'
                      valueKey='id' 
                      onChange={e => getValue({ target: { value: e, name: 'rank' } })}
                    />
                    <Select
                      label='Оборудование'
                      placeholder='Выберите оборудование' 
                      data={equipment_list} 
                      value={editOperation.equipment}
                      error={errors.equipment}
                      labelKey='title'
                      valueKey='id' 
                      onChange={e => getValue({ target: { value: e, name: 'equipment' } })}
                    />
                  </div>
                  <div className='my-3'>
                    <Toggle 
                      checked={editOperation?.is_active}
                      onChange={(e) => getValue({ target: { value: e, name: 'is_active' }})}
                    >
                      Активный
                    </Toggle>
                  </div>
                  <div>
                    <MaterialActionsEdit 
                      newOperation={editOperation} 
                      setNewOperation={setEditOperation}
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

export default EditOperationModal
