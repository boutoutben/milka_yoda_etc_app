import uploadsImgUrl from "../utils/uploadsImgUrl";
import AppSection from "../components/AppSection";
import "../css/sumary.css"

const AnimalAdopted = ({animal}) => {
    return(
        <div className="flex-column alignCenter-AJ">
            <img data-testid="animalAdoptedImg" src={uploadsImgUrl(animal.imgName)} alt="" />
            <h3>{animal.name}</h3>
            <p>{new Date().getFullYear() - new Date(animal.born).getFullYear()} ans</p>
        </div>
    )
}

const AdopterInfo = ({data}) => {
    return (
        <AppSection 
            title={"personnel info"}
            content={
                <div className="flex-column alignCenter-AJ">
                    <p>Nom: {data.values.lastname}</p>
                    <p>Prénom: {data.values.firstname}</p>
                    <p>Civilité: {data.values.civility}</p>
                    <p>Age: {data.values.age}</p>
                    <p>code postal: {data.values.adressePostale}</p>
                    <p>Email: {data.values.email}</p>
                    <p>Téléphone: {data.values.phone}</p>
                    <p>A des enfants: {data.values.haveChildren === "true" ? "oui" : "non"}</p>
                    {data.values.haveChildren === "true" &&
                        data.values.child.map((age, index) => (
                            <p key={index}>Enfant {index+1}: {age} ans</p>
                        ))
                    }
                </div>
            }
        />
    )
}

const HaveAnimals = ({values}) => {
    return (
        <AppSection
            title={"Bilan de nos animaux"}
            content={
                <div className="flex-column alignCenter-AJ">
                    <ul>
                        {values.animalCase.map((item, index) => (
                            item !== "Autre" && (
                                <li key={index}>{values.animalNumber[item]} {item}</li>
                            )
                        ))}
                        {values.otherAnimals.map((animal, index) =>  animal.name != "" && (
                             <li key={index}>{animal.number} {animal.name}</li>
                            
                        ))}
                    </ul>
                </div>
            }
        />
    )
}

const LifeRoutine = ({values}) => {
    return (
        <AppSection
            title={"Rythme de vie"}
            content={
                <div className="flex-column alignCenter-AJ">
                    <ul>
                        {values.lifeRoutine.map((item, index) => (
                        <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            }
        />
    )
} 

const HouseType = ({values}) => {
    return (
        <AppSection
            title={'Type d\'habitat'}
            content={
                 <div className="flex-column alignCenter-AJ">
                    <ul>
                        {values.animalPlace.map((item, index) => (
                        <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            }
        />
    )
}

const Motivation = ({data}) => {
    return (
        <AppSection 
            title={"Motivation"}
            content={
                <p>{data.values.motivation}</p>
            }
        />
    )
}

const AdopterDetails = ({data}) => {
    const adoptantValues = data.values;
    return (
        <section id="adopterDetails" className="flex-column">
            <h1>Résumer de votre information</h1>
            <HaveAnimals values={adoptantValues} />
            <LifeRoutine values={adoptantValues} />
            <HouseType values={adoptantValues} />
            <Motivation data={data} />
        </section>
    )
}

const AsideElement = ({data}) => {
    return (
        <aside className="flex-column alignCenter-AJ">
            <AnimalAdopted animal={data.animal}/>
            <AdopterInfo data={data} /> 
        </aside>  
    )
}

const Sumary = ({ sumaryData, extension }) => {
    return (
      <main id="sumary">
        <section className="flex-row">
          <AsideElement data={sumaryData} />
          <AdopterDetails data={sumaryData} />
        </section> 
        {extension}
      </main>  
    );
  };

export {AnimalAdopted, AdopterInfo,HaveAnimals, LifeRoutine, HouseType,Motivation, AdopterDetails,AsideElement, Sumary}