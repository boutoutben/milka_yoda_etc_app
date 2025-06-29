import * as Yup from "yup"

const resetPasswordSchema = Yup.object().shape({
    password: Yup.string() 
        .required("Le mot de passe est requis.")
       .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
       .max(30, "Le mot de passe ne doit pas dépasser 30 caractères.")
       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Le mot de passe n'est pas conforme."),

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
});

export default resetPasswordSchema;