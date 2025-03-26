import React from 'react';
import { SelectPicker } from 'rsuite';

const SelectForTable = ({ width, label, placeholder, data, onChange, error, required, labelKey, valueKey, value, searchable = false, disabled = false, colors = false }) => {
  
  return (
    <div className={`${width ? `w-${width}` : 'w-full'} h-[32px] flex flex-col z-0`}>
      <SelectPicker
        data={data || []}
        onChange={(e) => onChange(e)}
        searchable={searchable}
        size='sm'
        style={{ height: '32px', padding: '0' }}
        value={value}
        labelKey={labelKey || 'label'}
        valueKey={valueKey || 'value'}
        placeholder={placeholder}
        disabled={disabled}
        menuMaxHeight={150}
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
    </div>
  );
};

export default SelectForTable;
