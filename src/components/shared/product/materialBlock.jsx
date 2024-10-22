import React from 'react'
import Input from '../../ui/inputs/input'
import Select from '../../ui/inputs/select'
import { Close } from '@mui/icons-material'
import { dischargeDatas } from '../../../utils/selectDatas/productDatas'

const MaterialBlock = ({ material }) => {
  return (
    <div className='w-full flex justify-between items-center gap-x-5 p-2 border border-borderGray rounded-lg relative'>
        <Input disabled={true} type="text" label="Название" placeholder="Название" value={material.material.name} />
        <Input disabled={true} type="text" label="Росход" placeholder="Росход" value={material.consumption} />
        <Input disabled={true} type="text" label="Отход" placeholder="Отход" value={material.waste} />
        <Select label="Единица измерения" value={material.unit} data={dischargeDatas} />
        <div className='cursor-pointer text-primary hover:text-red transition'>
            <Close className='absolute right-0 top-0' />
        </div>
    </div>
  )
}

export default MaterialBlock
