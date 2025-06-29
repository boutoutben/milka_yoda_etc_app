import { useNavigate, useParams } from "react-router-dom";
import "../css/articleDetail.css"
import { Suspense, useEffect, useState } from "react";
import getFetchApi from "../utils/getFetchApi";
import EditElement from "../components/editElement";
import DeleteElement from "../components/deleteElement";
import axios from "axios";
import isGranted from "../utils/isGranted";



const ArticleDetail = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [article, setArticle] = useState(null);
    const [ArticleComponent, setArticleComponent] = useState(null);
    const granted = isGranted("ADMIN_ROLE");
    useEffect(() => {
            getFetchApi(`articles/${id}`)
                .then(data => {
                    setArticle(data)
                    import(/* @vite-ignore */ `../articles/${data.fileName}`)
                    .then((module) => setArticleComponent(() => module.default))
                    .catch((err) => console.error("Erreur lors du chargement du composant :", err));
                })
                .catch(err => {
                    console.error(err);
                });
        }, [id]);

    const handleDeleteArtilce = async () => {
        try {
            await axios.delete(
                `http://localhost:5000/api/articles/delete/${id}`,
                {},
                { withCredentials: true }
            ).then(response => {
                console.log(response);
                navigate(response.data.url);
            })
            }  catch (err) {
            console.error("Erreur lors de l'envoi :", err);
            } 
    }
    if(!article) return <p>Chargement...</p>
    return (
        <main id="articleDetail">
            {granted && (
                <div className="flex-row">
                    <EditElement onEdit={() => navigate(`/writeArticle/${id}`)}/>
                    <DeleteElement onDelete={handleDeleteArtilce} />
                </div>    
            )}
            
            {ArticleComponent ? (
                <Suspense fallback={<p>Chargement du contenu...</p>}>
                    <ArticleComponent />
                </Suspense>
            ) : (
                <p>Chargement du contenu...</p>
            )}
        </main>
    )
}

export default ArticleDetail;