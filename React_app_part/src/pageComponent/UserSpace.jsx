import { useEffect, useState } from 'react';
import '../css/userSpace.css'
import { getFetchApi } from './App';
import { Logout, PersonnelInfo, PresentationAnimal, WelcomeSection } from "./Component";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const UserInfoSchema = Yup.object().shape({
    civility: Yup.string()
        .oneOf(['1', '2', '3'], 'Civilité invalide.')
        .required('La civilité est requise.'),
  lastname: Yup.string()
    .min(3, "Le nom doit comporter au moins 3 caractères.")
    .max(50, "Le nombre maximal de caractères du nom est 50.")
    .matches(/^[A-ZÀ-Ÿ][a-zà-ÿ'-]+(?: [A-ZÀ-Ÿ][a-zà-ÿ'-]+)*$/, "Format invalide : ex. Dupont ou Legrand-Duval")
    .required("Le nom est requis."),

  firstname: Yup.string()
    .min(2, "Il faut au moins 2 caractères.")
    .max(50, "Le nombre maximal de caractères est 50.")
    .matches(/^[A-ZÀ-Ÿ][a-zà-ÿ'-]+(?: [A-ZÀ-Ÿ][a-zà-ÿ'-]+)*$/, "Format invalide : ex. Jean ou Marie-Thérèse")
    .required("Le prénom est requis."),

  age: Yup.number("Merci d'entrer un nombre")
    .required("L'âge est requis")
    .integer("L'âge doit être un nombre entier")
    .moreThan(17, "L'âge doit être supérieur à 18 ans"),

  email: Yup.string()
    .email("Adresse e-mail invalide")
    .required("L'e-mail est requis."),

  phone: Yup.string()
    .matches(/^(\+33|0)[1-9](\s?\d{2}){4}$/, "Numéro de téléphone invalide")
    .required("Téléphone requis"),

  adressePostale: Yup.string()
    .matches(/^[0-9]{5}$/, "Le code postal n'est pas conforme")
    .required("Code postal requis"),

});

const UserInfo = ({userInfo}) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [message, setMessage] = useState(null);
  const formik = useFormik({
        initialValues: {
            civility: userInfo?.civility || '',
            lastname: userInfo?.lastname || '',
            firstname: userInfo?.firstname || '',
            adressePostale: userInfo?.adressePostale || '',
            email: userInfo?.email || '',
            phone: userInfo?.phone || '',
            age: userInfo?.age || '',
        },
        validationSchema: UserInfoSchema,
        onSubmit: async (values) => {
            axios.put('http://localhost:5000/api/userSpace', {id: userInfo.id,values:values}, {
                withCredentials: true,
                headers: {
                'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                setMessage(response.data.message);
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
            });
            
        }

    })
  return (
    <form onSubmit={formik.handleSubmit}>
      <PersonnelInfo formik={formik} btn={"mettre à jour"} message={message} />  
    </form>
    
  )
}

const AdoptedAnimals = ({ animals }) => {
  const navigate = useNavigate();
  const handleClick = (event, id) => {
    navigate(`/adopter/${id}`);
  };

  if (!animals) return <p>Chargement ...</p>;

  return (
    <WelcomeSection
      id={"yourAdoption"}
      title="Vos adoption"
      content={
        <div className='flex-row alignCenter-AJ gap-15'>
          {animals.map((animal, index) => (
            <PresentationAnimal
              key={index}
              img={animal.imgName}
              name={animal.name}
              age={new Date().getFullYear() - new Date(animal.born).getFullYear()}
              isMale={animal.isMale}
              handleClick={(event) => handleClick(event, animal.id)}
              isWaiting={!animal.isApprouved}
            />
          ))}
          {Array.isArray(animals) && animals.length === 0 && (
            <h4>Vous n'avez pas encore adopter d'animaux</h4>
          )}
        </div>
      }
    />
  );
};

const UserSpace = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInformation"));
  const token = localStorage.getItem('token');
  const [animals, setAnimals] = useState(null);
  useEffect(() => {
    getFetchApi("userSpace", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      } )
      .then(data => {
        setAnimals(data);
      })
      .catch(err => {
        console.error(err);
      })
}, []);
  
  return (
    <main id='userSpace'>
      <Logout message={`Bienvenue, ${userInfo.firstname || "Utilisateur"}`} />
      <UserInfo userInfo={userInfo} />
      <AdoptedAnimals animals={animals} />
    </main>
  );
};

export default UserSpace;