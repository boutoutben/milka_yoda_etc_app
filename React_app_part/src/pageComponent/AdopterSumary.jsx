import "../css/sumary.css";
import { useLocation } from "react-router-dom";
import HorizontaleLine from "../components/horizontaleLine";
import { Sumary } from "../handles/Sumary";

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