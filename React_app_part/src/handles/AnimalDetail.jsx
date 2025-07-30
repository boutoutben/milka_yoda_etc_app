import AreYouSure from "../components/areYouSure";
import ChooseFile from "../components/chooseFile";
import FloatFormField from "../components/floatFormField";
import MainBtn from "../components/mainBtn";
import AppSection from "../components/AppSection";
import "./../css/animalDetail.css"
import { useNavigate, useParams } from "react-router-dom";
import getFetchApi from "../utils/getFetchApi";
import uploadsImgUrl from "../utils/uploadsImgUrl";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from "axios";
import { useFormik } from "formik";
import CustomSelect from "../components/customSelect";
import AddUpdateAdoptSchema from "../validationSchema/AddUpdateAnimalSchema";

const useApiData = (currentUrl = window.location.href) => {
    const { id } = useParams();
    const [animal, setAnimal] = useState(null);
    const [error, setError] = useState(null);
    const [races, setRaces] = useState(null);
    const [incompatibility, setIncompatibility] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
        getFetchApi(`adopt/animal/${id}`)
          .then(data => {
            if (data.message === "Animal non trouvé") {
              if (currentUrl.includes("adopter")) {
                navigate("/adopter", { state: { message: "Animal non trouvé" } });
              } else if (currentUrl.includes("mediatorAnimal")) {
                navigate("/mediatorAnimal", { state: { message: "Animal médiateur non trouvé" } });
              }
            }
            setAnimal(data.animal);
            setRaces(data.animalsRaces);
            setIncompatibility(data.animalsIncompability);
          })
          .catch(err => {
            console.error("Erreur serveur:", err.message);
            setError("Une erreur est survenue.");
          });
      }, [id, currentUrl, navigate]);
  
    return { animal, error, races, incompatibility };
  };

const EditAnimal = ({ setEdit, animalData, onReload = () => location.reload() }) => {
    const [races, setRaces] = useState([]);
    const [incompatibility, setIncompatibility] = useState([]);
    const token = localStorage.getItem("token")

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: animalData?.animal?.name || "",
            description: animalData?.animal?.description || '',
            sexe: animalData?.animal?.sexe || '',
            file: animalData?.animal?.file || '',
            animal: animalData?.races?.[0]?.espece || '',
            isSterile: animalData?.animal?.isSterile,
            races: typeof animalData?.animal?.races === 'string'
                ? JSON.parse(animalData.animal.races)
                : animalData?.animal?.races || [],
            born: animalData?.animal?.born
                ? new Date(animalData.animal.born).toISOString().split('T')[0]
                : '',
            incompatibility: typeof animalData?.animal?.incompatibility === 'string'
                ? JSON.parse(animalData.animal.incompatibility)
                : animalData?.animal?.incompatibility || [],
        },
        validationSchema: AddUpdateAdoptSchema(),
        onSubmit: (values) => {
            const formData = new FormData();
            for (const key in values) {
                if (Array.isArray(values[key])) {
                  formData.append(key, JSON.stringify(values[key]))
                } else {
                  formData.append(key, values[key]);
                }
              }
              
            axios.patch(`http://localhost:5000/api/adopt/edit/${animalData.animal.id}`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(() => {
                onReload();
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi:", error.message);
            });
        }
    });

    const updateRaces = (espece) => {
        getFetchApi(`adopt/races?species=${encodeURIComponent(espece)}`)
            .then(data => setRaces(data.races))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        const espece = formik.values.animal;
        if (espece) {
            updateRaces(espece);
        }
    }, [formik.values.animal]);

    useEffect(() => {
        getFetchApi("adopt/races")
            .then(data => {
                setRaces(data.races);
                setIncompatibility(data.incompatibility);
            })
            .catch(err => console.error(err));
    }, []);

    if (!animalData) {
        return <div>Loading...</div>; // ✅ Mise ici : PLUS DE HOOK AVANT CE RETURN
    }

    return (
        <FloatFormField setter={() => setEdit(false)} action={"Modfier l'animal"} isTop={true}
            content={
                <form data-testid={"editForm"} onSubmit={formik.handleSubmit} className="flex-column alignCenter-AJ row-gap-15">
                    <table aria-hidden="true">
                        <tbody>
                            <tr>
                                <td>Nom:</td>
                                <td><input type="text" name="name" placeholder="Nom" value={formik.values.name}
                                    onChange={formik.handleChange} /></td>
                            </tr>
                            <tr>
                                {formik.touched.name && formik.errors.name && (
                                    <td className="formError" colSpan={2} >{formik.errors.name}</td>
                                )}    
                            </tr>
                            <tr>
                                <td>Description:</td>
                                <td><textarea name="description" placeholder="description" value={formik.values.description}
                                    onChange={formik.handleChange} /></td>
                            </tr>
                            <tr>
                                {formik.touched.description && formik.errors.description && (
                                    <td className="formError" colSpan={2} >{formik.errors.description}</td>
                                )} 
                            </tr>
                            <tr>
                                <td><label htmlFor="sexe">Sexe:</label></td>
                                <td><select id="sexe" name="sexe" value={formik.values.sexe}
                                        onChange={formik.handleChange} >
                                        <option value="">Sélectionner un sexe</option>
                                        <option value="1">Mâle</option>
                                        <option value="2">Female</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                {formik.touched.sexe && formik.errors.sexe && (
                                    <td className="formError" colSpan={2} >{formik.errors.sexe}</td>
                                )} 
                            </tr>
                            <tr>
                                <td><label htmlFor="isSterile">Sterile:</label></td>
                                <td><select id="isSterile" name="isSterile" value={formik.values.isSterile}
                                    onChange={formik.handleChange} >
                                        <option value="">Sélectionner une réponse</option>
                                        <option value={'0'}>Oui</option>
                                        <option value={"1"}>Non</option>
                                    </select>
                                </td>
                             </tr>
                             <tr>
                                {formik.touched.isSterile && formik.errors.isSterile && (
                                    <td className="formError" colSpan={2} >{formik.errors.isSterile}</td>
                                )} 
                            </tr>
                            <tr>
                                <td><label htmlFor="born">Date de naissance:</label></td>
                                <td><input id="born" type="date" name="born" value={formik.values.born} onChange={formik.handleChange} /></td>
                            </tr>
                            <tr>
                                {formik.touched.born && formik.errors.born && (
                                    <td className="formError" colSpan={2} >{formik.errors.born}</td>
                                )} 
                            </tr>
                            <tr>
                                <td><label htmlFor="animal">Animal:</label></td>
                                <td><select name="animal" id="animal" value={formik.values.animal}
                                    onChange={formik.handleChange} >
                                    <option value="">Choisir un animal</option>
                                    <option value="chien">Chien</option>
                                    <option value="chat">Chat</option>
                                    </select></td>
                                </tr>
                                <tr>
                                    {formik.touched.animal && formik.errors.animal && (
                                        <td className="formError" colSpan={2} >{formik.errors.animal}</td>
                                    )} 
                                </tr>
                                <tr>
                                    <td>race:</td>
                                    <td>
                                        <CustomSelect data={races} formik={formik} name={"races"} selectValues={formik.values.races} searchBar={true} />
                                    </td>
                                </tr>
                                <tr>
                                    {formik.touched.races && formik.errors.races && (
                                        <td className="formError" colSpan={2} >{formik.errors.races}</td>
                                    )} 
                                </tr>
                                <tr>
                                    <td>Incompatibilité:</td>
                                    <td>
                                        <CustomSelect data={incompatibility} formik={formik} name={"incompatibility"} selectValues={formik.values.incompatibility} />
                                    </td>
                                </tr>
                                <tr>
                                    {formik.touched.incompatibility && formik.errors.incompatibility && (
                                        <td className="formError" colSpan={2} >{formik.errors.incompatibility}</td>
                                    )} 
                                </tr>
                            </tbody>
                        </table>
                    <div>
                    <ChooseFile formik={formik}/>
                        {formik.touched.file && formik.errors.file && (
                            <div className="formError" colSpan={2} >{formik.errors.file}</div>
                        )}    
                    </div>
                    <MainBtn name={"Mettre à jour"} isSubmit={true} className={"btnInMain"} />  
                </form> 
            }
        />
    )
};

const RaceAnimal = ({race}) => {
    return (
        <div id="raceAnimal">
            <p>{race}</p>
        </div>
    )
}

const AnimalIdentity = ({apiData}) => {
    const { animal, error, races } = apiData;
    const [canEdit, setCanEdit] = useState(false);
    const [canDelete, setCanDelete] = useState(false);

    if (error) return <p className="error">{error}</p>;
    if (!animal || !races) return <p>Chargement ...</p>;

    const sexeLabel = animal.sexe === 1 ? "Mâle" : "Femelle";
    const sexeImage = `/img/animal${animal.sexe === 1 ? "Male" : "Female"}.png`;
    const naissanceLabel = `Né${animal.sexe === 2 ? "e" : ""} le ${format(new Date(animal.born), "dd MMMM yyyy", { locale: fr })}`;
    const sterilisationLabel = animal.isSterile === 1 ? "oui" : "non";

    return (
        <div className="relative">
            <AppSection
                id="AnimalIdentity"
                title={animal.name || "Nom inconnu"}
                editAndSup
                onEdit={() => setCanEdit(true)}
                onDelete={() => setCanDelete(true)}
                content={
                    <div className="flex-row alignCenter-AJ">
                        <div className="flex-column alignCenter-AJ">
                            <div className="flex-row alignCenter-AJ">
                                <p>{naissanceLabel}</p>
                                <div className="flex-row alignCenter-AJ sexe">
                                    <img src={sexeImage} alt={`Icône de sexe ${animal.sexe}`} />
                                    <p>{sexeLabel}</p>
                                </div>
                            </div>

                            <div className="flex-row">
                                <p>Espèce : {races[0].espece}</p>
                                <div className="flex-row">
                                    <p>Race(s) : </p>
                                    <div className="all-races flex-row alignCenter-AJ">
                                        {races.map((race, index) => (
                                            <RaceAnimal key={index} race={race.name} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <p>Castré/Stérilisé : {sterilisationLabel}</p>
                            </div>
                        </div>

                        {animal.imgName && (
                            <img
                                src={uploadsImgUrl(animal.imgName)}
                                alt={`Photo de ${animal.name || "l'animal"}`}
                            />
                        )}
                    </div>
                }
            />

            {canEdit && (
                <>
                    <EditAnimal setEdit={setCanEdit} animalData={apiData} />
                </>
            )}

            {canDelete && (
                <AreYouSure
                    setter={() => setCanDelete(false)}
                    apiUrl={`adopt/delete/${animal.id}`}
                />
            )}
        </div>
    );
};

const AnimalIncompatibility = ({apiData}) => {
    const {incompatibility} = apiData;
    if(!incompatibility) return (<p>chargement....</p>)
  return (
    <div data-testid='animalIncompatibility' className="animalIncompatibility flex-column alignCenter-AJ">
      <h3>Incompatibilités: </h3>
      <div className="flex-row">
        {incompatibility.map((img, index) => (
            <div key={index}>
                <img 
                    data-testid={"incompatibilityImg"}
                    src={`/img/${img.imgName}`} 
                    alt={ `Image de ${img}`} 
                />  
            </div>
        ))}
      </div>
    </div>
  );
};

const AnimalDescription = ({btnName, apiData}) => {
    const navigate = useNavigate();
    const { animal, error, incompatibility } = apiData;
    const AnimalDetailHandleClick = (event) => {
        event.preventDefault();
        navigate('/adopterProfile', {
            state:animal
        });
    };
    
    if (error) return <p className="error">{error}</p>;
    if (!animal) return <p>Chargement ...</p>;
    return (
        <AppSection 
            id={"animalDescription"}
            content={
                <div className="flex-row alignCenter-AJ">
                    {Array.isArray(incompatibility) && incompatibility.length > 0 && (
                        <AnimalIncompatibility apiData={apiData} />
                    )}
                    <p>
                        {animal.description}
                    </p>
                </div>
            }
            nameBtn={btnName != null?btnName: null}
            click={AnimalDetailHandleClick}
            disable={animal.isAdopted}
        />
    )
}

export {useApiData,EditAnimal, RaceAnimal, AnimalIdentity, AnimalIncompatibility, AnimalDescription}