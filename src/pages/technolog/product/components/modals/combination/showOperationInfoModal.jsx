import React, { useEffect, useState } from 'react'
import { Modal, Toggle } from 'rsuite'
import { useDispatch, useSelector } from 'react-redux'
import Input from '../../../../../../components/ui/inputs/input';
import NumInput from '../../../../../../components/ui/inputs/numInput';
import Select from '../../../../../../components/ui/inputs/select';
import MaterialBlock from '../../../../../../components/shared/product/materialBlock';

const ShowOperationModal = ({ modals, setModals, operation }) => {

  const { rank_list } = useSelector(state => state.rank)
  const { equipment_list } = useSelector(state => state.equipment)


//   const reductPostData = (datas) => {
//     let data = {...datas}
//     let ops = data.op_noms.map(op => 
//         op.id ? (
//             {
//                 consumables: op.consumables.map(item => ({
//                     size: item.size.id,
//                     consumption: item.consumption,
//                     waste: item.waste
//                 })),
//                 nomenclature: op.nomenclature.id
//             }
//         ) : op
//     )
//     data = {
//         ...data,
//         op_noms: ops
//     }
//   }

  return (
    <Modal open={modals.operation} onClose={() => setModals({ ...modals, operation: false})} size='lg' overflow={true}>
        <form>
          <Modal.Header>
            <Modal.Title>Информация об операции</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <div className='flex flex-col gap-y-3'>
                  <div className='flex gap-x-3 justify-between'>
                    <Input 
                      name="title"
                      type='text'
                      label="Название"
                      placeholder="Введите название"
                      value={operation.title}
                      disabled={true}
                    />
                    <NumInput
                      label="Время"
                      placeholder="Введите время"
                      value={operation.time}
                    />
                    <NumInput
                      label="Стоимость"
                      placeholder="Введите стоимость"
                      value={operation.price}
                    />
                  </div>
                  <div className='flex gap-x-3'>
                    <Select
                      label='Разряд'
                      placeholder='Выберите разряд' 
                      data={rank_list} 
                      value={operation.rank}
                      labelKey='title'
                      valueKey='id' 
                    />
                    <Select
                      label='Оборудование'
                      placeholder='Выберите оборудование' 
                      data={equipment_list} 
                      value={operation.equipment}
                      labelKey='title'
                      valueKey='id' 
                    />
                  </div>
                  <div className='my-3'>
                    <Toggle 
                      checked={operation?.is_active}
                      disabled={true}
                    >
                      Активный
                    </Toggle>
                  </div>
              </div>
          </Modal.Body>
        </form>
    </Modal>
  )
}

export default ShowOperationModal
