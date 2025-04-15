import { useParams } from "react-router-dom";
import "../css/articleDetail.css"
import { Suspense, useEffect, useState } from "react";
import { getFetchApi } from "./App";



const ArticleDetail = () => {
    const {id} = useParams();
    const [article, setArticle] = useState(null);
    const [ArticleComponent, setArticleComponent] = useState(null);
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
    if(!article) return <p>Chargement...</p>
    return (
        <main id="articleDetail">
            <h1>{article.title}</h1>
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