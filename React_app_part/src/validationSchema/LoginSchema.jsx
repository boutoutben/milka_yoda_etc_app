import * as Yup from "yup"

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required("L'e-mail est requis.")
       .email("Adresse e-mail invalide."),
       

    password: Yup.string() 
        .required("Le mot de passe est requis.")
       .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
       .max(30, "Le mot de passe ne doit pas dépasser 30 caractères.")
       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Le mot de passe n'est pas conforme."),
});

export default loginSchema