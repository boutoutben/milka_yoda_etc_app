import { useNavigate, useParams } from "react-router-dom";
import "../css/articleDetail.css"
import EditElement from "../components/editElement";
import DeleteElement from "../components/deleteElement";
import { handleDeleteArticle, RenderArticleComponent, useFetchArticleDetailData } from "../handles/ArticleDetail";
import useIsGrandted from "../hook/useIsgranted";



const ArticleDetail = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {article, ArticleComponent} = useFetchArticleDetailData(id);
    const granted = useIsGrandted("ADMIN_ROLE");

    
    if(!article) return <p>Chargement...</p>
    return (
        <main id="articleDetail">
            {granted && (
                <div className="flex-row">
                    <EditElement onEdit={() => navigate(`/writeArticle/${id}`)}/>
                    <DeleteElement onDelete={handleDeleteArticle} />
                </div>    
            )}
                
            <RenderArticleComponent ArticleComponent={ArticleComponent} />
        </main>
    )
}

export default ArticleDetail;