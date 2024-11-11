import React from 'react';
import styled from '@emotion/styled';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const TelInput = ({ label, id, value = "", onChange, placeholder, required, error, errorTitle }) => {

  return (
    <StyledDiv>
      <label htmlFor={id}>
        {label}
        {required && <span className="required"> *</span>}
      </label>
      <StyledInput
        defaultCountry='kg'
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      <p className='text-redd text-xs font-inter mt-1'>
          {error && (errorTitle ? errorTitle : '(Заполните поле правильно!)')}
      </p>
    </StyledDiv>
  );
};

export default TelInput;

const StyledDiv = styled("div")`
  width: 100%;
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
