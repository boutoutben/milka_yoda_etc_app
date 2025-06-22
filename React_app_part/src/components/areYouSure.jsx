import axios from "axios";
import MainBtn from "./mainBtn";
import '../css/component.css'
import PropTypes from "prop-types";

const AreYouSure = ({setter, apiUrl, onReload = () => location.reload()}) => {
    const yesClick = () => {
        axios.delete(`http://localhost:5000/api/${apiUrl}`, {
                withCredentials: true
            })
            .then(() => {
                onReload();
            })
            .catch(error => {
                console.error(`Erreur lors de l'envoi : ${error.message}`);
            });
    }
    return(
        <div className="flex-column row-gap-15 alignCenter-AJ floatFormField" id='areYouSure'>
            <h3>Êtes-vous sûre ?</h3>
            <div className='flex-row gap-15 alignCenter-AJ'>
                <MainBtn name={"Non"} click={setter}/>
                <MainBtn name={'Oui'} click={yesClick} />
            </div>
        </div>
        
    )
}

AreYouSure.propTypes = {
    setter: PropTypes.func.isRequired,
    apiUrl: PropTypes.string.isRequired,
    onReload: PropTypes.func
}

export default AreYouSure;