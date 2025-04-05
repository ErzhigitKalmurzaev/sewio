
export const formatNumber = (price) => {
    // Преобразуем число в строку и разделяем на целую и дробную части
    const [integerPart, decimalPart] = price?.toString()?.split('.') || [];
    
    // Разделяем целую часть на массив символов
    const priceString = integerPart?.split('');
    
    // Добавляем пробелы через каждые 3 знака
    for (let i = priceString?.length - 3; i > 0; i -= 3) {
      priceString?.splice(i, 0, ' ');
    }
    
    // Собираем целую часть обратно
    const formattedIntegerPart = priceString?.join('');
    
    // Если есть дробная часть, добавляем её к целой, иначе просто возвращаем целую часть
    return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
  }
  

export function formatPhoneNumber(phone) {
    const regex = /^\+996(\d{3})(\d{3})(\d{3})$/;
    return phone?.replace(regex, "+(996) $1 $2 $3");
}

export function roundTo(value, decimals = 0) {
  const factor = Math?.pow(10, decimals) || 0;
  return Math?.round(value * factor) / factor || 0;
}