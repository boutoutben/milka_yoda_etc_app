import React, { useEffect, useState } from "react"
import "./../css/welcome.css"

import {MainBtn, PresentationAnimal, WelcomeSection} from "./Component"
import { useNavigate } from "react-router-dom"
import { fetchApi } from "./App"


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
            <button className="btn" id="prev" onClick={decrementSlide}>&#10096;</button>
            <button className="btn" id="next" onClick={incrementSlide}>&#10097;</button>
            <ul>
                {Object.values(slides).map((element, index) => (
                    <li key={index} className={`slide ${(slide % totalSlides) === index ? 'active' : ''}`}>
                        <img src={`img/${element.src}`} alt={element.alt} />
                        <h1>Bienvenu dans Milka Yoda etc</h1>
                    </li>
                ))}
            </ul>
        </div>
    );
}
        /*
        <div id="welcomeToAsso">
             <h1 className="flex-column alignCenter-AJ">Bienvenue dans Milka Yoda etc</h1>
        </div>
        */

const WelcomeImg = ({src, alt, redirection}) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(redirection);
    }
    return (
        <div id="welcomeImg" className="borderBlue">
            <img src={src} alt={alt} onClick={handleClick}/>
        </div>  
    )
}

const ArrowSeeMore = ({redirection}) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(redirection);
    }

    return (
        <img src="img/rightArrow.png" alt="Flèche pour voir les plus d'action" className="arrow" onClick={handleClick} />
    )
}

const AssociationPresentation = () => {
    return (
        <WelcomeSection 
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
    return (
        <WelcomeSection 
        id="actionSumary"
        title="Avant goût des actions"
        content={
            <div className="flex-row alignCenter-AJ">
                <WelcomeImg src="img/milka.JPG" alt='illustration de médiation animal avec Milka, un des chiens médiateur' redirection={"/mediatorAnimal"}/>
                <WelcomeImg src='img/shopAction.png' alt='Illustration de nos boutiques' />
                <ArrowSeeMore redirection={"/action"} />
            </div>
        }
        />
    )
}

const AnimalToAdopt = () => {
    const [animalsData, setAnimalsData] = useState([]);
    useEffect(() => {
        fetchApi("welcomeData")
            .then(data => {
                setAnimalsData(data);
            })
            .catch(err => {
                console.error(err);
            })
    }, []);
    
    return (
        <WelcomeSection
        id='animalToAdopt'
        title='Nos animaux à adopter'
        content={
            <div className="flex-row alignCenter-AJ">
                {animalsData.map((animal) => (
                    <PresentationAnimal key={animal.id} img={animal.imgName} name={animal.name} age={new Date().getFullYear() - new Date(animal.born).getFullYear()} isMale={(animal.sexe === 1) ? true : false}/>
                ))}
                <ArrowSeeMore redirection={'/adopter'} />
            </div>
        }
        />
    )
}

const BeingCarefullAboutAnimales = ({redirection}) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate(redirection);
    }

    return (
        <WelcomeSection
        id='beingCarefullAboutAnimales'
        title='Les animaux ne sont pas des objets'
        content={
            <div className="flex-row alignCenter-AJ">
                <div className="borderBlue">
                    <img src="img/petAbuse.png" alt="" />
                    <p>La maltraitance animal affecter mentalment nos ami canin</p>
                </div>
                <div className="borderBlue">
                    <img src="img/giveAttention.png" alt="" />
                    <p>Donner de l'attention à vos compagnon pour bien le stimuler</p>
                </div>
                <div className="borderBlue">
                    <img src="img/foodAlert.png" alt="" />
                    <p>Le chien n'est pas homnivors, ne lui donner pas n'importe quoi</p>
                </div>
            </div>
        }
        nameBtn={"Voir plus"}
        click={handleClick}
        />
    )
}

const SocialMediaPresentation = () => {
    return (
        <section id="socialMediaPresentation">
            <div className="flex-row alignCenter-AJ">
                <a href="https://www.instagram.com/milka_yoda_etc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank"><img src="img/instagram.png" alt="" /></a>
                <a href="#"><img src="img/tik-tok.png" alt="" /></a>
                <a href="#"><img src="img/twitter.png" alt="" /></a>
                <a href="https://www.facebook.com/profile.php?id=61574010993069" target="_blank"><img src="img/facebook.png" alt="" /></a>
            </div>
        </section>
    )
}

const Welcome = () => {
    return (
        <main id="welcomePage">
            <WelcomeToMilkaYodaEtc />
            <AssociationPresentation />
            <ActionSumary />  
            <AnimalToAdopt />
            <BeingCarefullAboutAnimales redirection={'/article'}/>
            <SocialMediaPresentation />
        </main>   
    )
}

export default Welcome;