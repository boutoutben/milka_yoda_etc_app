import PropTypes from 'prop-types';
import '../css/component.css'

const DeleteElement = ({onDelete}) => {   
    return(
        <button data-testid="delete-paraph" className="unstyled-button editLink" onClick={onDelete}>
            supprimer
        </button>
    )
}

DeleteElement.propTypes = {
    onDelete: PropTypes.func.isRequired
}

export default DeleteElement;
