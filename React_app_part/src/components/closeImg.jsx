import PropTypes from 'prop-types'
import '../css/component.css'

const  CloseImg = ({click}) => {
    return (
        <button onClick={click} data-testid="close-button" className="unstyled-button closeImgBtn" aria-label="Close the page">
            <img src="/img/close.png" alt="" className="closeImg" />
        </button>
    )
}


CloseImg.propTypes = {
    click: PropTypes.func.isRequired
}

export default CloseImg