import { useEffect, useState } from 'react'
import './../css/article.css'
import { getFetchApi } from './App'
import { useNavigate } from 'react-router-dom'

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

    if (!articles.length) return <p>Chargement....</p>; // ✅ Check for empty array instead of `null`

    return (
        <main id="article">
            <article>
                <h1>Nos derniers articles</h1>
                {articles.map((article, index) => (
                    <Article 
                        key={index}
                        title={article.title}
                        text={article.description}
                        src={`img/${article.imgName}`}
                        alt={""}
                        click={(event) => handleClick(event, article.id)}
                    />
                ))}
            </article>
        </main>
    );
};

export default Articles;