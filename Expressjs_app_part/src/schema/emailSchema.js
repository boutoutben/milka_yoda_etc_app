const Yup = require("yup")

const emailSchema = Yup.object().shape({
    email: Yup.string()
       .email("Adresse e-mail invalide")
       .required("L'e-mail est requis."),
});

module.exports = emailSchema