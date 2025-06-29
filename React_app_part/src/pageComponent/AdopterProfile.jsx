import { useFormik } from 'formik';
import '../css/adopterProfile.css';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MainBtn from '../components/mainBtn';
import PLusBtn from '../components/plusBtn';
import AppSection from '../components/AppSection';
import DeleteElement from '../components/deleteElement';
import PersonnelInfo from '../components/personnelInfo';
import getFetchApi from '../utils/getFetchApi';
import AdopterProfileSchema from '../validationSchema/adoptProfileSchema';

const CheckBoxElement = ({ array, formik, name }) => {
  return (
    <div className="flex-row checkbox-align">
      {array.map((label) => (
        <label className="checkbox" key={label}>
          {label}
          <input
            type="checkbox"
            name={name}
            value={label}
            checked={formik.values[name].includes(label)}
            onChange={(e) => {
              const value = e.target.value;
              const currentValues = new Set(formik.values[name]);
              if (currentValues.has(value)) {
                currentValues.delete(value);
              } else {
                currentValues.add(value);
              }
              formik.setFieldValue(name, Array.from(currentValues));
            }}
          />
          <span className="check"></span>
        </label>
      ))}
    </div>
  );
};




const AnimalsPlace = ({formik}) =>{
    const values = ['Maison avec jardin',"Maison avec cour", "Maison sans jardin", "Appart avec balcon sécurisé", "Apport sans balcon"]
    return (
        <AppSection
                title={"Lieux de vie de l'animal"}
                content={
                    <>
                        <CheckBoxElement array={values} formik={formik} name={"animalPlace"} />
                        {formik.touched.animalPlace && formik.errors.animalPlace && (
                            <div className="formError">{formik.errors.animalPlace}</div>
                        )}
                    </>
                    
                }
            />    
    )
    
}

const HaveAnimals = ({formik}) => {
    const haveAnimales = 
        [
            "Pas encore",
            "Chien",
            "Chat",
            "Rongeur",
            "Autre",
        ];
    useEffect(() => {
  console.log("formik.errors", formik.errors);
}, [formik.errors]);
    return(
        <section id='haveAnimals' className='flex-column'>
            <h2>Avez-vous des animaux</h2>
            <div className="flex-column checkbox-align">
                {haveAnimales.map((label, key) => (
                    <div
                        key={key}
                        className={`${label === 'Autre' ? 'flex-column' : 'flex-row alignCenter-AJ'} animalCaseElement`}
                    >
                        <label className="checkbox">
                        {label}
                        <input
                            type="checkbox"
                            name="animalCase"
                            value={label}
                            checked={formik.values.animalCase.includes(label)} // <--- ici c'est la clef !!
                            onChange={(e) => {
                                const value = e.target.value;
                                let newValues = [...formik.values.animalCase];

                                if (newValues.includes(value)) {
                                newValues = newValues.filter((v) => v !== value);
                                } else {
                                newValues.push(value);
                                }
                                formik.setFieldValue("animalCase", newValues);
                            }}
                            />
                        <span className="check"></span>
                        </label>

                        {/* Input number for classical animals */}
                        {formik.values.animalCase.includes(label) &&
                            label !== "Pas encore" &&
                            label !== "Autre" && (
                                <div>
                                <input
                                    type="number"
                                    name={`animalNumber.${label}`}
                                    placeholder={`Nombre de ${label}`}
                                    value={formik.values.animalNumber?.[label] || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        formik.setFieldValue(`animalNumber.${label}`, value === '' ? '' : Number(value));
                                        }}
                                    onBlur={formik.handleBlur}
                                />
                                </div>
                            )}
                        {formik.errors.animalNumber?.[label] && (
                            <div className="formError">{formik.errors.animalNumber[label]}</div>
                        )}
                        {/* Inputs for "Autre" */}
                        {formik.values.animalCase.includes(label) && label === "Autre" && (
                        <>
                            {formik.values.otherAnimals.map((animal, index) => (
                                <div key={index} className="flex-column otherElement">
                                    <div className='flex-row'>
                                        <label><h4>Animal {index + 1} :</h4></label> 
                                        <SupElement onDelete={() => {
                                            const newOtherAnimals = formik.values.otherAnimals.filter((_, i) => i !== index);
                                            formik.setFieldValue('otherAnimals', newOtherAnimals);
                                        }}  />    
                                    </div>
                                    <input
                                        type="text"
                                        name={`otherAnimals[${index}].name`}
                                        placeholder="Nom de l'animal"
                                        value={animal.name || ''}
                                        onChange={formik.handleChange}
                                    />
                                    {typeof formik.errors.otherAnimals?.[index]?.name === 'string' && (
                                        <div className="formError">{formik.errors.otherAnimals[index].name}</div>
                                    )}
                                    
                                    <input
                                        type="number"
                                        name={`otherAnimals[${index}].number`}
                                        placeholder="Nombre"
                                        value={animal.number || ''}
                                        onChange={formik.handleChange}
                                    />
                                    {typeof formik.errors.otherAnimals?.[index]?.number === 'string' && (
                                        <div className="formError">{formik.errors.otherAnimals?.[index]?.number}</div>
                                    )}
                                </div>
                            
                            ))}
                            
                            {/* Plus button outside the map */}
                            <PLusBtn formik={formik} array={formik.values.otherAnimals} objectOption={["name", "number"]} element={"otherAnimals"} />
                        </>
                        )}
                        
                    </div>
                    ))}
                    {formik.touched.animalCase && formik.errors.animalCase && (
                        <div className="formError">{formik.errors.animalCase}</div>
                    )}
                </div>
                {formik.touched.otherAnimals && formik.errors.otherAnimals && (
                    <div className="formError">{formik.errors.otherAnimals}</div>
                )}
        </section>
    )
}

const FamillyField = ({ formik }) => {
  const lifeRoutine = [
    "Calme",
    "Dynamique",
    "Sportif",
    "Urbain",
    "En campagne",
    "Amoureux de la nature",
  ];

  useEffect(() => {
    if (formik.values.haveChildren === "true" && formik.values.child.length === 0) {
      formik.setFieldValue("child", [""]);
    } else if (formik.values.haveChildren === "false" && formik.values.child.length > 0) {
      formik.setFieldValue("child", []);
    }
  }, [formik.values.haveChildren, formik.values.child.length]);

  const haveChildrenElement = () => (
    <div className="flex-column childrenElement">
      {formik.values.child.map((_, index) => (
        <div className="flex-column alignCenter-AJ" key={index}>
          <div className="flex-row">
            <label>Enfant {index + 1}:</label>
            <DeleteElement
              onDelete={() => {
                const newChildren = [...formik.values.child];
                newChildren.splice(index, 1);
                formik.setFieldValue("child", newChildren);
              }}
            />
          </div>

          <input
            type="number"
            placeholder={`Âge enfant ${index + 1}`}
            name={`child[${index}]`}
            value={formik.values.child[index] || ""}
            onChange={formik.handleChange}
            className="smallInput"
          />
          {formik.errors.child && formik.errors.child[index] && (
            <div className="formError">{formik.errors.child[index]}</div>
          )}
        </div>
      ))}
      <PLusBtn formik={formik} array={formik.values.child} element={"child"} />
    </div>
  );

  return (
    <section className="flex-column">
      <h2>Cadre familial</h2>
      <h3>Quel est votre mode de vie ?</h3>
      <CheckBoxElement array={lifeRoutine} formik={formik} name={"lifeRoutine"} />
      {formik.touched.lifeRoutine && formik.errors.lifeRoutine && (
        <div className="formError">{formik.errors.lifeRoutine}</div>
      )}

      <h3>Avez-vous des enfants ?</h3>
      <div className="flex-row checkbox-align">
        <label className="radio">
          Oui
          <input
            type="radio"
            name="haveChildren"
            value="true"
            checked={formik.values.haveChildren === "true"}
            onChange={formik.handleChange}
          />
          <span className="check"></span>
        </label>

        <label className="radio">
          Non
          <input
            type="radio"
            name="haveChildren"
            value="false"
            checked={formik.values.haveChildren === "false"}
            onChange={formik.handleChange}
          />
          <span className="check"></span>
        </label>
      </div>
      {formik.touched.haveChildren && formik.errors.haveChildren && (
        <div className="formError">{formik.errors.haveChildren}</div>
      )}

      {formik.values.haveChildren === "true" && haveChildrenElement()}
    </section>
  );
};

const Motivation = ({formik}) => {
    return (
        <section id='modivation' className='flex-column'>
            <h2>Vos motivations</h2>
            <textarea name="motivation" placeholder='message...' value={formik.values.motivation} onChange={formik.handleChange} ></textarea>
            {formik.touched.motivation && formik.errors.motivation && (
                <div className="formError">{formik.errors.motivation}</div>
            )}
        </section>
    )
}

const AcceptationCondition = ({formik}) => {
    return (
        <section id='acceptationCondition'>
            <label className='checkbox'> J'accepte que ces informations soient transmise à l'association pour s'assurer du bien être de l'animal
                <input
                    type="checkbox"
                    name="accept"
                    id="other"
                    checked={formik.values.accept}
                    onChange={formik.handleChange}
                />
                <span className='check'></span>  
            </label> 
            {formik.touched.accept && formik.errors.accept && (
                <div className="formError">{formik.errors.accept}</div>
            )}  
        </section>
    )
}

const AdopterBtn = ({handleResetClick}) => {
    
    return (
        <div className='flex-row alignCenter-AJ'>
            <MainBtn name="Recommencer" click={handleResetClick} />
            <MainBtn name="Envoyer" isSubmit={true} />
        </div>
    )
}

const AdopterForm = () => {
    const location = useLocation();
    const token = localStorage.getItem("token");
    const [userInfo, setUserInfo] = useState({});
    useEffect(() => {
      if (!token) return;
      getFetchApi("user/fetchPersonnelInfos", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      })
        .then(data => {
          if (data && data.length > 0) {
            setUserInfo(data[0])
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Erreur lors de la récupération des infos personnelles :", err);
          }

        });
    }, [token]);
    const navigate = useNavigate();
    const state = location.state;
    const formik = useFormik({
      enableReinitialize: true,
        initialValues: {
            civility: state?.previousValues?.civility || userInfo?.civility || '',
            lastname: state?.previousValues?.lastname || userInfo?.lastname || '',
            firstname: state?.previousValues?.firstname || userInfo?.firstname || '',
            adressePostale: state?.previousValues?.adressePostale || userInfo?.adressePostale || '',
            email: state?.previousValues?.email || userInfo?.email || '',
            phone: state?.previousValues?.phone || userInfo?.phone || '',
            animalCase: state?.previousValues?.animalCase || [],
            animalNumber: state?.previousValues?.animalNumber || {},
            otherAnimals: state?.previousValues?.otherAnimals || [{ name: '', number: '' }],
            lifeRoutine: state?.previousValues?.lifeRoutine || [],
            haveChildren: state?.previousValues?.haveChildren || '',
            motivation: state?.previousValues?.motivation || '',
            accept: state?.previousValues?.accept || false,
            animalPlace: state?.previousValues?.animalPlace || [],
            age: state?.previousValues?.age || userInfo?.age || '',
            child: state?.previousValues?.child || [],
        },
        validationSchema: AdopterProfileSchema,
        onSubmit: async (values) => {
            navigate("/adopterSumary", { 
                state: {
                    values: values,
                    animal: state?.previousAnimal || state
                }
            });
            
        }
    })

    const handleResetClick = () => {
        formik.resetForm();
    }
    return (
        <form className='flex-column row-gap-25' onSubmit={formik.handleSubmit}>
            <PersonnelInfo formik={formik} />
            <AnimalsPlace formik={formik}/>
            <HaveAnimals formik={formik} />
            <FamillyField formik={formik} />
            <Motivation formik={formik} />
            <AcceptationCondition formik={formik} />
            <AdopterBtn handleResetClick={handleResetClick}/>
        </form>
    )
}

const AdopterProfile = () =>{
    return (
        <main id="adopterProfile">
            <h1>Information de l'adoptant</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat.</p>
            <AdopterForm />
        </main>
    )
}

export default AdopterProfile;