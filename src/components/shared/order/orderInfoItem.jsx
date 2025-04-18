import React from 'react'
import { formatNumber } from '../../../utils/functions/numFuncs'

const OrderInfoItem = ({ label, value, measure }) => {
  return (
    <div className='flex flex-col text-center'>
        <p className='text-sm font-semibold font-inter'>{label}</p>
        <p className='text-xl text-primary font-semibold font-inter'>{(measure !== '' && measure !== 'ч.') ? formatNumber(value) : value} {measure}</p>
    </div>
  )
}

export default OrderInfoItem
