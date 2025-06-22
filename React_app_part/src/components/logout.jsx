import { useNavigate } from "react-router-dom";
import '../css/component.css'
import PropTypes from "prop-types";

const Logout = ({message}) => {
    const navigate = useNavigate()
    const handleLogoutClick = () => {
        localStorage.clear();
        navigate("/login");
    };
    return (
        <div className="flex-row logout">
            <h1>{message}</h1>
            <button onClick={handleLogoutClick} className="unstyled-button" data-testid="logout-icon">
                <img src="/img/logout.png" alt="Se déconnecter" />       
            </button>
            
        </div>
    )
}

Logout.propTypes = {
    message: PropTypes.string.isRequired
}

export default Logout;