import { useEffect, useState } from 'react'
import './../css/article.css'
import { getFetchApi, isGranted, upluadsArticle, upluadsImgUrl } from './App'
import { useNavigate } from 'react-router-dom'
import { ChooseFile, FloatFormField, MainBtn } from './Component'
import axios from 'axios'
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AddArticleSchema = Yup.object().shape({
    title: Yup.string()
        .min(3, "Le nom doit comporter au moins 3 caractères.")
        .max(50, "Le nombre maximal de caractères du titre est 50.")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()\-:;@#*\/\n\r ]+$/, "Format invalide")
        .required("Le titre est requis."),
    description: Yup.string()
        .min(30, "Le nom doit comporter au moins 30 caractères.")
        .max(750, "Le nombre maximal de caractères de la description est 750.")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()\-:;@#*\/\n\r ]+$/, "Format invalide")
        .required("La description est requis."),
    file: Yup.mixed()
        .required('L\'image est requis')
        .test(
            'fileFormat', // nom du test (optionnel mais recommandé)
            'Please provide a supported file type',
            function (file) {
                if (!file) return true; // Pas de fichier → pas d'erreur (ou à adapter)
                const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                const extension = file.name.split('.').pop().toLowerCase();
                const isValid = validExtensions.includes(extension);
                return isValid || this.createError({ message: "Vous extension n'est pas correct seul png, jpg, jpeg, gif, webp" });
            }
        )
        .test({
            message: `File too big, can't exceed 500ko`,
            test: (file) => {
            const isValid = file?.size < 500 * 1024;
            return isValid;
        }
  })
})

const Article = ({title, text, src, alt, click}) => {
    return (
        <section onClick={click}>
            <div>
            <h2>{title}</h2>
            <p>{text}</p>
            </div>  
            <img src={src} alt={alt} />  
        </section>
        
        
    )
}

const Articles = () => {
    const [articles, setArticles] = useState([]); // ✅ Initialize as an empty array
    const granted = isGranted("ADMIN_ROLE");
    const [canAdd, setAdd] = useState(false);
 
    useEffect(() => {
        getFetchApi("articles")
            .then(data => {
                setArticles(data[0]); // ✅ Store the full array, not just `data[0]`
            })
            .catch(err => {
                console.error(err);
            });
    }, []);
    const navigate = useNavigate()
    const handleClick = (event, id) => {
        event.preventDefault();
        navigate(`/article/${id}`);
    }

    const handleAddArticle = async (values) => {
        const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("file", values.file);
        try {
            await axios.post(
                'http://localhost:5000/api/articles/add',
                formData,
                { withCredentials: true }
            ).then(response => {
                navigate(`/writeArticle/${response.data.id}`)
            })
            }  catch (err) {
            console.error("Erreur lors de l'envoi :", err);
            } 
    }

    const formik = useFormik({
        initialValues: {
            title:'',
            description: '',
            file:''
        },

        validationSchema:AddArticleSchema,

        onSubmit: (values => handleAddArticle(values))
    })

    if (!articles.length) return <p>Chargement....</p>; // ✅ Check for empty array instead of `null`

    return (
        <main id="article">
            <article>
                {granted && (
                    <div className='relative'>
                    <MainBtn name={"Ajouter un article"} click={() => setAdd(true)} className={"btnInMain"} />
                    {canAdd && (
                      <FloatFormField isTop={true} action={"Créer un article"} setter={() => setAdd(false)} content={
                        <form onSubmit={formik.handleSubmit}>
                            <table aria-hidden="true">
                                <tbody>
                                    <tr>
                                        <td>Titre:</td>
                                        <td><input type="text" name="title" placeholder='Titre' value={formik.values.title} onChange={formik.handleChange} /></td>
                                    </tr>
                                    <tr>
                                        {formik.touched.title && formik.errors.title && (
                                            <td className="formError" colSpan={2} >{formik.errors.title}</td>
                                        )}    
                                    </tr>
                                    <tr>
                                        <td>Description:</td>
                                        <td><textarea name="description" placeholder='Description' value={formik.values.description} onChange={formik.handleChange}></textarea></td>
                                    </tr>
                                    <tr>
                                        {formik.touched.description && formik.errors.description && (
                                            <td className="formError" colSpan={2} >{formik.errors.description}</td>
                                        )}    
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex-column alignCenter-AJ">
                                <ChooseFile formik={formik} />  
                                {formik.touched.file && formik.errors.file && (
                                    <div className="formError" colSpan={2} >{formik.errors.file}</div>
                                )}   
                            </div>
                            
                            <MainBtn name={"Créer"} isSubmit={true} className={"btnInMain"} />
                        </form>
                      }/>  
                    )}
                    
                    </div>
                )}
                <h1>Nos derniers articles</h1>
                {articles.map((article, index) => (
                    <Article 
                        key={index}
                        title={article.title}
                        text={article.description}
                        src={upluadsImgUrl(article.imgName)}
                        alt={""}
                        click={(event) => handleClick(event, article.id)}
                    />
                ))}
            </article>
        </main>
    );
};

export default Articles;