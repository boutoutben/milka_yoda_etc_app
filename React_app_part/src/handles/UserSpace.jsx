import { useFormik } from "formik";
import axios from 'axios';
import UserInfoSchema from '../validationSchema/UserInfoSchema';
import PersonnelInfo from '../components/personnelInfo';
import PresentationAnimal from '../components/presentationAnimal';
import AppSection from '../components/AppSection';
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import getFetchApi from "../utils/getFetchApi";
import useEncryptData from "../utils/encryptData";

const UserInfo = ({ personnelInfo, navigate }) => {
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem('token');
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
          const encryptedData = await useEncryptData(values)
          
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
            console.error("Une erreur est survenue:", err.message);
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

  UserInfo.propTypes = {
    personnelInfo: PropTypes.shape({
        id: PropTypes.number,
        adressePostale: PropTypes.string,
        civility: PropTypes.number,
        lastname: PropTypes.string,
        firstname: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        age: PropTypes.number
    }),
    navigate: PropTypes.func
  }

  const AdoptedAnimals = ({ animals, navigate }) => {
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
                key={animal.id}
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

  AdoptedAnimals.propTypes = {
    animals: PropTypes.shape({
        id: PropTypes.number,
        imgName: PropTypes.string,
        name: PropTypes.string,
        born: PropTypes.string,
        isMale: PropTypes.bool,
        isApprouved: PropTypes.bool,
        map: PropTypes.func,
        length: PropTypes.func
    }),
    navigate: PropTypes.func
  }

  const useGetUserAnimals = (navigate) => {
    const [animals, setAnimals] = useState(null);
    const token = localStorage.getItem('token');
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
            const status = err?.response?.status || err?.status;
            if (status === 403 || status === 401) {
              navigate("/login", { state: { error: "Vous n'êtes pas ou plus autorisé" } });
            } else {
              console.error("Une erreur est survenue:", err.message);
            }
          });
    }, []);

    return animals
  }

  const useGetPersonnelData = () =>{
    const [personnelInfo, setPersonnelInfo] = useState(null);
    useEffect(() => {
    const token = localStorage.getItem('token');
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
      console.error("Erreur lors de la récupération des infos personnelles:", err.message);
    });
  }, []); 

      return personnelInfo
  }

  export {UserInfo, AdoptedAnimals, useGetUserAnimals, useGetPersonnelData }