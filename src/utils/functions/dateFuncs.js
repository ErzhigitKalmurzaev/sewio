
export const getMonthName = (date) => {
    const month = date.split(".")[1];

    const months = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
      ];

    return months[month-1]
}