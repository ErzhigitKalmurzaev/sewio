import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { createPortal } from "react-dom";

const TextInputForTable = ({
  id,
  width,
  value = "",
  onChange,
  onSelect,
  placeholder,
  disabled = false,
  suggestions = [],
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const inputRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if(value === '') {
      setInputValue(value);
    }
  }, [value]);

  const handleChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    onChange(e);
  
    if (text.trim() === "") {
      setFilteredSuggestions([]);
      return;
    }
  
    const filtered = suggestions
      .filter((item) => item.title.toLowerCase().includes(text.toLowerCase()))
      .slice(0, 5); // Ограничиваем до 5 элементов
  
    setFilteredSuggestions(filtered);
  
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + window.scrollY, left: rect.left, width: rect.width });
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion.title);
    setFilteredSuggestions([]);
    onChange({ target: { value: suggestion.title } });
    onSelect(suggestion.id);
  };

  return (
    <>
      <StyledDiv width={width}>
        <StyledInput
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
        />
      </StyledDiv>

      {filteredSuggestions?.length > 0 &&
        createPortal(
          <SuggestionsList style={{ top: position.top, left: position.left, width: position.width }}>
            {filteredSuggestions.map((suggestion) => (
              <SuggestionItem key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion)}>
                {suggestion.title}
              </SuggestionItem>
            ))}
          </SuggestionsList>,
          document.body // Рендерим в body
        )}
    </>
  );
};

export default TextInputForTable;

// Стили
const StyledDiv = styled.div`
  width: ${(props) => props.width || "100%"};
  position: relative;
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  background: white;
  height: 32px;
  border: 1px solid rgba(208, 213, 221, 1);
  width: 100%;
  outline: none;
  padding: 0 10px;
  border-radius: 5px;
  font-size: 15px;

  &:focus {
    border-color: #2F4F4F;
  }
`;

const SuggestionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid rgba(208, 213, 221, 1);
  border-radius: 5px;
  position: absolute;
  background: white;
  z-index: 9999; // Поверх таблицы
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.li`
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;

  &:hover {
    background: #f0f0f0;
  }

  &:last-child {
    border-bottom: none;
  }
`;
