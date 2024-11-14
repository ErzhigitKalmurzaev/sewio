
export const getMonthName = (date) => {
    const month = date.split(".")[1];

    const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
      ];

    return months[month-1]
}

export const formatedToDDMMYYYY = (date) => {
  const newDate = new Date(date);

// Форматируем дату в нужный формат
  const formattedDate = newDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  });

  return formattedDate
}