
export const formatNumber = (price) => {
    const priceString = price?.toString()?.split('');

    for (let i = priceString?.length - 3; i > 0; i -= 3) {
        priceString?.splice(i, 0, ' ');
    }

    return priceString?.join('');
}

export function formatPhoneNumber(phone) {
    const regex = /^\+996(\d{3})(\d{3})(\d{3})$/;
    return phone?.replace(regex, "+(996) $1 $2 $3");
}