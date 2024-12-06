
export const getMonthName = (date) => {
    const month = date.split("-")[1];

    const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
      ];

    return months[month-1]
}

export const formatedToDDMMYYYY = (date, character = '.') => {
  const newDate = new Date(date);

  // Форматируем дату в нужный формат
  const formattedDate = newDate.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  });

  // Заменяем точки на указанный символ, если он задан
  return formattedDate.replace(/\./g, character);
};

export const formatToLocalString = (dateString) => {
  // Преобразуем строку в объект Date
  const date = new Date(dateString);

  // Возвращаем строку в формате местного времени
  return date.toString();
};

export const getDefaultDateRange = () => {
  const currentDate = new Date();
  const pastMonthDate = new Date();
  
  pastMonthDate.setMonth(currentDate.getMonth() - 1);
  
  return {
    from_date: formatedToDDMMYYYY(pastMonthDate, '-'), // Формат dd-MM-yyyy
    to_date: formatedToDDMMYYYY(currentDate, '-'),     // Формат dd-MM-yyyy
  };
};