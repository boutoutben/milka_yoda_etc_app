import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import getFetchApi from "../utils/getFetchApi";
import Sumary from "./Sumary";
import AlertBox from "../components/alertBox";
import HorizontaleLine from "../components/horizontaleLine";
import MainBtn from "../components/mainBtn";
import axios from "axios";
import emailjs from '@emailjs/browser';

const ApprouvedBtn = ({data, alert, setAlert}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const handleRefuseClick = () => {
        axios.delete(`http://localhost:5000/api/user/admin/refuse/${data.values.id}`, {
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${token}`
            }
            })
            .then(() => {
                emailjs.send(
                "service_rudbrtp", // Remplacez par votre ID de service EmailJS
                "template_19q913g", // Remplacez par votre ID de modèle EmailJS
                {
                    name: data.values.firstname,
                    message: `Nous avons le ... que votre profil ne convient pas à ${data.animal.name}. Pour plus de détails, vous pouvez nous contacter`,
                    email: data.values.email
                },
                "mHP87VvYc_0rTgwUu" // Remplacez par votre clé publique EmailJS
                )
                .then((result) => {
                    console.log("✅ Email envoyé :", result.text);
                    setAlert("Adoption accepté");
                    setTimeout(() => {
                        navigate("/adminSpace");
                    }, 3000);
                })
                .catch((err) => {
                    console.error("❌ Erreur lors de l'envoi de l'email :", err.text);
                    alert("Échec de l'envoi du message.");
                });
                setAlert("Adoption refusé");
                setTimeout(() => {
                navigate("/adminSpace");
            }, 3000);
            })
            .catch(error => {
            console.error("Erreur lors de l'envoi :", error);
        });
    }
    const handleAcceptClick = () => {
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
                console.log("Demande d'adoption acceptée.");
                console.log(data.values.email);

                emailjs.send(
                "service_rudbrtp", // Remplacez par votre ID de service EmailJS
                "template_19q913g", // Remplacez par votre ID de modèle EmailJS
                {
                    name: data.values.firstname,
                    message: `Nous avons le plaisir de vous annoncer que la demande d'adoption de ${data.animal.name} est acceptée. Nous allons vous contacter d'ici peu afin de convenir d'une date et d'un lieu pour la suite de la procédure.`,
                    email: data.values.email
                },
                "mHP87VvYc_0rTgwUu" // Remplacez par votre clé publique EmailJS
                )
                .then((result) => {
                console.log("✅ Email envoyé :", result.text);
                setAlert("Adoption accepté");
                setTimeout(() => {
                    navigate("/adminSpace");
                }, 3000);
                })
                .catch((err) => {
                console.error("❌ Erreur lors de l'envoi de l'email :", err.text);
                    alert("Échec de l'envoi du message.");
                });
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
            });
        };
    return (
        <div className="flex-row">
            <MainBtn name={"Refuser"}  click={handleRefuseClick}/>
            <MainBtn name={"Accepter"} click={handleAcceptClick} />
        </div>
    )
}

const ApprouvedAdoption = () => {
    const {id} = useParams();
    const token = localStorage.getItem('token');
    const [data, setData] = useState(null);
    const [alert, setAlert] = useState(null);
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
            console.log(err);
        })
    }, []);

    if(!data) return <p>Chargement ...</p>
    return (
        <Sumary
            sumaryData={data}
            extension={
                <>
                    {alert && (
                        <AlertBox 
                            text={alert} 
                            onClose={() => setAlert(null)} 
                        />
                    )}
                   <HorizontaleLine />
                   <ApprouvedBtn data={data} alert={alert} setAlert={setAlert}/>
                </>
             }
        />
        
    )
}

export default ApprouvedAdoption;