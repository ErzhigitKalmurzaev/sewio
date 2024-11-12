import React from 'react';
import styled from '@emotion/styled';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { DatePicker } from 'rsuite';

const DataPicker = ({ label, id, value = "", onChange, placeholder, required, error, errorTitle }) => {

    const handleDateChange = (date) => {
        if (date) {
          const formattedDate = date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          onChange(formattedDate); 
        } else {
          onChange(null); 
        }
      };

    return (
        <StyledDiv>
        <label htmlFor={id}>
            {label}
            {required && <span className="required"> *</span>}
        </label>
        <DatePicker
            placeholder={placeholder}
            value={value ? new Date(value.split('.').reverse().join('-')) : null}
            onChange={handleDateChange}
            format="dd.MM.yyyy"
            style={{ width: '100%' }}
        />
        <p className='text-redd text-xs font-inter mt-1'>
            {error && (errorTitle ? errorTitle : '(Заполните поле правильно!)')}
        </p>
        </StyledDiv>
    );
};

export default DataPicker;

const StyledDiv = styled("div")`
  width: 100%;
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
    font-family: "Inter";
  }
`;

const StyledInput = styled(PhoneInput)`
  width: 100%;
  height: 36px;
  background: white;
  outline: none;
  margin-top: 4px;
  border-radius: 5px;
  font-size: 16px;

  &::placeholder {
    font-weight: 300;
    font-size: 14px;
  }

  button {  
    padding: 0 8px;
    border: 1px solid rgba(208, 213, 221, 1);
  }

  input {
    width: 100%;
    border: 1px solid rgba(208, 213, 221, 1) !important;
  }

  &:focus {
    border-color: #2F4F4F;
  }
`;
