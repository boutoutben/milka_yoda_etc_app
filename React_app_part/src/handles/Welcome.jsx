import PresentationAnimal from "../components/presentationAnimal"
import AppSection from "../components/AppSection"
import { redirect, useNavigate } from "react-router-dom"
import getFetchApi from "../utils/getFetchApi";
import uploadsImgUrl from "../utils/uploadsImgUrl";
import { useEffect, useState } from "react"
import PropTypes from "prop-types";
import getAnimalAge from "../utils/getAnimalAge";

const WelcomeToMilkaYodaEtc = () => {
    const [slide, setSlide] = useState(0);

    const slides = {
        1: { src: 'WelcomeAsso1.JPG', alt: '' },
        2: { src: 'WelcomeAsso2.JPG', alt: '' },
        3: { src: 'WelcomeAsso3.JPG', alt: '' }
    };

    const totalSlides = Object.keys(slides).length;

    const incrementSlide = () => {
        setSlide(prev => (prev + 1) % totalSlides);
    };

    const decrementSlide = () => {
        setSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            incrementSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="carousel">
            <button data-testid="leftArrow" className="btn" id="prev" onClick={decrementSlide}>&#10096;</button>
            <button data-testid="rightArrow" className="btn" id="next" onClick={incrementSlide}>&#10097;</button>
            <ul>
                {Object.values(slides).map((element, index) => (
                    <li key={element.src} className={`slide ${(slide % totalSlides) === index ? 'active' : ''}`}>
                        <img src={`img/${element.src}`} alt={element.alt} />
                        <h1>Bienvenu dans Milka Yoda etc</h1>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const WelcomeImg = ({src, alt, redirection}) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(redirection);
    }
    return (
        <div data-testid={"welcomeImg"} id="welcomeImg" className="borderBlue">
            <img src={src} alt={alt} onClick={handleClick} />
        </div>  
    )
}

WelcomeImg.propTypes = {
    src: PropTypes.string,
    alt: PropTypes.string,
    redirection: PropTypes.string
}

const ArrowSeeMore = ({redirection, navigate}) => {
    const handleClick = (event) => {
        event.preventDefault();
        navigate(redirection);
    }

    return (
        <img data-testid="arrowSeeMore" src="img/rightArrow.png" alt="Flèche pour voir les plus d'action" className="arrow" onClick={handleClick} />
    )
}

ArrowSeeMore.propTypes = {
    redirection: PropTypes.string,
    navigate: PropTypes.func
}

const AssociationPresentation = () => {
    return (
        <AppSection 
        id="assocationPresentation"
        title="Présentation de l'association"
        content={
            <div className="flex-row alignCenter-AJ">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, 
                    vel scelerisque nisl consectetur et. Nulla vitae elit libero, a pharetra augue. Donec id elit 
                    non mi porta gravida at eget metus. Curabitur blandit tempus porttitor.
                </p>
                <div className="borderBlue">
                    <img src="img/presentationImg.JPG" alt="Présentation avec deux chiens de l'association" />
                </div>
            </div>
        }
    />
    )
}

const ActionSumary = () => {
    const [actions, setActions] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {
        getFetchApi("welcomeData")
            .then(data => {
                setActions(data.actions);
            })
            .catch(err => {
                console.error("Une erreur est survenue:", err.message);
            })
    }, []);
    return (
        <AppSection 
        id="actionSumary"
        title="Avant goût des actions"
        content={
            <div className="flex-row alignCenter-AJ">
                {actions.map((action, index) => (
                    <WelcomeImg
                        key={action.id}
                        src={uploadsImgUrl(action.imgName)}
                        alt="Action img"
                        redirection={action.pageUrl || undefined}
                    />
                ))}
                
                <ArrowSeeMore redirection={"/action"} navigate={navigate} />
            </div>
        }
        />
    )
}

const AnimalToAdopt = () => {
    const [animalsData, setAnimalsData] = useState([]);
    const navigate = useNavigate();

    const fetchAnimalsData = async () => {
        try {
            const data = await getFetchApi("welcomeData");
            setAnimalsData(data.animals);
        } catch (err) {
            console.error("Une erreur est survenue:", err.message);
        }
    };

    useEffect(() => {
        fetchAnimalsData();
    }, []);

    const handleClick = (event, animalId) => {
        event.preventDefault();
        navigate(`adopter/${animalId}`);
    };

    return (
        <AppSection
            id='animalToAdopt'
            title='Nos animaux à adopter'
            content={
                <div className="flex-row alignCenter-AJ">
                    {animalsData.length > 0 ? (
                        animalsData.map((animal) => (
                            <PresentationAnimal
                                key={animal.id}
                                img={animal.imgName}
                                name={animal.name}
                                age={getAnimalAge(animal.born)}
                                isMale={animal.sexe === 1}
                                handleClick={(event) => handleClick(event, animal.id)}
                            />
                        ))
                    ) : (
                        <p>Loading animals...</p>
                    )}
                    <ArrowSeeMore redirection='/adopter' navigate={navigate} />
                </div>
            }
        />
    );
};

const BeingCarefullAboutAnimales = ({redirection, navigate}) => {

    const [articles, setArticles] = useState([]);
    useEffect(() => {
        getFetchApi("welcomeData")
            .then(data => {
                setArticles(data.articles);
            })
            .catch(err => {
                console.error("Une erreur est survenue:", err.message);
            })
    }, []);

    const handleArticleClick = (event, id) => {
        event.preventDefault();
        navigate(`/article/${id}`);
    }

    const handleClick = (event) => {
        event.preventDefault();
        navigate(redirection);
    }


    return (
        <AppSection
        id='beingCarefullAboutAnimales'
        title='Les animaux ne sont pas des objets'
        content={
            <div className="flex-row alignCenter-AJ">
                {articles.map((article) => (
                    <div className="borderBlue" data-testid={`article`} key={article.id} onClick={(event) => handleArticleClick(event, article.id)} >
                        <img data-testid={`articleImg-${article.id}`} src={uploadsImgUrl(article.imgName)} alt="" />
                        <p>{article.title}</p>
                    </div>
                ))}
            </div>
        }
        nameBtn={"Voir plus"}
        click={handleClick}
        />
    )
}

BeingCarefullAboutAnimales.propTypes = {
    redirection: PropTypes.string,
    navigate: PropTypes.func
}

const SocialMediaPresentation = () => {
    return (
        <section id="socialMediaPresentation">
            <div className="flex-row alignCenter-AJ">
                <a href="https://www.instagram.com/milka_yoda_etc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank"><img src="img/instagram.png" alt="" /></a>
                <a href="https://www.tiktok.com/@milka.yoda.etc" target="_blank"><img src="img/tik-tok.png" alt="" /></a>
                <a href="/"><img src="img/twitter.png" alt="" /></a>
                <a href="https://www.facebook.com/profile.php?id=61574010993069" target="_blank"><img src="img/facebook.png" alt="" /></a>
            </div>
        </section>
    )
}

export {WelcomeToMilkaYodaEtc, WelcomeImg, ArrowSeeMore, AssociationPresentation, ActionSumary, AnimalToAdopt, BeingCarefullAboutAnimales,SocialMediaPresentation}