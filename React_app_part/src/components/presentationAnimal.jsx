import uploadsImgUrl from "../utils/uploadsImgUrl";
import '../css/component.css'
import PropTypes from "prop-types";
import AppSection from "./AppSection";


const PresentationAnimal = ({img, isWaiting, name, age, isMale, handleClick}) => {
    return (
        <AppSection id={"presentationAnimal"} sectionClick={handleClick} content={
            <>
                <div>
                    <img src={uploadsImgUrl(img)} alt="" />   
                    {isWaiting&& <img src="img/clockwise.png" alt="" className='waiting' />}
                </div>
                <div>
                    <div>
                        <p>{name}</p>
                        <p>{age}</p> 
                    </div>
                    <div className='verticalLine'></div>
                    <img data-testid="sexe-img" src={`img/${isMale ? "animalMale.png" : "animalFemale.png"}`} alt="" />
                </div>
            </>
        } />
    );
}

PresentationAnimal.propTypes = {
    img: PropTypes.string.isRequired,
    isWaiting: PropTypes.bool,
    name: PropTypes.string.isRequired,
    age: PropTypes.number.isRequired,
    isMale: PropTypes.bool.isRequired,
    handleClick: PropTypes.func.isRequired
}

export default PresentationAnimal;