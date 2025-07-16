const animalAge = (animal, age) => {
    const ageCase = [
        {
            espece: "chien",
            young: { min: 0, max: 1 },
            adult: { min: 1, max: 7 }
        },
        {
            espece: "chat",
            young: { min: 0, max: 1 },
            adult: { min: 1, max: 10 }
        }
    ];

    const caseData = ageCase.find(entry => entry.espece.toLowerCase() === animal.toLowerCase());

    if (!caseData) return "Inconnu";

    if (age >= caseData.young.min && age < caseData.young.max) {
        return "young";
    } else if (age >= caseData.adult.min && age < caseData.adult.max) {
        return "adult";
    } else {
        return "senior";
    }
};

module.exports = {animalAge}