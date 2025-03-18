
export const getMonthName = (date) => {
    const month = date?.split("-")[1];

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

export const formatedToDDMMYYYY2 = (date, character = '.') => {
  // Разделяем строку вручную
  const [day, month, year] = date.split('.'); // Предполагается формат DD.MM.YYYY

  // Собираем строку с указанием нужного разделителя
  return `${day}${character}${month}${character}${year}`;
};

export const formatedYYYYMMDD = (date, character = '.') => {
  const [day, month, year] = date.split(character);
  
  // Формируем строку в формате YYYY-MM-DD
  return `${year}-${month}-${day}`;
}

export const formatToLocalString = (dateString) => {
  // Преобразуем строку в объект Date
  const date = new Date(dateString);

  // Возвращаем строку в формате местного времени
  return date.toString();
};

export const getDefaultDateRange = () => {
  const currentDate = new Date();
  const pastMonthDate = new Date();
  const tomorrowDate = new Date();

  pastMonthDate.setMonth(currentDate.getMonth() - 1);
  tomorrowDate.setDate(currentDate.getDate() + 1);

  return {
    from_date: formatedToDDMMYYYY(pastMonthDate, '-'), // Дата месяц назад
    to_date: formatedToDDMMYYYY(tomorrowDate, '-'),    // Завтрашняя дата
  };
};
