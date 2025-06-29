import * as Yup from "yup";

const generateAnimalNumberSchema = (animalCase) => {
  const shape = {};

  animalCase.forEach((label) => {
    if (label !== "Pas encore" && label !== "Autre") {
      shape[label] = Yup.number()
        .required(`Vous devez indiquer un nombre de ${label}`)
        .typeError(`Le nombre de ${label} doit être un chiffre`)
        .min(1, `Vous devez indiquer au moins un ${label}`)
    }
  });

  return Yup.object().shape(shape);
};

export default generateAnimalNumberSchema;