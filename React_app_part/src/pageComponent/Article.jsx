import { useEffect, useState } from 'react'
import './../css/article.css';
import getFetchApi from '../utils/getFetchApi';
import uploadsImgUrl from '../utils/uploadsImgUrl';
import { useNavigate } from 'react-router-dom'
import AreYouSure from '../components/areYouSure';
import ChooseFile from '../components/chooseFile';
import EditElement from '../components/editElement';
import FloatFormField from '../components/floatFormField';
import MainBtn from '../components/mainBtn';
import DeleteElement from '../components/deleteElement'
import axios from 'axios'
import { useFormik } from 'formik';

import EditArticleSchema from '../validationSchema/EditArticleSchema';
import AddArticleSchema from '../validationSchema/AddArticleSchema';
import isGranted from '../utils/isGranted';





const EditArticle = ({onEdit, article}) => {
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
                          'Content-Type': 'multipart/form-data'
                      }
                  })
                  .then(() => {
                      formik.resetForm();
                      location.reload();
                  })
                  .catch(error => {
                      console.error("Erreur lors de l'envoi :", error);
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
                console.log(data);
                setArticles(data); // ✅ Store the full array, not just `data[0]`
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const [canEditArray, setCanEditArray] = useState([]);
    const [canDeleteArray, setCanDeleteArray] = useState([]);
    useEffect(() => {
        if (articles) {
            setCanEditArray(new Array(articles.length).fill(false));
            setCanDeleteArray(new Array(articles.length).fill(false));
        }
    }, [articles]);

    const toggleEdit = (index) => {
        const updated = [...canEditArray];
        updated[index] = !updated[index];
        setCanEditArray(updated);
    }

    const toggledelete = (index) => {
        const updated = [...canDeleteArray];
        updated[index] = !updated[index];
        setCanDeleteArray(updated);
    }
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
                    <div className='relative' key={index}>
                    {granted && (
                        <div className='flex-row alignCenter-AJ'>
                            <EditElement onEdit={() => toggleEdit(index)}/>
                            <DeleteElement  onDelete={() => toggledelete(index) }/>
                        </div>
                        
                    )}
                    {canEditArray[index] && (
                        <EditArticle onEdit={() => toggleEdit(index)} article={article}/>
                    )}
                    {canDeleteArray[index] && (
                        <AreYouSure setter={() => toggledelete(index)} apiUrl={`articles/delete/${article.id}`}/>
                    )}
                    <Article   
                        title={article.title}
                        text={article.description}
                        src={uploadsImgUrl(article.imgName)}
                        alt={""}
                        click={(event) => handleClick(event, article.id)}
                        isGranted={granted}
                    />
                    </div>
                ))}
            </article>
        </main>
    );
};

export default Articles;