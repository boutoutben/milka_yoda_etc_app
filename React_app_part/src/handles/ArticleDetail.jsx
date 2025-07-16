import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import getFetchApi from "../utils/getFetchApi";
import loadArticleComponent from "../utils/loadArticleComponent";
import PropTypes from "prop-types";

const handleDeleteArticle = async (id, navigate) => {
    try {
        await axios.delete(
            `http://localhost:5000/api/articles/delete/${id}`,
            {},
            { withCredentials: true }
        ).then(response => {
            navigate(response.data.url);
        })
    } catch (err) {
        console.error("Erreur lors de l'envoi:", err.message);
    } 
}

const useFetchArticleDetailData = (id) => {
    const [article, setArticle] = useState(null);
    const [ArticleComponent, setArticleComponent] = useState(null);
    useEffect(() => {
                getFetchApi(`articles/${id}`)
                    .then(data => {
                        setArticle(data)
                        loadArticleComponent(data.fileName)
                            .then((module) => setArticleComponent(() => module.default))
                            .catch((err) => console.error("Erreur lors du chargement du composant:", err.message));
                    })
                    .catch(err => {
                        console.error("Erreur lors de la recherche:", err.message);
                    });
            }, [id]);
    return {article: article, ArticleComponent: ArticleComponent};
}

const RenderArticleComponent = ({ArticleComponent}) => {
    return (
        <>
            {ArticleComponent ? (
                <Suspense fallback={<p>Chargement du contenu...</p>}>
                    <ArticleComponent />
                </Suspense>
                 ) : (
                <p>Chargement du contenu...</p>
            )}
        </>
    )
}

RenderArticleComponent.propTypes = {
    ArticleComponent: PropTypes.func
}
export {handleDeleteArticle, useFetchArticleDetailData, RenderArticleComponent}