import React, { useEffect, useRef, useState } from 'react';
import { ReactComponent as SearchIcon } from '../../../assets/icons/search.svg';
import { ReactComponent as Open } from '../../../assets/icons/openedeays.svg';
import { ReactComponent as Close } from '../../../assets/icons/closedeays.svg';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

const Input = ({
  label,
  autoComplete,
  searchicon,
  value = "",
  onChange,
  id,
  width,
  placeholder,
  defaultValue,
  type,
  name,
  eays,
  disabled,
  required,
  searchHandle,
  error,
  height,
  border,
  less,
  className,
  min,
  max,
  errorTitle,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const textFieldRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchicon) {
      searchHandle();
    }
  };

  return (
    <StyledDiv width={width} eays={eays}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <label htmlFor={id} className={className === "notranslate" ? "notranslate" : ''}>
          {label}
          {required && <span className="required"> *</span>}
        </label>
        {/* {error && <Typography color="red" fontSize="12px">{errorTitle}</Typography>} */}
      </Box>
      <div className="wrapicon">
        <div style={{ position: 'absolute', left: 10 }}>
          {searchicon && <SearchIcon onClick={searchHandle} />}
        </div>
        <StyledInput
          ref={textFieldRef}
          min={min}
          max={max}
          border={border}
          searchicon={searchicon}
          height={height}
          error={error}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          id={id}
          disabled={disabled}
          type={isOpen ? 'text' : type || 'password'}
          name={name}
          onKeyDown={handleKeyDown}
          less={less}
          autoComplete={autoComplete}
          className={className}
          readOnly={value === null && !defaultValue}
          {...props}
        />
        {eays &&
          (isOpen ? (
            <Open onClick={() => setIsOpen(!isOpen)} />
          ) : (
            <Close onClick={() => setIsOpen(!isOpen)} />
          ))}
      </div>
      <p className='text-redd text-xs font-inter mt-1'>
          {error && (errorTitle ? errorTitle : '(Заполните поле правильно!)')}
      </p>
    </StyledDiv>
  );
};

export default Input;

const StyledDiv = styled("div")`
  width: ${(props) => props.width || "100%"};
  display: flex;
  flex-direction: column;

  .wrapicon {
    display: flex;
    align-items: center;
    position: relative;
    margin: 0;
    padding: 0;
  }

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

  & > div > svg {
    position: ${(props) => (props.eays ? "absolute" : "relative")};
    left: ${(props) => (props.eays ? "" : "35px")};
    right: ${(props) => (props.eays ? "0" : "")};
  }

  input[type="date" i]::-webkit-calendar-picker-indicator {
    width: 15px;
    height: 15px;
    margin-right: 5px !important;
  }
`;

const StyledInput = styled("input")`
  background: white;
  height: ${(props) => props.height || "35.6px"};
  border: ${(props) => (props.error ? "1px solid red" : "1px solid rgba(208, 213, 221, 1)")};
  border-color: ${(props) => props.border || ""};
  width: 100%;
  outline: none;
  padding: ${(props) => (props.searchicon ? "0px 0 0 40px" : "0px 0 0 10px")};
  margin-top: ${(props) => (props.searchicon ? "0" : "4px")};
  border-radius: 8px;
  color: ${(props) => (props.less ? "red" : "initial")};

  &:focus {
    border: ${(props) => (props.error ? "1px solid red" : "1px solid #2F4F4F")};
  }

  &::placeholder {
    font-weight: 300;
    font-size: 14px;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;
