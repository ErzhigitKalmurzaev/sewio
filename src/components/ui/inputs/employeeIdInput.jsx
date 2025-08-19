import React, { useEffect, useState, useRef } from "react";
import styled from "@emotion/styled";
import { createPortal } from "react-dom";

const EmployeeIdInput = ({ value, onChange, employees, disabled = false }) => {
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const positionRef = useRef({ top: 0, left: 0, width: 0 });

  // Обработчик изменения значения инпута
  useEffect(() => {
    if (value.trim() === "") {
      setEmployee(null);
      setError("");
      setShowTooltip(false);  // Скрываем подсказку, если значение пустое
      return;
    }

    // Поиск сотрудника по ID
    const foundEmployee = employees?.find((emp) => emp?.number?.toString() === value?.trim());
    console.log(employees)
    if (foundEmployee) {
      setEmployee(foundEmployee);
      setError("");
    } else {
      setEmployee(null);
      setError("Не найдено");
    }

    // Позиционирование окна подсказки
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      positionRef.current = { 
        top: rect.bottom + window.scrollY, 
        left: rect.left, 
        width: rect.width 
      };
    }

    // Показываем подсказку, если есть ошибка или сотрудник найден
    if ((employee || error) && isFocused) {
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
  }, [value, employees, employee, error]);

  // Закрытие окна подсказки при потере фокуса
  const handleBlur = () => {
    setTimeout(() => setShowTooltip(false), 200);
    setIsFocused(false);
  };

  // Отображение окна подсказки при фокусе
  const handleFocus = () => {
    if (employee || error) {
      setShowTooltip(true);
    }
    setIsFocused(true);
  };

  return (
    <>
      <StyledInput
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder="Enter ID"
        borderColor={(!disabled && employee) ? "green" : error ? "red" : "rgba(208, 213, 221, 1)"}
      />

      {showTooltip &&
        createPortal(
          <SuggestionBox style={{
            top: positionRef.current.top, 
            left: positionRef.current.left, 
            width: positionRef.current.width, 
            color: '#2F4F4F'
          }}>
            {employee ? `${employee?.name?.length > 9 ? `${employee?.name?.slice(0, 9)}.` : employee?.name} ${employee?.surname?.charAt(0)}.` : error}
          </SuggestionBox>,
          document.body
        )}
    </>
  );
};

export default EmployeeIdInput;

// Стили
const StyledInput = styled.input`
  background: white;
  height: 32px;
  border: 1px solid ${({ borderColor }) => borderColor};
  width: 100%;
  outline: none;
  padding: 0 10px;
  border-radius: 5px;
  font-size: 15px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${({ borderColor }) => borderColor};
  }
  &::placeholder {
    font-weight: 300;
    font-size: 14px;
  }
  &:disabled {
    background-color: #eeeded;
    color: #888;
    cursor: not-allowed;
  }
`;

const SuggestionBox = styled.div`
  position: absolute;
  background: white;
  border: 1px solid rgba(208, 213, 221, 1);
  border-radius: 3px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2px 5px;
  font-size: 13px;
  z-index: 9999;
`;
