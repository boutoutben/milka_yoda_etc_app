import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sumary from "./Sumary";
import { HorizontaleLine, MainBtn } from "./Component";
import "../css/sumary.css";

export const ValidBtn = ({data}) => {
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
            const response = await axios.post(
                "http://localhost:5000/api/adopterSumary",
                { values: data.values, animal: data.animal },
                { withCredentials: true }
            );
            console.log('Réponse du serveur :', response.data);
            navigate("/adoptSucess");
            // ici tu peux faire une redirection, afficher un message de succès, etc.
        } catch (error) {
            console.error('Erreur lors de l\'envoi du formulaire :', error);
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

const AdopterSumary = () => {
  const location = useLocation();
  const sumaryData = location.state;

  if (!sumaryData) {
    return <p>Données indisponibles. Veuillez revenir à la page précédente.</p>;
  }

  return (
    <Sumary
      sumaryData={sumaryData}
      extension={
        <>
          <HorizontaleLine />
          <ValidBtn data={sumaryData} />
        </>
      }
    />
  );
};

export default AdopterSumary;