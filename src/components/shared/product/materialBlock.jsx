import React, { useEffect } from 'react'
import Input from '../../ui/inputs/input'
import Select from '../../ui/inputs/select'
import { Close } from '@mui/icons-material'
import { dischargeDatas } from '../../../utils/selectDatas/productDatas'
import { useDispatch, useSelector } from 'react-redux'
import { getMateralList } from '../../../store/technolog/material'

const MaterialBlock = ({ material, activeKey, variant = 'create', newOperation, setNewOperation }) => {

  const { materials_list } = useSelector(state => state.material);

  const dispatch = useDispatch();

  const getTitleMaterial = () => {
    return materials_list?.find(item => item?.id === material?.nomenclature)?.title || material?.nomenclature?.title
  }

  const getConsumption = () => {
    return material?.consumables?.find(item => item?.size === activeKey)?.consumption || material?.consumables?.find(item => item?.size?.id === activeKey)?.consumption
  }

  const getWaste = () => {
    return material?.consumables?.find(item => item?.size === activeKey)?.waste || material?.consumables?.find(item => item?.size?.id === activeKey)?.waste
  }

  const deleteMaterial = (data) => {
    setNewOperation({
      ...newOperation,
      op_noms: newOperation.op_noms.filter(item => item.nomenclature !== data?.nomenclature)
    })
  }

  return (
    <div className='w-full flex justify-between items-center gap-x-5 p-2 border border-borderGray rounded-lg relative'>
        <Input disabled={true} type="text" label="Название" placeholder="Название" value={getTitleMaterial()} />
        <Input disabled={true} type="text" label="Росход" placeholder="Росход" value={getConsumption()} />
        <Input disabled={true} type="text" label="Отход" placeholder="Отход" value={getWaste()} />
        <div className='cursor-pointer text-primary hover:text-red transition'>
            <Close className='absolute right-1 top-1' onClick={() => deleteMaterial(material)}/>
        </div>
    </div>
  )
}

export default MaterialBlock
