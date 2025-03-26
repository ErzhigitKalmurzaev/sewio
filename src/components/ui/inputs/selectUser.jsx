import React, { useMemo } from 'react';
import { SelectPicker } from 'rsuite';

const SelectUser = ({ width = '100%', label, placeholder, data, onChange, error, required, labelKey, valueKey, value, searchable = false, disabled = false, className, size = 'md' }) => {
  
  const memoizedData = useMemo(() => data || [], [data]);
  
  return (
    <div className={`flex flex-col gap-y-1 z-0 position-relative overflow-visible ${className}`} style={{ width: width }}>
      <label style={{ fontSize: '13px', fontFamily: 'Inter', fontWeight: '400', color: 'rgba(52, 64, 84, 1)'}}>
        {label} 
        {required && <span style={ error && { color: 'red' }}> *</span>}
      </label>
      <SelectPicker
        data={memoizedData || []}
        onChange={(e) => onChange(e)}
        searchable={searchable}
        size={size}
        value={value}
        labelKey={labelKey ? labelKey : 'label'}
        valueKey={valueKey ? valueKey : 'value'}
        placeholder={placeholder}
        disabled={disabled}
        menuMaxHeight={250}
        renderMenuItem={(label, item) => (
          <div>
            <p className='text-sm font-inter text-fprimary'><span>{item.name}</span> <span>{item.surname}</span></p>
          </div>
        )}
      />
      <p className="text-redd text-xs font-inter">
        {error && '(Заполните поле правильно!)'}
      </p>
    </div>
  );
};

export default SelectUser;
