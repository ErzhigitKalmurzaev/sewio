import React, { useState } from 'react';
import styled from '@emotion/styled';
import { DatePicker } from 'rsuite';
import 'rsuite/DatePicker/styles/index.css';

const DataPicker = ({
  width = '100%',
  label,
  id,
  value = '',
  onChange,
  placeholder,
  required,
  error,
  disabled = false,
  errorTitle
}) => {

  const parseDateString = (str) => {
    const [dd, mm, yyyy] = str.split('.');
    if (!dd || !mm || !yyyy) return null;
    const date = new Date(+yyyy, +mm - 1, +dd);
    console.log("Parse: " + date)
    return isNaN(date.getTime()) ? null : date;
  };

  // Локальное значение в Date формате
  const [internalDate, setInternalDate] = useState(() => {
    return value ? parseDateString(value) : null;
  });

  const formatDate = (date) => {
    if (!(date instanceof Date) || isNaN(date)) return '';
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleChange = (date) => {
    if (!date || isNaN(date)) {
      setInternalDate(null);
      onChange('');
    } else {
      const formatted = formatDate(date);
      setInternalDate(date);
      onChange(formatted);
    }
  };
  
  return (
    <StyledDiv width={width}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <DatePicker
        format="dd.MM.yyyy"
        placeholder={placeholder}
        value={internalDate || parseDateString(value)}
        onChange={handleChange}
        disabled={disabled}
        style={{ width: width }}
      />
      {error && (
        <p className="text-redd text-xs font-inter mt-1">
          {errorTitle || '(Заполните поле правильно!)'}
        </p>
      )}
    </StyledDiv>
  );
};

export default DataPicker;

const StyledDiv = styled('div')`
  width: ${(props) => props.width || '100%'};
  display: flex;
  flex-direction: column;
  gap: 4px;

  .required {
    color: red;
    font-weight: 500;
  }

  label {
    color: rgba(52, 64, 84, 1);
    font-size: 13px;
    font-weight: 400;
    font-family: 'Inter';
  }
`;
