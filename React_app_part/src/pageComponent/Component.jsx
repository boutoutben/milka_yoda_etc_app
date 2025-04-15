import { useEffect } from 'react';
import './../css/component.css'
import { useLocation, useNavigate } from "react-router-dom";

export const MainBtn = ({className, isSubmit, name, click}) => {
    return (
       <button id="mainBtn" className={className} type={isSubmit ? "submit" : "button"} onClick={click}>{name}</button> 
    )  
}

export const PresentationAnimal = (props) => {
    return (
        <section id='presentationAnimal' onClick={props.handleClick}>
            <div>
                <img src={`img/${props.img}`} alt="" />    
            </div>
            
            <div>
                <div>
                    <p>{props.name}</p>
                    <p>{props.age} ans</p> 
                </div>
                <div className='verticalLine'></div>
                <img src={`img/${props.isMale ? "animalMale.png" : "animalFemale.png"}`} alt="" />
            </div>
        </section>
    );
}

export const AllAnimales = ({animalData, className, root=""}) => {
    const navigate = useNavigate();

     const handleClick = (event, animalId) => {
        event.preventDefault();
        navigate(`${root}${animalId}`);
    };
    return (
        <div id='allAnimal' className={className}>
            {Object.values(animalData).map((animal, index) => (
                <PresentationAnimal key={index} img={animal.imgName} name={animal.name} age={new Date().getFullYear() - new Date(animal.born).getFullYear()} isMale={animal.isMale} handleClick={(event) => handleClick(event, animal.id)} />
            ))}
        </div> 
    );
}

export const WelcomeSection = ({id, title, content, nameBtn, click}) => {
    return (
        <section id={id} className='welcomeSection flex-column'>
            {title && <h2>{title}</h2>}
            <div>
                {content}
            </div>
            {nameBtn && <MainBtn name={nameBtn} className='btnInMain' click={click}/>}
        </section>
        
    )
}

export const Logout = ({message}) => {
    const navigate = useNavigate()
    const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/login");
  };
    return (
        <div className="flex-row logout">
            <h1>{message}</h1>
            <img src="/img/logout.png" alt="Se déconnecter" onClick={handleLogoutClick} />
        </div>
    )
}

export const HorizontaleLine = () => {
    return (
        <div className="line"></div>
    )
}

export const  CloseImg = ({click}) => {
    return (
        <img src='/img/close.png' alt='close the page' onClick={click} className='closeImg' />
    )
}

export default function ScroolToTop() {
    const {pathname} = useLocation();

    useEffect(()=> {
        window.scrollTo(0,0);
    }, [pathname]);

    return null;
}


