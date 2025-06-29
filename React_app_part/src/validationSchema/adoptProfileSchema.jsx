import * as Yup from 'yup';
import generateAnimalNumberSchema from './genierateAnimalNumberSchema';

// 1) Basic format: letters + allowed separators + capitalization on first char of words
const basicNameRegex = /^[A-ZÀ-Ÿ][a-zà-ÿ]*(?:[ ’'-][A-Za-zÀ-ÿ]+)*$/;

// 2) Forbidden patterns
const forbiddenPatterns = [
  /\s{2,}/, // double space
  /-{2,}/, // double dash
  /[’']{2,}/, // double apostrophe
  /[^A-Za-zÀ-ÿ’' -]/ // disallowed chars
];

// 3) Allowed lowercase particles
const allowedParticles = ['de', 'du', 'des', 'd', 'la', 'le', 'l'];

function validateName(value) {
  if (!basicNameRegex.test(value)) return false;

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(value)) return false;
  }

  // Split by separators and check words capitalization or allowed particles
  const words = value.split(/[ ’'-]/);

  return words.every((word, index) => {
    if (!word) return false;
    if (index > 0 && allowedParticles.includes(word.toLowerCase())) return true;
    return /^[A-ZÀ-Ÿ][a-zà-ÿ]*$/.test(word);
  });
}

const AdopterProfileSchema = Yup.object().shape({
    civility: Yup.string()
      .required('La civilité est requise.')
        .oneOf(['1', '2', '3'], 'Civilité invalide.'),
  lastname: Yup.string()
    .required("Le nom est requis.")
    .min(3, "Le nom doit comporter au moins 3 caractères.")
    .max(50, "Le nombre maximal de caractères du nom est 50.")
    .test('valid-lastname', 'Format invalide : ex. Dupont ou Legrand-Duval', validateName),
    

  firstname: Yup.string()
  .required("Le prénom est requis.")
    .min(2, "Le prénom doit comporter au moins 2 caractères.")
    .max(50, "Le nombre maximal de caractères du prénom est 50.")
    .test("valid-firstname", "Format invalide : ex. Jean ou Marie-Thérèse", validateName),

    age: Yup.number()
    .typeError("Merci d'entrer un nombre.")
    .required("L'âge est requis.")
    .integer("L'âge doit être un nombre entier.")
    .moreThan(17, "L'âge doit être supérieur à 18 ans"),

  email: Yup.string()
    .required("L'e-mail est requis.")
    .email("Adresse e-mail invalide."),

  phone: Yup.string()
    .required("Téléphone requis.")
    .matches(/^(\+33\s?|0)[67](\s?\d{2}){4}$/, "Numéro de téléphone invalide."),

  adressePostale: Yup.string()
    .required("Le code postal est requis.")
    .matches(/^\d{5}$/, "Le code postal n'est pas conforme."),

  animalPlace: Yup.array()
    .min(1, "Il faut choisir au moins une option"),

  lifeRoutine: Yup.array()
    .min(1, "Il faut choisir au moins une option"),

  animalCase: Yup.array()
    .min(1, "Vous devez choisir au moins une option"),

  haveChildren: Yup.boolean()
    .required("Vous devez indiquer si vous avez des enfants ou non."),

  child: Yup.lazy((value, context) => {
    const haveChildren = context.parent.haveChildren; // Assuming `haveChildren` is a field in the parent form

    if (haveChildren) {
      return Yup.array()
        .of(
          Yup.number()
            .typeError('L\'âge doit être un nombre')
            .required('L\'âge de l\'enfant est requis')
            .min(0, "L'âge doit être supérieur ou égal à 0.")
            
        )
        .min(1, 'Ajoutez au moins un enfant')
        .max(10, 'Le nombre d\'enfant doit être inférieur ou égal à 10.') 
    }

    // If `haveChildren` is false or not present, don't require the `child` field.
    return Yup.array().notRequired();
  }),

  motivation: Yup.string()
    .required("La motivation est requise.")
    .min(10, "La motivation doit contenir au moins 10 caractères.")
    .max(1000, "La motivation ne doit pas dépasser 1000 caractères.")
    .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()%\-:;@#*/\n\r ]+$/, "La motivation contient des caractères non autorisés."),

  animalNumber: Yup.lazy((_, context) => {
    const animalCase = context.parent.animalCase || [];
    return generateAnimalNumberSchema(animalCase);
  }),

  otherAnimals: Yup.lazy((value, context) => {
  const animalCase = context.parent.animalCase || [];
  if (animalCase.includes("Autre")) {
    return Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .required("Le nom de l'animal est requis.")
            .min(3, "Le nom doit comporter au moins 3 caractères.")
            .max(50, "Le nombre maximal de caractères du nom est 50.")
            .matches(/^[A-ZÀ-Ÿ][a-zà-ÿ]*(?:['-][a-zà-ÿ]+)*(?: [A-ZÀ-Ÿ][a-zà-ÿ]*(?:['-][a-zà-ÿ]+)*)*$/, "Format invalide"), // Le nom est requis en tous les cas

          number: Yup.number()
          .required("Le nombre est requis.")
            .typeError("Le nombre doit être un chiffre")
            .min(1, "Le nombre doit être au moins 1.")
            .max(15,"Le nombre doit être inférieur à 15.")
        })
      )
      .min(1, "Ajoutez au moins un animal.");
  }
  return Yup.array().notRequired();
}),

  accept: Yup.boolean()
    .oneOf([true], "Vous devez accepter la condition.")
});

export default AdopterProfileSchema;