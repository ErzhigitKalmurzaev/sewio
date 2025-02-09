import React, { useState } from 'react';
import styled from '@emotion/styled';

const TextInputForTable = ({ label, id, width, value = "", onChange, placeholder, required, error, errorTitle, disabled = false }) => {
  const [inputValue, setInputValue] = useState(value);


  return (
    <StyledDiv width={width}>
      <StyledInput
        id={id}
        name=''
        type="text"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
      <p className='text-redd text-xs font-inter mt-1'>
          {error && (errorTitle ? errorTitle : '(Заполните поле правильно!)')}
      </p>
    </StyledDiv>
  );
};

export default TextInputForTable;

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

  &:focus {
    border-color: #2F4F4F;
  }
`;
