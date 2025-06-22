import React from 'react';
import '../css/component.css'
import PropTypes from 'prop-types';

const MainBtn = ({className, isSubmit, name, click, disabled=false}) => {
    return (
       <button
            id="mainBtn"
            className={className}
            type={isSubmit ? "submit" : "button"}
            onClick={click}
            disabled={disabled}
            aria-label={name} 
            data-testid={"mainBtn"}
        >
        {name}
        </button>
    )  
}

MainBtn.propTypes = {
    className: PropTypes.string,
    isSubmit: PropTypes.bool,
    name: PropTypes.string.isRequired,
    click: PropTypes.func.isRequired,
    disabled: PropTypes.bool
}

export default MainBtn;