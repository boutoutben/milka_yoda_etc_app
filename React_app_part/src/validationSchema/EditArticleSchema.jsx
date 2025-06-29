import * as Yup from "yup";

const EditArticleSchema = Yup.object().shape({
    title: Yup.string()
        .required("Le titre est requis.")
        .min(3, "Le titre doit comporter au moins 3 caractères.")
        .max(50, "Le nombre maximal de caractères du titre est 50.")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()%\-:;@#*/\n\r ]+$/, "Format invalide"),
    description: Yup.string()
      .required("La description est requis.")
        .min(30, "La description doit comporter au moins 30 caractères.")
        .max(750, "Le nombre maximal de caractères de la description est 750.")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()%\-:;@#*/\n\r ]+$/, "Format invalide"),
        file: Yup.mixed()
        .nullable()
        .test(
          'fileFormat',
          "Votre extension n'est pas correcte, seuls png, jpg, jpeg, gif, webp sont autorisés.",
          function (file) {
              if (!file) return true; // Laisse required() gérer l'absence
              const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
              const extension = file.name?.split('.').pop().toLowerCase();
              return validExtensions.includes(extension);
          }
          )
      .test(
          'fileSize',
          `La taille de votre image est trop grande, elle doit être inférieur 700ko.`,
          function (file) {
              if (!file) return true; // Laisse required() gérer l'absence
              return file.size < 700 * 1024;
          }
        )
})

export default EditArticleSchema;