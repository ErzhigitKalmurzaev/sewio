import React, { useState } from 'react';
import styled from '@emotion/styled';

const NumInput = ({ label, id, value = "", onChange, placeholder, required, error, errorTitle }) => {
  const [inputValue, setInputValue] = useState(value);

  const formatNumber = (num) => {
    return num.replace(/\D/g, '')
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatNumber(value);
    setInputValue(formattedValue);
    if (onChange) {
      onChange(formattedValue.replace(/\s+/g, ''));
    }
  };

  return (
    <StyledDiv>
      <label htmlFor={id}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <StyledInput
        id={id}
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <p className='text-red text-xs font-inter mt-1'>
          {error && (errorTitle ? errorTitle : '(Заполните поле правильно!)')}
      </p>
    </StyledDiv>
  );
};

export default NumInput;

const StyledDiv = styled("div")`
  display: flex;
  flex-direction: column;
  
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

const StyledInput = styled("input")`
  background: white;
  height: 36px;
  border: 1px solid rgba(208, 213, 221, 1);
  width: 100%;
  outline: none;
  padding: 0 10px;
  margin-top: 4px;
  border-radius: 5px;
  font-size: 16px;

  &::placeholder {
    font-weight: 300;
    font-size: 14px;
  }

  &:focus {
    border-color: #2F4F4F;
  }
`;
