import { useEffect, useState } from 'react';
import '../css/userSpace.css'
import encryptWithPublicKey from '../utils/encryptWithPublicKey';
import getFetchApi from '../utils/getFetchApi';
import Logout from '../components/logout';
import PersonnelInfo from '../components/personnelInfo';
import PresentationAnimal from '../components/presentationAnimal';
import AppSection from '../components/AppSection';
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

const UserInfo = ({ personnelInfo }) => {
  const [publicKey, setPublicKey] = useState('');
  
  const [message, setMessage] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // 1. Récupération de la clé publique (une seule fois)
  useEffect(() => {
    getFetchApi("encrypt/public-key")
      .then(data => {
        setPublicKey(data);
      })
      .catch(err => {
        console.log("Erreur lors de la récupération de la clé publique :", err);
      });
  }, []);

  // 2. Récupération des infos personnelles avec abort
  

  // 3. Formik avec enableReinitialize pour se mettre à jour avec personnelInfo
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      civility: personnelInfo?.civility || '',
      lastname: personnelInfo?.lastname || '',
      firstname: personnelInfo?.firstname || '',
      adressePostale: personnelInfo?.adressePostale || '',
      email: personnelInfo?.email || '',
      phone: personnelInfo?.phone || '',
      age: personnelInfo?.age || '',
    },
    validationSchema: UserInfoSchema,
    onSubmit: async (values) => {
      try {
        const encryptedData = await encryptWithPublicKey(values, publicKey);
        const response = await axios.put(
          'http://localhost:5000/api/user',
          { id: personnelInfo.id, data: encryptedData },
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        setMessage(response.data.message);
        localStorage.setItem("userInformation", JSON.stringify(response.data.userInfo));
      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/login", { state: { error: "Vous n'êtes pas ou plus autorisé" } });
        } else {
          console.error("Unexpected error:", err.message);
        }
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <PersonnelInfo formik={formik} btn={"Mettre à jour"} message={message} />
    </form>
  );
};

const AdoptedAnimals = ({ animals }) => {
  const navigate = useNavigate();
  const handleClick = (event, id) => {
    navigate(`/adopter/${id}`);
  };

  if (!animals) return <p>Chargement ...</p>;

  return (
    <AppSection
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
  const token = localStorage.getItem('token');
  const [animals, setAnimals] = useState(null);
  const [personnelInfo, setPersonnelInfo] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    getFetchApi("user", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      } )
      .then(data => {
        setAnimals(data);
      })
      .catch(err => { 
        if (err.status === 403) {
          navigate("/login", { state: { error: "Vous n'êtes pas ou plus authorisée" } });
        } else {
          console.error("Unexpected error:", err.message);
        }
      });
}, []);
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
        setPersonnelInfo(data[0]);
      }
    })
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error("Erreur lors de la récupération des infos personnelles :", err);
      }
    });

}, [token]);
  
  return (
    <main id='userSpace'>
      <Logout message={`Bienvenue, ${personnelInfo.firstname || "Utilisateur"}`} />
      <UserInfo personnelInfo={personnelInfo} />
      <AdoptedAnimals animals={animals} />
    </main>
  );
};

export default UserSpace;