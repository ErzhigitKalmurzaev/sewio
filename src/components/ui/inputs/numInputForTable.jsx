import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';

const NumInputForTable = ({ label, id, width, value = "", onChange, placeholder, required, error, errorTitle, disabled = false, max = 10000000000000 }) => {
  
  const formatNumber = (num) => {
    // Преобразуем num в строку (если он не строка)
    let strNum = String(num || '');

    // Убираем все символы, кроме цифр и точки
    strNum = strNum.replace(/[^0-9.]/g, '');

    // Разбиваем на целую и дробную части
    let [integerPart, decimalPart] = strNum.split('.');

    // Если больше одной точки — оставляем только первую
    if (strNum.split('.').length > 2) {
      integerPart = strNum.slice(0, strNum.indexOf('.'));
      decimalPart = strNum.slice(strNum.indexOf('.') + 1).replace(/\./g, '');
    }

    // Форматируем целую часть числа с пробелами
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    // Обрабатываем случай, когда пользователь вводит только "."
    if (strNum.startsWith('.')) {
      return '0.' + (decimalPart || '');
    }

    return decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart;
  };

  const [inputValue, setInputValue] = useState(formatNumber(value));

  useEffect(() => {
    setInputValue(formatNumber(value));
  }, [value]);

  const handleChange = (e) => {
    let { value } = e.target;

    // Форматируем ввод
    const formattedValue = formatNumber(value);
    setInputValue(formattedValue);

    // Убираем пробелы перед передачей наверх
    if (onChange) {
      onChange(formattedValue.replace(/\s+/g, ''));
    }
  };

  return (
    <StyledDiv width={width}>
      <StyledInput
        id={id}
        name=""
        type="text"
        value={inputValue}
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
  
  &:disabled {
    background-color: #eeeded;
    color: #888;
    cursor: not-allowed;
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
