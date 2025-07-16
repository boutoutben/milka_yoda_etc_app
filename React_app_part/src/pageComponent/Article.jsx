import { useEffect, useState } from 'react'
import './../css/article.css';
import getFetchApi from '../utils/getFetchApi';
import uploadsImgUrl from '../utils/uploadsImgUrl';
import { useNavigate } from 'react-router-dom'
import AreYouSure from '../components/areYouSure';
import EditElement from '../components/editElement';
import MainBtn from '../components/mainBtn';
import DeleteElement from '../components/deleteElement'
import { AddArticle, Article, EditArticle } from '../handles/Article';
import useIsGrandted from '../hook/useIsgranted';
import toggleAtIndex from '../utils/toggleAtIndex';

const Articles = () => {
    const [articles, setArticles] = useState([]); // ✅ Initialize as an empty array
    const granted = useIsGrandted("ADMIN_ROLE")
    const [canAdd, setAdd] = useState(false);
 
    useEffect(() => {
        getFetchApi("articles")
            .then(data => {
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

    const toggleEdit = (index) => toggleAtIndex(canEditArray, setCanEditArray, index)
    const toggledelete = (index) => toggleAtIndex(canDeleteArray, setCanDeleteArray, index);
    const navigate = useNavigate()
    const handleClick = (event, id) => {
        event.preventDefault();
        navigate(`/article/${id}`);
    }
    if (!articles.length) return <p>Chargement....</p>; // ✅ Check for empty array instead of `null`

    return (
        <main id="article">
            <article>
                {granted && (
                    <div className='relative'>
                    <MainBtn name={"Ajouter un article"} click={() => setAdd(true)} className={"btnInMain"} />
                    {canAdd && (
                       <AddArticle setAdd={setAdd} />
                    )}
                    
                    </div>
                )}
                <h1>Nos derniers articles</h1>
                {articles.map((article, index) => (
                    <div className='relative' key={article.id}>
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