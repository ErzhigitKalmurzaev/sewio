import React, { useState, useEffect, useMemo } from 'react';
import { SelectPicker } from 'rsuite';

const Select = ({ width, label, placeholder, data, onChange, error, required, labelKey, valueKey, value = '', size = 'md', searchable = false, disabled = false, colors = false }) => {
  const [delayedData, setDelayedData] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayedData(data || []);
    }, 100); // Увеличили таймаут для стабильности
    return () => clearTimeout(timeout);
  }, [data]);

  return (
    <div className={`flex flex-col gap-y-1`} style={{ width: width || '100%' }}>
      <label style={{ fontSize: '13px', fontFamily: 'Inter', fontWeight: '400', color: 'rgba(52, 64, 84, 1)'}}>
        {label} 
        {required && <span style={ error && { color: 'red' }}> *</span>}
      </label>
      <SelectPicker
        data={delayedData}
        onChange={(e) => onChange(e)}
        searchable={searchable}
        size={size}
        value={(value === undefined || isNaN(value)) ? null : value}
        labelKey={labelKey || 'label'}
        valueKey={valueKey || 'value'}
        placeholder={placeholder}
        disabled={disabled}
        menuMaxHeight={150}  
        virtualized={false} // ✅ Отключает виртуализацию
        menuClassName="custom-menu-class"
        renderMenuItem={(label, item) => (
          <div className="flex items-center gap-2">
            {colors && (
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: item?.code }}
              />
            )}
            <span>{label}</span>
          </div>
        )}
      />
      <p className='text-redd text-xs font-inter'>
        {error && '(Заполните поле правильно!)'}
      </p>
    </div>
  );
};

export default Select;
