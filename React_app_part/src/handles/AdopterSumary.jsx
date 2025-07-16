import MainBtn from "../components/mainBtn";
import axios from "axios";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ValidBtn = ({data}) => {
    const navigate = useNavigate();
    const handlePreviousClick = () => {
        navigate("/adopterProfile", { 
            state: { 
            previousValues: data.values, 
            previousAnimal: data.animal 
            }
        });
    }

    const handleSendClick = async () => {
        try {
            await axios.post(
                "http://localhost:5000/api/adopterSumary",
                { values: data.values, animal: data.animal },
                { withCredentials: true }
            );
            navigate("/adoptSucess");
            // ici tu peux faire une redirection, afficher un message de succès, etc.
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire :', error.message);
            // ici tu peux afficher un message d'erreur à l'utilisateur
        }
    };
    return (
        <div className="flex-row">
            <MainBtn name={"Précédent"} click={handlePreviousClick} />
            <MainBtn name={"Envoyer"} click={handleSendClick} />
        </div>
    )
}

ValidBtn.propTypes = {
    data: PropTypes.shape({
        values: PropTypes.object,
        animal: PropTypes.object
    })
}

export {ValidBtn}