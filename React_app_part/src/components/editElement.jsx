import PropTypes from 'prop-types';
import '../css/component.css'

const EditElement = ({onEdit}) => {   
    return(
        <button data-testid="edit-paraph" className='editLink unstyled-button' onClick={onEdit}>modifier</button>
    )
}

EditElement.propTypes = {
    onEdit: PropTypes.func.isRequired
}

export default EditElement;