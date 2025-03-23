import './../css/article.css'

const Article = ({title, text, src, alt}) => {
    return (
        <section>
            <div>
            <h2>{title}</h2>
            <p>{text}</p>
            </div>  
            <img src={src} alt={alt} />  
        </section>
        
        
    )
}

const Articles = () => {
    return (
        <main id="article">
            <article>
                <h1>Nos derniers articles</h1> 
                <Article 
                    title={"Titre comple de l'article"}
                    text={
                        "Lorem ipsum odor amet, consectetuer adipiscinng elit. Ante class torquent eros; porta sem eget! Mus malesuada per aliquet venenatis nisi lobortis."
                    }
                    src={"img/petAbuse.png"}
                    alt={""}
                />  
                <Article 
                    title={"Titre comple de l'article"}
                    text={
                        "Lorem ipsum odor amet, consectetuer adipiscinng elit. Ante class torquent eros; porta sem eget! Mus malesuada per aliquet venenatis nisi lobortis."
                    }
                    src={"img/giveAttention.png"}
                    alt={""}
                />
                <Article 
                    title={"Titre comple de l'article"}
                    text={
                        "Lorem ipsum odor amet, consectetuer adipiscinng elit. Ante class torquent eros; porta sem eget! Mus malesuada per aliquet venenatis nisi lobortis."
                    }
                    src={"img/foodAlert.png"}
                    alt={""}
                />    
            </article>
            
        </main>
    )
}

export default Articles;