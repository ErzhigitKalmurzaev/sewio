import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const NumInputForTable = ({ label, id, width, value = "", onChange, placeholder, required, error, errorTitle, disabled = false, max = 10000000000000 }) => {
  
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    if(value === '') {
      setInputValue(value);
    }
  }, [value]);

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
    <StyledDiv width={width}>
      <StyledInput
        id={id}
        name=''
        type="text"
        value={inputValue || value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        max={max}
      />
      <p className='text-redd text-xs font-inter mt-1'>
          {error && (errorTitle ? errorTitle : '(Заполните поле правильно!)')}
      </p>
    </StyledDiv>
  );
};

export default NumInputForTable;

const StyledDiv = styled("div")`
  width: ${(props) => props.width || "100%"};
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled("input")`
  background: white;
  height: 32px;
  border: 1px solid rgba(208, 213, 221, 1);
  width: 100%;
  outline: none;
  padding: 0 10px;
  border-radius: 5px;
  font-size: 15px;

  &::placeholder {
    font-weight: 300;
    font-size: 14px;
  }

  @media screen and (max-width: 1000px) {
    &::placeholder {
      font-weight: 300;
      font-size: 13px;
    }
  }
  &:focus {
    border-color: #2F4F4F;
  }
`;
