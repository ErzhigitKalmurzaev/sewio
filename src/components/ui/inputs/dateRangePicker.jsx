import React, { useState } from 'react'
import { DateRangePicker } from 'rsuite';
import { addDays } from 'date-fns';
import 'rsuite/dist/rsuite.min.css';
import { styled } from '@mui/material';
import { formatToLocalString } from '../../../utils/functions/dateFuncs';

const DateRangePickerInput = ({ date, setDate }) => {

  // const [dateRange, setDateRange] = useState([null, null]);
  // const [currentMonth, setCurrentMonth] = useState(new Date());

  // const handleDateChange = (value) => {
  //   // Оставляем текущий месяц при выборе первой даты
  //   if (!dateRange[0]) {
  //     setCurrentMonth(value[0]);
  //   }

  //   setDateRange(value);
  // };


  const dateValues = date.map(dateString => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed
  });

  return (
    <DatePickerWrapper>
      <DateRangePicker 
        placeholder="Фильтр по дате"
        color='violet'
        calendarSnapping={false}
        showOneCalendar
        block
        placement={'bottomStart'}
        format='dd-MM-yyyy'
        character='-'
        size='lg'
        value={dateValues}
        onChange={(value) => setDate(value)}
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