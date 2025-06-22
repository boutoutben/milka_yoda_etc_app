import CloseImg from "./closeImg";
import '../css/component.css'
import PropTypes from "prop-types";

const FloatFormField = ({ setter, action, content, isTop}) => {
    return (
        <div data-testid="floatFormField" className={`flex-column alignCenter-AJ floatFormField gap-15 ${isTop ? 'isTop' : ''}`}>
            <div className="flex-row alignCenter-AJ">
                <h3>{action}</h3>    
                <CloseImg click={setter}/>
            </div>
            {content}
            
        </div>
    )
}

FloatFormField.propTypes = {
    setter: PropTypes.func.isRequired,
    action: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    isTop: PropTypes.bool.isRequired
}

export default FloatFormField;