import PropTypes from 'prop-types';
import '../css/component.css'

const PLusBtn = ({ formik, array, element, objectOption }) => {
    const handleClick = () => {
        const newArray = objectOption 
            ? [...array, Object.fromEntries(objectOption.map(key => [key, '']))]
            : [...array, '']; 
        
        formik.setFieldValue(element, newArray);
    };

    return (
        <button className="unstyled-button editLink" onClick={handleClick} data-testid = "plusBtn">
            <img
                src='/img/plus.png'
                alt='Bouton pour ajouter'
                id='plusBtn'
                className='flex-row alignCenter-AJ'
            />
        </button>
    );
};

PLusBtn.propTypes = {
    formik: PropTypes.shape({
        setFieldValue: PropTypes.func.isRequired,
    }),
    array: PropTypes.array.isRequired,
    element: PropTypes.string.isRequired,
    objectOption: PropTypes.arrayOf(PropTypes.string)
}

export default PLusBtn;