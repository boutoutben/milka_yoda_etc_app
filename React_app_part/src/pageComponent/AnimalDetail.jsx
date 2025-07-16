import PropTypes from "prop-types";
import { AnimalDescription, AnimalIdentity, useApiData } from "../handles/AnimalDetail";

const AnimalDetail = ({ btnName}) => {
    const currentUrl = window.location.href
    const apiData = useApiData(currentUrl);
    return (
        <main id="animalDetail">
            <AnimalIdentity apiData={apiData} />
            <AnimalDescription btnName={btnName} apiData={apiData} />
        </main>
    )
}

AnimalDetail.propTypes = {
    btnName: PropTypes.string
}

export default AnimalDetail;