import * as Yup from 'yup';

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

const registerSchema = Yup.object().shape({
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

    email: Yup.string()
    .required("L'e-mail est requis.")
       .email("Adresse e-mail invalide."),
    
    phone: Yup.string() 
       .matches(/^(\+33\s?|0)[67](\s?\d{2}){4}$/, "Numéro de téléphone invalide."),

       password: Yup.string()
       .required("Le mot de passe est requis.")
       .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
       .max(30, "Le mot de passe ne doit pas dépasser 30 caractères.")
       .matches(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
         "Le mot de passe n'est pas conforme."
       ),
     
     confirmPassword: Yup.string()
       .when('password', (password, schema) => {
         if (!password) {
           return schema.notRequired();
         }
         return schema
            .nullable()
           .required('La confirmation est requise.')
           .oneOf([Yup.ref('password')], 'Les mots de passe doivent correspondre.');
       }),
     
    accept: Yup.boolean()
  .oneOf([true], "Vous devez accepter la condition.")
    
});

export default registerSchema;