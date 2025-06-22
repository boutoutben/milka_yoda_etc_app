import { useNavigate } from "react-router-dom";
import PresentationAnimal from "./presentationAnimal";
import PropTypes from 'prop-types';
import '../css/component.css'

const AllAnimales = ({animalData, className, root=""}) => {
    const navigate = useNavigate();

     const handleClick = (event, animalId) => {
        event.preventDefault();
        navigate(`${root}${animalId}`);
    };
    return (
        <div id='allAnimal' className={className}>
            {Object.values(animalData).map((animal) => (
                
                <PresentationAnimal key={animal.id} img={animal.imgName} name={animal.name} age={new Date().getFullYear() - new Date(animal.born).getFullYear()} isMale={animal.isMale} handleClick={(event) => handleClick(event, animal.id)} />
            ))}
        </div> 
    );
}

AllAnimales.propTypes = {
    animalData: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        imgName: PropTypes.string.isRequired,
        born: PropTypes.string.isRequired,
        isMale: PropTypes.bool.isRequired,
    })).isRequired,
    className: PropTypes.string.isRequired,
    root: PropTypes.string
};

export default AllAnimales;