import PropTypes from "prop-types";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AddUpdateActionSchema from "../validationSchema/AddUpdateActionSchema";
import ChooseFile from "../components/chooseFile";
import MainBtn from "../components/mainBtn";
import AppSection from "../components/AppSection";

const AddActionForm = ({onReload = () => window.location.reload()}) => {
    const token = localStorage.getItem("token")
    const formik = useFormik({
        initialValues: {
            title: '',
            description:'',
            file: '',
            pageUrl: ''
        },
        validationSchema: AddUpdateActionSchema,
        onSubmit: async (values) => {
        try { 
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("file", values.file);
            formData.append("pageUrl", values.pageUrl)
            await axios.post('http://localhost:5000/api/action/addAction', formData, {
                withCredentials: true,
                headers: {

                'Authorization': `Bearer ${token}`
                }
            });
            onReload();
            
        } catch(error) {
            console.error("Erreur lors de l'envoi :", error.message);
        }
    } 
    })
    return( 
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
    )

};

AddActionForm.propTypes = {
    onReload: PropTypes.func
}

function EditActionForm({ action,  onReload = () => window.location.reload()  }) {
    const token = localStorage.getItem("token");

    const formik = useFormik({
        initialValues: {
            title: action.title,
            description: action.description,
            pageUrl: action.pageUrl,
            file: null
        },
        validationSchema: AddUpdateActionSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();
                formData.append("title", values.title);
                formData.append("description", values.description);
                formData.append("pageUrl", values.pageUrl);
                if (values.file) {
                    formData.append("file", values.file);
                }
                await axios.patch(`http://localhost:5000/api/action/editAction/${action.id}`, formData,
                  {
                    withCredentials: true,
                    headers: {

                      'Content-Type': 'application/json', // <- correct
                      'Authorization': `Bearer ${token}`
                    }
                  });
                onReload();
            } catch (error) {
                console.error("Erreur lors de la mise à jour :", error.message);
            }
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
            <MainBtn name={"Mettre à jour"} isSubmit={true} className={"btnInMain"} />  
        </form> 
      );
    };

EditActionForm.propTypes = {
    action: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        pageUrl: PropTypes.string.isRequired
    }).isRequired,
    onReload: PropTypes.func
};

// Composant Action pour la liste des actions (exemple drag and drop)

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
        <AppSection
            ref={setNodeRef}
            {...(granted
                ? { attributes, listeners }
                : {}
            )}
            style={style}
            id={`action-${id}`}
            title={title}
            editAndSup={true}
            onEdit={editClick}
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

Action.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    src: PropTypes.string,
    alt: PropTypes.string,
    text: PropTypes.string,
    asBtn: PropTypes.bool,
    editClick: PropTypes.func,
    supClick: PropTypes.func,
    btnClick: PropTypes.string,
    granted: PropTypes.bool
};

function handleDragEnd (actions,setSaving, setActions, event) {
    const getActinsPos = id => actions.findIndex(actions => 
    actions.id === id)
    const {active, over} = event;

    if(active.id === over.id) return;
    setSaving(true);
    setActions(actions => {
        const originalPos = getActinsPos(active.id);
        const newPos = getActinsPos(over.id);

        return arrayMove(actions, originalPos, newPos);
    })
}

const changeOrderClick = async (actions, onReload= () => location.reload()) => {
    const token = localStorage.getItem("token");
        try {
            await axios.patch(
                'http://localhost:5000/api/action/updateOrder',
                { actions },
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json', // <- correct
                        'Authorization': `Bearer ${token}`
                    }
                }
            ).then(() => {
                onReload();
            })
        }  catch (err) {
        console.error("Erreur lors de l'envoi :", err.message);
        } 
    };

// Exports nommés
export { EditActionForm, Action, handleDragEnd,changeOrderClick, AddActionForm };