import React, { useMemo } from 'react'
import { SelectPicker } from 'rsuite'

const Select = ({ width, label, placeholder, data, onChange, error, required, labelKey, valueKey, value, searchable = false, disabled = false, props }) => {
 
  const memoizedData = useMemo(() => data || [], [data]);
  
  return (
    <div className={`${width ? `w-[${width}]` : 'w-full'} flex flex-col gap-y-1 z-0 position-relative overflow-visible`}>
        <label style={{ fontSize: '13px', fontFamily: 'Inter', fontWeight: '400', color: 'rgba(52, 64, 84, 1)'}}>
          {label} 
          {required && <span style={ error && { color: 'red' }}> *</span>}
        </label>
        <SelectPicker
            data={memoizedData || []}
            onChange={(e) => onChange(e)}
            searchable={searchable}
            size='md'
            value={value}
            labelKey={labelKey ? labelKey : 'label'}
            valueKey={valueKey ? valueKey : 'value'}
            placeholder={placeholder}
            disabled={disabled}
            virtualized={false}
        />
        <p className='text-redd text-xs font-inter'>
          {error && '(Заполните поле правильно!)'}
        </p>
    </div>
  )
}

export default Select
