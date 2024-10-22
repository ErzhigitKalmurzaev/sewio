import React, { useState } from 'react'
import { DateRangePicker } from 'rsuite';
import { addDays } from 'date-fns';
import 'rsuite/dist/rsuite.min.css';
import { styled } from '@mui/material';

const DateRangePickerInput = () => {

  // const [dateRange, setDateRange] = useState([null, null]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());

  // const handleDateChange = (value) => {
  //   // Оставляем текущий месяц при выборе первой даты
  //   if (!dateRange[0]) {
  //     setCurrentMonth(value[0]);
  //   }

  //   setDateRange(value);
  // };

  return (
    <DatePickerWrapper>
      <DateRangePicker 
        placeholder="Фильтр по дате"
        color='violet'
        calendarSnapping={false}
        showOneCalendar
        block
        placement={'bottomStart'}
        format='dd/MM/yyyy'
        character='-'
        size='lg'
      />
    </DatePickerWrapper>
  )
}

export default DateRangePickerInput

const DatePickerWrapper = styled("div")`
  width: 230px;
  .rs-input-group {
    border-color: '#2F4F4F';
  }
`