import MainBtn from "../components/mainBtn";
import axios from "axios";
import emailjs from '@emailjs/browser';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import getFetchApi from "../utils/getFetchApi";
import AlertBox from "../components/alertBox";
import PropTypes from "prop-types";
import getEnvVars from "../utils/getEnvVars";

const {VITE_GMAIL_SERVICE_ID, VITE_GMAIL_AUTO_REPLY_MODELE_ID, VITE_GMAILJS_PUBLIC_KEY} = getEnvVars();

const handleRefuseClick = (data, setAlert, navigate) => {
    const token = localStorage.getItem('token');
    axios.delete(`http://localhost:5000/api/user/admin/refuse/${data.values.id}`, {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${token}`
        }
        })
        .then(() => {
            emailjs.send(
              VITE_GMAIL_SERVICE_ID, 
              VITE_GMAIL_AUTO_REPLY_MODELE_ID,
            {
                name: data.values.firstname,
                message: `Nous avons le malheure de vous dire que votre profil ne convient pas à ${data.animal.name}. Pour plus de détails, vous pouvez nous contacter`,
                email: data.values.email
            },
            VITE_GMAILJS_PUBLIC_KEY
            )
            .then(() => {
                setAlert("Adoption refusée");
                setTimeout(() => {
                    navigate("/adminSpace");
                }, 3000);
            })
            .catch((err) => {
                console.error("Erreur lors de l'envoi de l'email:", err.message);
            });
        })
        .catch(error => {
        console.error("Erreur lors de l'envoi:", error.message);
    });
}

const handleAcceptClick = (data, setAlert, navigate) => {
    const token = localStorage.getItem('token');
    axios.patch(
        `http://localhost:5000/api/user/admin/accept/${data.values.id}`,
        {},
        {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )
      .then(() => {
        console.log(VITE_GMAILJS_PUBLIC_KEY);
        emailjs.send(
            VITE_GMAIL_SERVICE_ID, // ID de service EmailJS
            VITE_GMAIL_AUTO_REPLY_MODELE_ID, // ID de modèle EmailJS
          {
            name: data.values.firstname,
            message: `Nous avons le plaisir de vous annoncer que la demande d'adoption de ${data.animal.name} est acceptée. Nous allons vous contacter d'ici peu afin de convenir d'une date et d'un lieu pour la suite de la procédure.`,
            email: data.values.email
          },
          VITE_GMAILJS_PUBLIC_KEY 
        )
        .then(() => {
          setAlert("Adoption acceptée");
          setTimeout(() => {
            navigate("/adminSpace");
          }, 3000);
        })
        .catch((err) => {
          console.error("Erreur lors de l'envoi de l'email:", err.message);
        });
      })
        .catch(error => {
            console.error("Erreur lors de l'envoi:", error.message);
        });
    };

const ApprouvedBtn = ({data, setAlert}) => {
    const navigate = useNavigate();
    return (
        <div className="flex-row">
            <MainBtn name={"Refuser"}  click={() => handleRefuseClick(data, setAlert, navigate)}/>
            <MainBtn name={"Accepter"} click={() => handleAcceptClick(data, setAlert, navigate)} />
        </div>
    )
}

ApprouvedBtn.propTypes = {
    data: PropTypes.object,
    setAlert: PropTypes.func
}

const useFetchData = (id) => {
    const [data, setData] = useState(null);
    const token = localStorage.getItem('token');
    useEffect(() => {
        getFetchApi(`user/admin/adopterApprouved/${id}`,
            {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }
        )
        .then(response => {
            setData(response);
        })
        .catch(err => {
            console.error("Erreur lors de la recherche:", err.message);
        })
    }, []);

    return data
}

const RenderAlertBox = ({ alert, setAlert }) => {
    return (
      <>
        {alert && (
          <AlertBox
            text={alert}
            onClose={() => setAlert(null)}
          />
        )}
      </>
    );
  };

  RenderAlertBox.propTypes = {
    alert: PropTypes.string,
    setAlert: PropTypes.func
  }

export {handleAcceptClick, handleRefuseClick, ApprouvedBtn, useFetchData, RenderAlertBox}