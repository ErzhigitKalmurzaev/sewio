import React from 'react'
import { SelectPicker } from 'rsuite'

const Select = ({ width, label, placeholder, data, onChange, error, required }) => {
  return (
    <div className={`${width ? `w-${width}` : 'w-full'} flex flex-col gap-y-1 z-0`}>
        <label style={{ fontSize: '13px', fontFamily: 'Inter', fontWeight: '400', color: 'rgba(52, 64, 84, 1)'}}>
          {label} 
          {required && <span style={ error && { color: 'red' }}> *</span>}
        </label>
        <SelectPicker
            data={data}
            onChange={(e) => onChange(e)}
            searchable={false}
            size='md'
            placeholder={placeholder}
        />
        <p className='text-red text-xs font-inter'>
          {error && '(Заполните поле правильно!)'}
        </p>
    </div>
  )
}

export default Select
