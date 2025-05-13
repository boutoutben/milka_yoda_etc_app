import { useEffect, useRef, useState } from 'react';
import './../css/component.css'
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getFetchApi, isGranted, upluadsImgUrl } from "./App";
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useFormik } from 'formik';
import AddUpdateAnimalSchema from '../validationSchema/AddUpdateAnimalSchema';

export const MainBtn = ({className, isSubmit, name, click, disabled=false}) => {
    return (
       <button
            id="mainBtn"
            className={className}
            type={isSubmit ? "submit" : "button"}
            onClick={click}
            disabled={disabled}
        >
        {name}
        </button>
    )  
}

export const PresentationAnimal = (props) => {
    return (
        <section id='presentationAnimal' onClick={props.handleClick}>
            <div>
                <img src={upluadsImgUrl(props.img)} alt="" />   
                {props.isWaiting&& <img src="img/clockwise.png" alt="" className='waiting' />}
            </div>
            
            <div>
                <div>
                    <p>{props.name}</p>
                    <p>{props.age} ans</p> 
                </div>
                <div className='verticalLine'></div>
                <img src={`img/${props.isMale ? "animalMale.png" : "animalFemale.png"}`} alt="" />
            </div>
        </section>
    );
}

export const AllAnimales = ({animalData, className, root=""}) => {
    const navigate = useNavigate();

     const handleClick = (event, animalId) => {
        event.preventDefault();
        navigate(`${root}${animalId}`);
    };
    return (
        <div id='allAnimal' className={className}>
            {Object.values(animalData).map((animal, index) => (
                <PresentationAnimal key={index} img={animal.imgName} name={animal.name} age={new Date().getFullYear() - new Date(animal.born).getFullYear()} isMale={animal.isMale} handleClick={(event) => handleClick(event, animal.id)} />
            ))}
        </div> 
    );
}

export const WelcomeSection = ({id, title, content, nameBtn, click,isSubmit=false, editAndSup, editClick, onDelete, ref, attributes, listeners, style}) => {
    const granted = isGranted("ADMIN_ROLE");
    return (
        <section ref={ref} style={style} id={id} className='welcomeSection flex-column'>
            {granted && attributes && listeners && (
                 <span
                {...attributes}
                {...listeners}
                className='flex-column alignCenter-AJ'
            >
                <img src='/img/grabImg.png' />
            </span>
            )}
           
            <div className='flex-row alignCenter-AJ relative'>
                {title && <h2>{title}</h2>}
                {editAndSup && granted === true && (
                    <>
                        <p className='editLink' onClick={editClick}>modifier</p>
                        <SupElement onDelete={onDelete} />
                    </>
                    )}
            </div>
            <div className='contentDiv flex-column relative'>
                {content}
            </div>
            {nameBtn && <MainBtn name={nameBtn} className='btnInMain' click={click} isSubmit={isSubmit}/>}
        </section>
        
    )
}

export const CustomSelect = ({data, formik, name, selectValues, searchBar}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState(data);

  const toggleDropdown = () => setIsOpen(!isOpen);


  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
        const filtered = Object.values(data).filter(race =>
            race.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilterValue(filtered);
    }, [searchTerm, data]);

    const filteredName = filterValue
    .filter(values => selectValues.includes(values._id))
    .map(values => values.name);
    console.log(selectValues)
    const displayText =  filteredName.length > 0
    ? filteredName.join(', ')
    : 'Select options';
  return (
    <div className={`custom-select ${isOpen && "isOpen"}`} ref={containerRef}>
        <div
        className="select-box flex-row alignCenter-AJ"
        onClick={toggleDropdown}
      >{displayText}
      <FontAwesomeIcon icon={faChevronDown} className='chevron-down-icon'/>
    </div>
        
      {isOpen && (
        <>
        {searchBar && (
            <div className="search-container relative">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="search" placeholder="Rechercher..." onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>    
        )}
        
        <div
          className="options-container"
        >
          {filterValue.map((option, index) => (
            <div key={index} className="option">
              <label className="checkbox">
                {option.name}
                <input
                    type="checkbox"
                    name={name}
                    value={option._id}
                    checked={formik.values[name].includes(option._id)}
                    onChange={(e) => {
                        const value = e.target.value;
                        let currentValues = formik.values[name];
                        
                        if (!Array.isArray(currentValues)) {
                            currentValues = [];
                        }
                        
                        const newValuesSet = new Set(currentValues);
                        
                        if (newValuesSet.has(value)) {
                            newValuesSet.delete(value);
                        } else {
                            newValuesSet.add(value);
                        }
                        
                        formik.setFieldValue(name, Array.from(newValuesSet));
                    }}
                />
                <span className="check"></span>
                </label>
            </div>
          ))}
          
        </div>
        </>
      )}
      
    </div>
  );
};

export const Logout = ({message}) => {
    const navigate = useNavigate()
    const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/login");
  };
    return (
        <div className="flex-row logout">
            <h1>{message}</h1>
            <img src="/img/logout.png" alt="Se déconnecter" onClick={handleLogoutClick} />
        </div>
    )
}

export const HorizontaleLine = () => {
    return (
        <div className="line"></div>
    )
}

export const  CloseImg = ({click}) => {
    return (
        <img src='/img/close.png' alt='close the page' onClick={click} className='closeImg' />
    )
}

export const PLusBtn = ({ formik, array, element, objectOption }) => {
    const handleClick = () => {
        const newArray = objectOption 
            ? [...array, Object.fromEntries(objectOption.map(key => [key, '']))]
            : [...array, '']; // Add an empty string if no objectOption
        
        formik.setFieldValue(element, newArray);
    };

    return (
        <img
            src='/img/plus.png'
            alt='Bouton pour ajouter'
            onClick={handleClick}
            id='plusBtn'
            className='flex-row alignCenter-AJ'
        />
    );
};

export const SupElement = ({onDelete}) => {   
    return(
        <p className='editLink' onClick={onDelete}>supprimer</p>
    )
}

export default function ScroolToTop() {
    const {pathname} = useLocation();

    useEffect(()=> {
        window.scrollTo(0,0);
    }, [pathname]);

    return null;
}

export const PersonnelInfo = ({formik, btn, message}) => {
    return (
        <WelcomeSection 
            id={"personnalInfo"}
            title={"Info personnelle"}
            content={
                <>
                    {message && <h4 className='userMessage'>{message}</h4>}
                    <div className='flex-row'>
                        <div>
                            <select
                                name="civility"
                                value={formik.values.civility}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur} // utile pour la gestion des erreurs si tu utilises Yup
                                >
                                <option value="">-- Sélectionnez une civilité --</option>
                                <option value="1">Monsieur</option>
                                <option value="2">Madame</option>
                                <option value="3">Autre</option>
                            </select>
                            {formik.touched.civility && formik.errors.civility && (
                                <div className="formError">{formik.errors.civility}</div>
                            )} 
                        </div>
                        <div>
                            <input type="text" name="lastname" placeholder='Nom*' value={formik.values.lastname} onChange={formik.handleChange} />
                            {formik.touched.lastname && formik.errors.lastname && (
                                <div className="formError">{formik.errors.lastname}</div>
                            )}   
                        </div>
                        </div>
                        <div className="flex-row">
                            <div>
                                <input type="text" name="firstname" placeholder='Prénom*' value={formik.values.firstname} onChange={formik.handleChange} /> 
                                {formik.touched.firstname && formik.errors.firstname && (
                                    <div className="formError">{formik.errors.firstname}</div>
                                )}    
                            </div>
                            <div>
                                <input type="number" placeholder='age' name='age' value={formik.values.age} onChange={formik.handleChange} /> 
                                {formik.touched.age && formik.errors.age && (
                                    <div className="formError">{formik.errors.age}</div>
                                )}     
                            </div> 
                        </div>
                        <div className="flex-row">
                            <div>
                                <input type="text" name="adressePostale" placeholder='Code postal*' value={formik.values.adressePostale} onChange={formik.handleChange} />  
                                {formik.touched.adressePostale && formik.errors.adressePostale && (
                                    <div className="formError">{formik.errors.adressePostale}</div>
                                )}    
                            </div>
                            <div>
                                <input type="text" name="phone" placeholder='Téléphone*' value={formik.values.phone} onChange={formik.handleChange} /> 
                                {formik.touched.phone && formik.errors.phone && (
                                    <div className="formError">{formik.errors.phone}</div>
                                )}    
                            </div>
                            
                        </div>
                        <div className='flex-row'>
                            <div>
                                <input type="text" name="email" placeholder='Email*' value={formik.values.email} onChange={formik.handleChange} />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="formError">{formik.errors.email}</div>
                                )}     
                            </div>
                            
                        </div>
                </>
            }
            nameBtn={btn}
            isSubmit={true}
        />
    )
}

export const AlertBox = ({ text, onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="alertBox flex-column alignCenter-AJ">
            <img src="/img/AdoptedCheck.png" alt="" />
            <p>{text}</p>
            <MainBtn name="ok" click={onClose} />
        </div>
    );
};

export const AreYouSure = ({setter, apiUrl}) => {
    const yesClick = () => {
        axios.delete(`http://localhost:5000/api/${apiUrl}`, {
                withCredentials: true
            })
            .then(response => {
                location.reload();
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
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

export const ChooseFile = ({formik}) => {
    return (
        <div className='chooseFile'>
            <input
                type="file"
                name="file"
                id="file"
                onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    if (file) {
                        console.log(event.currentTarget.files)
                        formik.setFieldValue("file", file);
                    }
                    else(
                        console.log("no file")
                    )
                }}
            />
            <label htmlFor="file">Choisir un fichier</label>
        </div>
    )
}

export const FloatFormField = ({ setter, action, content, isTop}) => {
    return (
        <div className={`flex-column alignCenter-AJ floatFormField gap-15 ${isTop && "isTop"}`}>
            <div className="flex-row alignCenter-AJ">
                <h3>{action}</h3>    
                <CloseImg click={setter}/>
            </div>
            {content}
            
        </div>
    )
}

export const AddAnimals = ({apiUrl}) => {
   
    const [races, setRaces] = useState([]);
    const [incompatibility, setIncompatibility] = useState([]);
    const [bornFr, setBornFr] = useState('');
    const [canAdd, setAdd] = useState(false);
    useEffect(() => {
        getFetchApi("adopt/races")
            .then(data => {
                setRaces(data.races);
            })
            .catch(err => {
                console.error(err);
            });
    }, []); 

    const formik = useFormik({
        initialValues: {
            name: "",
            description:'',
            sexe:'',
            file:'',
            animal:'',
            isSterile:'',
            races:[],
            born:"",
            incompatibility: [],
        }, 
        validationSchema:AddUpdateAnimalSchema(true),
        onSubmit: (values) => {
            
             axios.post(`http://localhost:5000/api/${apiUrl}`, values, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                location.reload();
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
            });
        }
    })
    console.log(formik.values.races);
    useEffect(() => {
    }, [formik.values.animal]);
    useEffect(() => {
        getFetchApi("adopt/races", )
            .then(data => {
                setRaces(data.races);
                setIncompatibility(data.incompatibility);
            })
            .catch(err => {
                console.error(err);
            });
    }, []); 

    
    const updateRaces = (espece) => {
        formik.setFieldValue("races", []);
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

  const formatDateToFrench = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleDateChange = (e) => {
    formik.handleChange(e);
    const frenchFormatted = formatDateToFrench(e.target.value);
    setBornFr(frenchFormatted);
  };

    if(!races) return <p>Chargement...</p>
    return (
        <div className='relative'>
            <MainBtn name="Ajouter un animal" className={"btnInMain"} click={() => setAdd(true)}/>
            {canAdd && (
                <FloatFormField isTop={true} setter={() => setAdd(false)} action='Ajouter un animal' content={
                    <form onSubmit={formik.handleSubmit} className="flex-column alignCenter-AJ row-gap-15">
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
                                        <td>Sexe:</td>
                                            <td><select name="sexe" value={formik.values.sexe}
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
                                        <td>Sterile:</td>
                                            <td>
                                                <select name="isSterile" value={formik.values.isSterile}
                                                    onChange={formik.handleChange} >
                                                    <option value="">Sélectionner une réponse</option>
                                                    <option value="0">Oui</option>
                                                    <option value="1">Non</option>
                                                </select>
                                            </td>
                                    </tr>
                                    <tr>
                                        {formik.touched.isSterile && formik.errors.isSterile && (
                                            <td className="formError" colSpan={2} >{formik.errors.isSterile}</td>
                                        )} 
                                    </tr>
                                    <tr>
                                        <td>Date de naissance:</td>
                                        <td><input type="date" name="born" value={formik.values.born} onChange={handleDateChange} /></td>
                                    </tr>
                                    <tr>
                                        {formik.touched.born && formik.errors.born && (
                                            <td className="formError" colSpan={2} >{formik.errors.born}</td>
                                        )} 
                                    </tr>
                                    <tr>
                                        <td>Animal: </td>
                                        <td><select name="animal" id="" value={formik.values.animal}
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
                            <MainBtn name={"Créer"} isSubmit={true} className={"btnInMain"} />  
                        </form> 
            } />
            )}
            
        </div>
    )
}
