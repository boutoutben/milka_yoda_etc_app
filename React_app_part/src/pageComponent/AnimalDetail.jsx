import { WelcomeSection } from "./Component";
import "./../css/animalDetail.css"

const RaceAnimal = ({race}) => {
    return (
        <div id="raceAnimal">
            <p>{race}</p>
        </div>
    )
}

const AnimalIdentity = () => {
    return (
        <WelcomeSection
        id='AnimalIdentity'
        title={'Animal 1'}
        content={
            <div className="flex-row alignCenter-AJ">
                <div className="flex-column alignCenter-AJ">
                    <div className="flex-row alignCenter-AJ">
                        <p>née le 07-02-2024 </p>
                        <div className="flex-row alignCenter-AJ sexe">
                            <img src="img/animalMale.png" alt="" />
                            <p>mâle</p>
                        </div>
                    </div>
                    <div className="flex-row">
                        <p>Espèce: chien</p>
                        <div className="flex-row">
                            <p>Race(s): </p>
                            <div className="all-races flex-row alignCenter-AJ">
                                <RaceAnimal race={"Berger allemand"} />
                                <RaceAnimal race={"Malinois"} />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p>Castré/Stérilisé: oui</p>
                    </div>
                </div>
                <img src="img/voyou.JPG" alt="" />
            </div>
        }
        className= "c"
        />
    )
}

const AnimalIncompatibility = ({ incompatibilityImgAndAlt }) => {
  return (
    <div className="animalIncompatibility flex-column alignCenter-AJ">
      <h3>Incompatibilités: </h3>
      <div className="flex-row">
        {incompatibilityImgAndAlt.map((img, index) => (
            <img key={index} src={`img/${img[0]}`} alt={img[1]} />
        ))}
      </div>
    </div>
  );
};

const AnimalDescription = ({btnName, incompatibilityImgAndAlt}) => {
    return (
        <WelcomeSection 
        id={"animalDescription"}
        content={
            <div className="flex-row">
                {incompatibilityImgAndAlt !== null ? <AnimalIncompatibility incompatibilityImgAndAlt={incompatibilityImgAndAlt} /> : ''}
                <p>
                    Rex est un magnifique Berger Allemand au pelage noir et fauve, avec une allure noble et une présence imposante. Doté d’un regard vif et expressif, il est à la fois attentif et plein d’énergie. Toujours prêt à apprendre, il adore les séances d’entraînement et les jeux de réflexion, ce qui en fait un compagnon idéal pour les activités en extérieur.
                    Très attaché à sa famille, Rex est un chien protecteur qui veille sur son foyer avec sérieux. Derrière son apparence impressionnante, il cache un grand cœur et une affection débordante pour ses proches. Il aime les longues promenades, les séances de jeu et les moments de complicité avec son maître.
                </p>
                
            </div>
        }
        nameBtn={btnName != null?btnName: null}
        />
    )
}

const AnimalDetail = ({incompatibilityImgAndAlt=null, btnName}) => {
    return (
        <main id="animalDetail">
            <AnimalIdentity />
            <AnimalDescription incompatibilityImgAndAlt={incompatibilityImgAndAlt} btnName={btnName} />
        </main>
        
    )
}

export default AnimalDetail;