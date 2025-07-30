import "../css/sumary.css";
import { useLocation } from "react-router-dom";
import HorizontaleLine from "../components/horizontaleLine";
import { Sumary } from "../handles/Sumary";
import { ValidBtn } from "../handles/AdopterSumary";

const AdopterSumary = () => {
  const location = useLocation();
  const sumaryData = location.state;

  if (!sumaryData || !sumaryData.animal) {
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