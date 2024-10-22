import React from 'react'

import CircularWithValueLabel from '../ui/circularProgressWithLabel';
import { CircleDollarSign } from 'lucide-react';

import { getMonthName } from '../../utils/functions/dateFuncs'
import { formatNumber } from '../../utils/functions/numFuncs'

const InfoCard = ({ data }) => {
  return (
    <div className='w-1/4 border border-gray bg-white p-4 rounded-lg shadow'>
        {
            data?.plan ? 
                <div className='flex justify-between items-start'>
                    <div className='flex flex-col gap-y-3'>
                        <span className='flex flex-col gap-0'>
                            <p className='text-sm font-semibold font-inter text-fprimary'>{data?.title + ' (план)'}</p>
                            <p className='text-lg font-semibold font-inter text-sprimary'>{formatNumber(data?.planSum) + ' сом'}</p>
                        </span>
                        <span className='flex flex-col gap-0'>
                            <p className='text-sm font-semibold font-inter text-fprimary'>{data?.title + ' (факт)'}</p>
                            <p className='text-lg font-semibold font-inter text-sprimary'>{formatNumber(data?.factSum) + ' сом'}</p>
                        </span>
                    </div>
                    <div className='flex flex-col justify-between gap-y-12'>
                        <div>
                            <p className='text-sm font-bold font-inter text-fprimary'>{getMonthName(data.month)}</p>
                        </div>
                        <div>
                            <CircularWithValueLabel progress={Math.floor((data?.factSum * 100) / data?.planSum)}/>
                        </div>
                    </div>
                </div>
                :
                <div className='flex justify-between items-end'>
                    <div>
                        <span className='flex flex-col gap-y-4'>
                            <p className='text-sm font-semibold font-inter text-fprimary'>{data?.title}</p>
                            <p className='text-xl font-semibold font-inter text-sprimary'>{formatNumber(data?.factSum) + ' сом'}</p>
                            <p className='text-sm font-medium font-inter text-fprimary'>
                                {'От: ' + data?.start_date + ' До: ' + data?.end_date}
                            </p>
                        </span>
                    </div>
                    <div className='w-[40px] h-[40px] bg-slate-100 flex justify-center items-center rounded-md shadow'>
                        <CircleDollarSign color='#E11D48' size={20} />
                    </div>
                </div>
        }
    </div>
  )
}

export default InfoCard
