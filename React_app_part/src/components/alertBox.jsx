import '../css/component.css'
import { useEffect } from "react";
import MainBtn from "./mainBtn";
import PropTypes from 'prop-types';

const AlertBox = ({ text, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="alertBox flex-column alignCenter-AJ">
            <img src="/img/AdoptedCheck.png" alt="" />
            <p>{text}</p>
            <MainBtn name="ok" click={onClose} />
        </div>
    );
};

AlertBox.propTypes = {  
    text: PropTypes.string.isRequired,
    onClose: PropTypes.bool.isRequired,
    duration: PropTypes.number
};

export default AlertBox;