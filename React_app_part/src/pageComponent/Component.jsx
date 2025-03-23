import './../css/component.css'
import { useNavigate } from "react-router-dom";

export const MainBtn = ({className, isSubmit, name, click}) => {
    return (
       <button id="mainBtn" className={className} type={isSubmit ? "submit" : "button"} onClick={click}>{name}</button> 
    )  
}

export const PresentationAnimal = (props) => {
    return (
        <section id='presentationAnimal' onClick={props.handleClick}>
            <img src={`img/${props.img}`} alt="" />
            <div>
                <div>
                    <p>{props.name}</p>
                    <p>{props.age} ans</p> 
                </div>
                <div className='verticalLine'></div>
                <img src={`img/${props.isMale ? "animalMale.png" : "animalFemale.png"}`} alt="" />
            </div>
        </section>
    )
}

export const AllAnimales = ({animalData, redirectionUrl, className}) => {
    const navigate = useNavigate();

     const handleClick = (event) => {
        event.preventDefault();
        navigate(redirectionUrl);
    };
    return (
        <div id='allAnimal' className={className}>
            {Object.values(animalData).map((animal, index) => (
                <PresentationAnimal key={index} img={animal.img} name={animal.name} age={animal.age} isMale={animal.isMale} handleClick={handleClick}/>
            ))}
        </div> 
    )
}

export const WelcomeSection = ({id, title, content, nameBtn, click}) => {
    return (
        <section id={id} className='welcomeSection flex-column'>
            <h2>{title}</h2>
            <div>
                {content}
            </div>
            {nameBtn && <MainBtn name={nameBtn} className='btnInMain' click={click}/>}
        </section>
        
    )
}

export const HorizontaleLine = () => {
    return (
        <div className="line"></div>
    )
}

export const  CloseImg = ({click}) => {
    return (
        <img src='img/close.png' alt='close the page' onClick={click} className='closeImg' />
    )
}


