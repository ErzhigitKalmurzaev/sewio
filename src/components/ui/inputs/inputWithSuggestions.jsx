import React, { useState, useRef, useEffect } from "react";
import styled from "@emotion/styled";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";

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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const positionRef = useRef({ top: 0, left: 0, width: 0 });

  const { colors_list } = useSelector(state => state.material);

  // Обработчик клика вне инпута и списка
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        listRef.current &&
        !listRef.current.contains(event.target)
      ) {
        setFilteredSuggestions([]);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    onChange(e);

    if (text.trim() === "") {
      setFilteredSuggestions([]);
      setHighlightedIndex(-1);
      return;
    }

    const filtered = suggestions
      ?.filter((item) => item.title.toLowerCase().includes(text.toLowerCase()));

    setFilteredSuggestions(filtered);
    setHighlightedIndex(-1);

    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      positionRef.current = { top: rect.bottom + window.scrollY, left: rect.left, width: rect.width };
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setInputValue(suggestion.title);
    setFilteredSuggestions([]);
    setHighlightedIndex(-1);
    onChange({ target: { value: suggestion.title } });
    onSelect(suggestion.id);
  };

  const handleKeyDown = (e) => {
    if (filteredSuggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) {
        handleSelectSuggestion(filteredSuggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setFilteredSuggestions([]);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const listItem = listRef.current.children[highlightedIndex];
      if (listItem) {
        listItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightedIndex]);

  return (
    <>
      <StyledDiv width={width}>
        <StyledInput
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
        />
      </StyledDiv>

      {filteredSuggestions.length > 0 &&
        createPortal(
          <SuggestionsList ref={listRef} style={{ top: positionRef.current.top, left: positionRef.current.left, width: positionRef.current.width }}>
            {filteredSuggestions.map((suggestion, index) => (
              <SuggestionItem
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className={highlightedIndex === index ? "highlighted" : ""}
              >
                <span>{suggestion.title}</span>
                <span style={suggestion?.color ? { color: colors_list?.find(color => color.id === suggestion?.color).code } : { color: 'gray'}}>
                  {suggestion?.id ? suggestion?.id : ''}
                </span>
              </SuggestionItem>
            ))}
          </SuggestionsList>,
          document.body
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
  &::placeholder {
    font-weight: 300;
    font-size: 14px;
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
  z-index: 9999;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  max-height: 150px;
  overflow-y: auto;
`;

const SuggestionItem = styled.li`
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  background: ${({ className }) => (className === "highlighted" ? "#f0f0f0" : "white")};

  &:hover,
  &.highlighted {
    background: #f0f0f0;
  }

  &:last-child {
    border-bottom: none;
  }
`;
