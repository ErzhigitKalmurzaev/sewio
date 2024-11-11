import React, { useState } from 'react'
import Input from '../../ui/inputs/input'
import NumInput from '../../ui/inputs/numInput'
import Select from '../../ui/inputs/select'
import { Toggle } from 'rsuite'
import { useSelector } from 'react-redux'
import ShowMaterialActions from '../../../pages/technolog/product/components/shared/showMaterialActions'

const OperationTabs = ({ operation }) => {

  const { rank_list } = useSelector(state => state.rank);
  const { equipment_list } = useSelector(state => state.equipment);
   
  return (
    <div className='flex flex-col gap-y-3'>
        <div className='flex gap-x-3 justify-between'>
            <Input 
                type='text'
                label="Название"
                value={operation.title}
                disabled={true}
            />
            <NumInput
                label="Время"
                value={operation.time || 0}
                disabled={true}
            />
            <NumInput
                label="Стоимость"
                value={operation.price}
                disabled={true}
            />
        </div>
        {
            rank_list && equipment_list &&
            <div className='flex gap-x-3'>
                <Select
                    label='Разряд'
                    data={rank_list}
                    labelKey='title'
                    valueKey='id'
                    value={operation.rank}
                    disabled={true}
                />
                <Select
                    label='Оборудование'
                    data={equipment_list}
                    labelKey='title'
                    valueKey='id'
                    value={operation.equipment}
                    disabled={true}
                />
            </div>
        }
        <div className='my-3'>
            <Toggle 
                checked={operation?.is_active}
                disabled={true}
            >
                Активный
            </Toggle>
        </div>
        <div>
            <ShowMaterialActions operation={operation}/>
        </div>
    </div>
  )
}

export default OperationTabs
