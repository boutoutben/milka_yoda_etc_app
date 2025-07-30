import { useFormik } from "formik";
import EditArticleSchema from "../validationSchema/EditArticleSchema";
import FloatFormField from "../components/floatFormField";
import ChooseFile from "../components/chooseFile";
import MainBtn from "../components/mainBtn";
import axios from "axios";
import AddArticleSchema from "../validationSchema/AddArticleSchema";
import { useNavigate } from "react-router-dom";

const EditArticle = ({onEdit, article, onReload = () => location.reload()}) => {
    const token = localStorage.getItem("token")
    const formik = useFormik({
        initialValues: {
            title:article.title,
            description: article.description,
            file:''
        },

        validationSchema:EditArticleSchema,

        onSubmit: (values) => {
            
            const formData = new FormData();
                  formData.append("title", values.title);
                  formData.append("description", values.description);
                  formData.append("file", values.file);
                  formData.append("articleId", article.id);
                  
                  axios.patch('http://localhost:5000/api/articles/editDescriptionArticle', formData, {
                      withCredentials: true,
                      headers: {
                          'Content-Type': 'multipart/form-data',
                          'Authorization': `Bearer ${token}`
                      }
                  })
                  
                  .then(() => {
                        onReload();
                  })
                  .catch(error => {
                      console.error("Erreur lors de l'envoi :", error.message);
                  });
              }
    })

    return(
        <FloatFormField isTop={true} action={"Modifier l'article"} setter={onEdit} content={
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
                
                <MainBtn name={"Mettre à jour"} isSubmit={true} className={"btnInMain"} />
            </form>
          }/>  
    )
}

const Article = ({title, text, src, alt, click}) => {
    return (
        <section data-testid={"article"} onClick={click}>
            <div>
            <h2>{title}</h2>
            <p>{text}</p>
            </div>  
            <img src={src} alt={alt} />  
        </section>
    )
}
const AddArticle = ({setAdd}) => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token")
    const formik = useFormik({
        initialValues: {
            title:'',
            description: '',
            file:''
        },
    
        validationSchema:AddArticleSchema,
    
        onSubmit: async (values) => {
           
           const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("file", values.file);
            try {
                await axios.post(
                    'http://localhost:5000/api/articles/add',
                    formData,
                    {
                        withCredentials: true,
                        headers: { 
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }}
                ).then(response => {
                    navigate(`/writeArticle/${response.data.id}`)
                })
                }  catch (err) {
                console.error("Erreur lors de l'envoi :", err.message);
            }  
        }
    })
    return (
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
    )
}




export {EditArticle, Article, AddArticle}