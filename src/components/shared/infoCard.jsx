import React from 'react'

import CircularWithValueLabel from '../ui/circularProgressWithLabel';
import { CircleDollarSign } from 'lucide-react';

import { getMonthName } from '../../utils/functions/dateFuncs'
import { formatNumber } from '../../utils/functions/numFuncs'

const InfoCard = ({ title, value, plan, plan_status, icon, date }) => {

  return (
    <div className='w-1/4 border border-gray bg-white p-4 rounded-lg shadow'>
        {
            plan_status ? 
                <div className='flex justify-between items-start'>
                    <div className='flex flex-col gap-y-3'>
                        <span className='flex flex-col gap-0'>
                            <p className='text-sm font-semibold font-inter text-fprimary'>{title + ' (план)'}</p>
                            <p className='text-lg font-semibold font-inter text-sprimary'>{formatNumber(value) + ' сом'}</p>
                        </span>
                        <span className='flex flex-col gap-0'>
                            <p className='text-sm font-semibold font-inter text-fprimary'>{title + ' (факт)'}</p>
                            <p className='text-lg font-semibold font-inter text-sprimary'>{formatNumber(plan) + ' сом'}</p>
                        </span>
                    </div>
                    <div className='flex flex-col justify-between gap-y-12'>
                        <div>
                            <p className='text-sm font-bold font-inter text-fprimary'>{getMonthName(date.from_date)}</p>
                        </div>
                        <div>
                            <CircularWithValueLabel progress={(Math.floor((value * 100) / plan) || 0)}/>
                        </div>
                    </div>
                </div>
                :
                <div className='flex justify-between items-end'>
                    <div className='flex flex-col gap-y-5'>
                        <p className='text-base font-semibold font-inter text-fprimary'>{title}</p>
                        <p className='text-xl font-semibold font-inter text-sprimary'>{formatNumber(value) + ' сом'}</p>
                        <p className='text-xs font-medium font-inter text-fprimary'>
                            {'От: ' + date?.from_date + ' До: ' + date?.to_date}
                        </p>
                    </div>
                    <div className='w-[40px] h-[40px] bg-slate-100 flex justify-center items-center rounded-md shadow'>
                        {icon}
                    </div>
                </div>
        }
    </div>
  )
}

export default InfoCard
