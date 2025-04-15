import { WelcomeSection } from "./Component";
import "./../css/animalDetail.css"
import { useNavigate, useParams } from "react-router-dom";
import { getFetchApi } from "./App";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const RaceAnimal = ({race}) => {
    return (
        <div id="raceAnimal">
            <p>{race}</p>
        </div>
    )
}

const useApiData = () => {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [error, setError] = useState(null);
    const [races, setRaces] = useState(null);
    const [incompatibility, setIncompatibility] = useState(null);

    useEffect(() => {
        getFetchApi(`adopt/${id}`)
            .then(data => {
                setAnimal(data.animal);
                setRaces(data.animalsRaces);
                setIncompatibility(data.animalsIncompability);

            })
            .catch(err => {
                console.error(err);
                setError("Une erreur est survenue lors du chargement des données.");
            });
    }, [id]);
    return { animal, error, races, incompatibility };
};

const AnimalIdentity = () => {
    const { animal, error, races } = useApiData();
    
    if (error) return <p className="error">{error}</p>;
    if (!animal&&!races) return <p>Chargement ...</p>;

    return (
        <WelcomeSection
            id="AnimalIdentity"
            title={animal.name || "Nom inconnu"}
            content={
                <div className="flex-row alignCenter-AJ">
                    <div className="flex-column alignCenter-AJ">
                        <div className="flex-row alignCenter-AJ">
                            <p>
                                Né{animal.sexe === 2 ? "e" : ""} le {format(new Date(animal.born), "dd MMMM yyyy", { locale: fr })}
                            </p>
                            <div className="flex-row alignCenter-AJ sexe">
                                <img 
                                    src={`/img/animal${animal.sexe === 1 ? "Male" : "Female"}.png`} 
                                    alt={`Icône de sexe ${animal.sexe}`} 
                                />
                                <p>{animal.sexe === 1 ? 'Mâle': "Female"}</p>
                            </div>
                        </div>
                        <div className="flex-row">
                            <p>Espèce: {races[0].espece}</p>
                            <div className="flex-row">
                                <p>Race(s): </p>
                                <div className="all-races flex-row alignCenter-AJ">
                                    {races.map((race, index) => (
                                        <RaceAnimal key={index} race={race.name} />
                                    ))}  
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>Castré/Stérilisé: {animal.isSterile ? "oui" : "non"}</p>
                        </div>
                    </div>
                    {animal.imgName && (
                        <img 
                            src={`/img/${animal.imgName}`} 
                            alt={`Photo de ${animal.name || "l'animal"}`} 
                        />
                    )}
                </div>
            }
        />
    );
};

const AnimalIncompatibility = () => {
    const {incompatibility} = useApiData();
    if(!incompatibility) return (<p>chargement....</p>)
  return (
    <div className="animalIncompatibility flex-column alignCenter-AJ">
      <h3>Incompatibilités: </h3>
      <div className="flex-row">
        {incompatibility.map((img, index) => (
            <div key={index}>
                <img 
                    src={`/img/${img.imgName}`} 
                    alt={ `Image de ${img}`} 
                />  
            </div>
        ))}
      </div>
    </div>
  );
};

const AnimalDescription = ({btnName}) => {
    const navigate = useNavigate();

    const AnimalDetailHandleClick = (event) => {
        event.preventDefault();
        navigate('/adopterProfile');
    };
    const { animal, error, incompatibility } = useApiData();
    if (error) return <p className="error">{error}</p>;
    if (!animal) return <p>Chargement ...</p>;
    return (
        <WelcomeSection 
        id={"animalDescription"}
        content={
            <div className="flex-row alignCenter-AJ">

                {incompatibility ? <AnimalIncompatibility /> :"" }
                <p>
                    {animal.description}
                </p>
            </div>
        }
        nameBtn={btnName != null?btnName: null}
        click={AnimalDetailHandleClick}
        />
    )
}

const AnimalDetail = ({ btnName}) => {
    return (
        <main id="animalDetail">
            <AnimalIdentity />
            <AnimalDescription btnName={btnName} />
        </main>
        
    )
}

export default AnimalDetail;