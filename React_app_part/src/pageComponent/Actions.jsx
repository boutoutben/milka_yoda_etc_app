import { WelcomeSection, HorizontaleLine, MainBtn, ChooseFile, CloseImg, FloatFormField, AreYouSure } from "./Component";
import { useNavigate } from "react-router-dom";
import "./../css/action.css"
import { getFetchApi, isGranted, upluadsImgUrl } from "./App";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from 'yup';
import {closestCorners, DndContext} from '@dnd-kit/core'
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";

const AddActionSchema = Yup.object().shape({
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
  }),
  pageUrl: Yup.string()
        .min(3, "L'url de la page doit comporter au moins 3 caractères.")
        .max(50, "Le nombre maximal de caractères de l'url de la page est 50.")
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()\-:;@#*\/\n\r ]+$/, "Format invalide"),
})

const EditActionForm = ({ action }) => {
  const formik = useFormik({
    initialValues: {
      title: action.title,
      description: action.description,
      pageUrl: action.pageUrl,
    },
    validationSchema: AddActionSchema,

    onSubmit: (values) => {
      const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("file", values.file);
            formData.append("actionId", action.id);
            axios.patch('http://localhost:5000/api/action/editAction', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                formik.resetForm();
                location.reload();
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
            });
        }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="flex-column alignCenter-AJ">
        <table aria-hidden="true">
            <tbody>
                <tr>
                    <td>Titre:</td>
                    <td><input type="text" name="title" placeholder="titre" value={formik.values.title}
                            onChange={formik.handleChange} /></td>
                </tr>
                <tr>
                    {formik.touched.title && formik.errors.title && (
                        <td className="formError" colSpan={2} >{formik.errors.title}</td>
                    )}    
                </tr>
                <tr>
                    <td>Description:</td>
                        <td><textarea name="description" placeholder="description" value={formik.values.description}
                                onChange={formik.handleChange} /></td>
                </tr>
                <tr>
                    {formik.touched.description && formik.errors.description && (
                        <td className="formError" colSpan={2} >{formik.errors.description}</td>
                    )} 
                </tr>
                 <tr>
                    <td>Nom de l'url:</td>
                        <td><input type="text" name="pageUrl" placeholder="Nom de l'url" value={formik.values.pageUrl}
                            onChange={formik.handleChange} /></td>
                </tr>
                <tr>
                    {formik.touched.pageUrl && formik.errors.pageUrl && (
                        <td className="formError" colSpan={2} >{formik.errors.pageUrl}</td>
                    )} 
                </tr>
            </tbody>
        </table>
        <div>
            <ChooseFile formik={formik}/>
                {formik.touched.file && formik.errors.file && (
                    <div className="formError" colSpan={2} >{formik.errors.file}</div>
                )}    
        </div>
        <MainBtn name={"Créer"} isSubmit={true} className={"btnInMain"} />  
    </form> 
  );
};

const Action = ({id,title, src, alt, text, asBtn, editClick, supClick, btnClick,granted}) => {
    const navigate = useNavigate();
    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id})
    const handleClick = (event) => {
        event.preventDefault();
        navigate(`/${btnClick}`)
    }
    const style = {
        transition, 
        transform: CSS.Transform.toString(transform),
    }
    return (
        <WelcomeSection
            ref={setNodeRef}
            {...(granted
                ? { attributes, listeners }
                : {}
            )}
            style={style}
            id={`action-${id}`}
            title={title}
            editAndSup={true}
            editClick={editClick}
            onDelete={supClick}
            content={
                <div className="flex-column alignCenter-AJ">
                    <p>
                        <img src={src} alt={alt} />{text}
                    </p>
                </div>
            }
            nameBtn={asBtn!= null?"Voir plus":null}
            click={handleClick}
        />
    )
}

const Actions = () => {
    const [canAdd, setAdd] = useState(false);
    const granted = isGranted("ADMIN_ROLE");
    const [actions, setActions] = useState(null);

    const AddActionformik = useFormik({
        initialValues: {
            title: '',
            description:'',
            file: '',
            pageUrl: ''
        },
        validationSchema:AddActionSchema,
        onSubmit: (values) =>{
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("file", values.file);
            formData.append("pageUrl", values.pageUrl)

            axios.post('http://localhost:5000/api/action/addAction', formData, {
                withCredentials: true
            })
            .then(response => {
                AddActionformik.resetForm();
                setAdd(false);
                location.reload();
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
            });
        }
    });
    useEffect(() => {
            getFetchApi("action")
                .then(data => {
                    setActions(data.actions);
                })
                .catch(err => {
                    console.error(err);
                })
        }, []);
    const [canEditArray, setCanEditArray] = useState([]);
    const [canDeleteArray, setDeleteArray] = useState(false);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (actions) {
            setCanEditArray(new Array(actions.length).fill(false));
            setDeleteArray(new Array(actions.length).fill(false));
        }
    }, [actions]);

    const toggleEdit = (index) => {
        const updated = [...canEditArray];
        updated[index] = !updated[index];
        setCanEditArray(updated);
    }

    const toggletDelete = (index) => {
        const updated = [...canDeleteArray];
        updated[index] = !updated[index];
        setDeleteArray(updated);
    }
    const getActinsPos = id => actions.findIndex(actions => 
        actions.id === id)

    const handleDragEnd = event => {
        const {active, over} = event;

        if(active.id === over.id) return;
        setSaving(true);
        setActions(actions => {
            const originalPos = getActinsPos(active.id);
            const newPos = getActinsPos(over.id);

            return arrayMove(actions, originalPos, newPos);
        })
    }

    const changeOrderClick = async (actions) => {
        try {
        await axios.patch(
            'http://localhost:5000/api/action/updateOrder',
            { actions },
            { withCredentials: true }
        ).then(response => {
            location.reload();
        })
        }  catch (err) {
        console.error("Erreur lors de l'envoi :", err);
        } 
    };
        
    if(!actions) return <p>Chargement...</p>
    return (
        <main id="actionPage">
            <h1>Toutes nos actions</h1>
            
            {granted && (
                <div className="addAction">
                    <MainBtn name={"Ajouter un action"} click={() => setAdd(true)} className={"btnInMain"} />
                    {canAdd && (
                        <FloatFormField setter={() => setAdd(false)} action={"Ajouter une action"} content={
                                <form onSubmit={AddActionformik.handleSubmit} className="flex-column alignCenter-AJ">
                                    <table aria-hidden="true">
                                        <tbody>
                                            <tr>
                                                <td>Titre:</td>
                                                <td><input type="text" name="title" placeholder="titre" value={AddActionformik.values.title}
                                                        onChange={AddActionformik.handleChange} /></td>
                                            </tr>
                                            <tr>
                                            {AddActionformik.touched.title && AddActionformik.errors.title && (
                                                    <td className="formError" colSpan={2} >{AddActionformik.errors.title}</td>
                                                )}    
                                            </tr>
                                            <tr>
                                                <td>Description:</td>
                                                <td><textarea name="description" placeholder="description" value={AddActionformik.values.description}
                                                        onChange={AddActionformik.handleChange} /></td>
                                            </tr>
                                            <tr>
                                                {AddActionformik.touched.description && AddActionformik.errors.description && (
                                                    <td className="formError" colSpan={2} >{AddActionformik.errors.description}</td>
                                                )} 
                                            </tr>
                                            <tr>
                                                <td>Nom de l'url:</td>
                                                <td><input type="text" name="pageUrl" placeholder="Nom de l'url" value={AddActionformik.values.pageUrl}
                                                        onChange={AddActionformik.handleChange} /></td>
                                            </tr>
                                            <tr>
                                                {AddActionformik.touched.pageUrl && AddActionformik.errors.pageUrl && (
                                                    <td className="formError" colSpan={2} >{AddActionformik.errors.pageUrl}</td>
                                                )} 
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div>
                                        <ChooseFile formik={AddActionformik}/>
                                        {AddActionformik.touched.file && AddActionformik.errors.file && (
                                            <div className="formError" colSpan={2} >{AddActionformik.errors.file}</div>
                                        )}    
                                    </div>
                                    <MainBtn name={"Créer"} isSubmit={true} className={"btnInMain"} />   
                                </form>
                        } />
                    )}
                </div>
                
            )}
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
                <SortableContext  items={actions} strategy={verticalListSortingStrategy}>
                    <div className="flex-column row-gap-15">
                        {actions.map((action, index) => (
                            <div key={index} className="relative">
                                <Action id={action.id} title={action.title} src={upluadsImgUrl(action.imgName)} alt="cc" 
                                    text={action.description} isAdmin={granted} editClick={() =>toggleEdit(index)} supClick={() => toggletDelete(index)}
                                    asBtn={true} btnClick={action.pageUrl} granted={granted}
                                />  
                                {canEditArray[index] && (
                                    <FloatFormField setter={() =>toggleEdit(index)} action={"Modifier l'action"} content={
                                        <>
                                            <EditActionForm action={action} />
                                        </>
                                    } />
                                )}
                                {canDeleteArray[index] && (
                                    <AreYouSure setter={() => toggletDelete(index)} apiUrl={`action/delete/${action.id}`} />                
                                )} 
                            </div>
                            
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {granted &&<MainBtn name={"Enregistrer la nouvelle dispositon des actions"} disabled={!saving} click={() => changeOrderClick(actions)} /> }
        </main>
    )
}

export default Actions;