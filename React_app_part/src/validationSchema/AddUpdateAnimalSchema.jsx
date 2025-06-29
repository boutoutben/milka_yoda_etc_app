import * as Yup from "yup";
const AddUpdateAnimalSchema = (isRequired=false) => {
    const fileField = Yup.mixed()
        .nullable()
            .test(
                'fileFormat',
                'Votre extension n\'est pas correcte, seuls png, jpg, jpeg, gif, webp sont autorisés.',
                function (file) {
                    if (!file) return true; // Pas de fichier → pas d'erreur (sauf si requis)
                    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                    const extension = file.name.split('.').pop().toLowerCase();
                    return validExtensions.includes(extension);
                }
            )
            .test(
                'fileSize',
                'La taille de votre image est trop grande, elle doit être inférieur 700ko.',
                function (file) {
                    if (!file) return true;
                    return file.size <= 700 * 1024;
                }
            );


    const schema = Yup.object().shape({
        name: Yup.string()
            .required("Le nom de l'animal est requis.")
            .min(3, "Le nom doit comporter au moins 3 caractères.")
            .max(50, "Le nombre maximal de caractères du nom est 50.")
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()%\-:;@#*/\n\r ]+$/, "Format invalide"),
        description: Yup.string()
            .required("La description est requis.")
            .min(30, "La description doit comporter au moins 30 caractères.")
            .max(750, "Le nombre maximal de caractères de la description est 750.")
            .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()%\-:;@#*/\n\r ]+$/, "Format invalide"),
            
        sexe: Yup.number()
            .required("Le sexe est requis."),
        isSterile: Yup.boolean()
            .required("La sterilité est requise."),
        file: isRequired ? fileField.required("L'image est requise.") : fileField,
        animal: Yup.string()
            .required("L'animal est requis."),
        born: Yup.date()
            .required("La date est requise.")
            .max(
                new Date(new Date().setHours(23, 59, 59, 999)),
                "La date de naissance doit être inférieur ou égal à aujourd'hui"
              ),
        races: Yup.array()
            .min(1, 'Il faut au moins une race.')
            .max(6, 'Un animal peut avoir que 6 race maximum.'),
    })
    return schema;
}

export default AddUpdateAnimalSchema;