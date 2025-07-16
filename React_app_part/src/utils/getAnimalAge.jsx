const getAnimalAge = (born) => {
    const today = new Date();
    const birthDate = new Date(born);
    
    let totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12;
    totalMonths += today.getMonth() - birthDate.getMonth();

    return totalMonths <= 18 ? `${totalMonths} mois`  : `${today.getFullYear() - birthDate.getFullYear()} an(s)`;
};

export default getAnimalAge