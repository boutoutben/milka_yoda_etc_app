import { useEffect, useState } from "react"
import encryptWithPublicKey from "../utils/encryptWithPublicKey";
import getFetchApi from "../utils/getFetchApi";
import { useNavigate, useParams } from "react-router-dom"
import MainBtn from "../components/mainBtn";
import AppSection from "../components/AppSection";
import { useFormik } from "formik";
import axios from "axios";
import resetPasswordSchema from "../validationSchema/resetPasswordSchema";



const ResetPassword = () => {
    const {token} = useParams();
    const [message, setMessage] = useState("");
    const [publicKey, setPublicKey] = useState("");
    const navigation = useNavigate();
    useEffect(() => {
        getFetchApi(`reset-password/${token}`)
          .then(response => {
            setMessage(response);
          });
      }, [token]);
      
      useEffect(() => {
        getFetchApi("encrypt/public-key")
          .then(data => {
            setPublicKey(data);
          })
          .catch(err => {
            console.log("Error ", err);
          });
      }, []);

    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '', 
            token: token
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            const encryptedData = await encryptWithPublicKey(values, publicKey)
            axios.post("http://localhost:5000/api/reset-password", {
                data: encryptedData
              }, {
                headers: {
                    'Content-Type': 'application/json'
                  },
                withCredentials: true
              })
            .then(() => {
                navigation("/login", {state: {error: 'Mot de passe changé avec succès.'}});
            })
            .catch(err => {
                console.log(err);
            })
        }
    })

    return(
        <main>
            {message=="Can reset password" ? (
                <AppSection title={"Modifier le mot de passe"} content={
                    <form onSubmit={formik.handleSubmit} className="flex-column row-gap-15">
                         <PasswordInput name="password" formik={formik} placeholder={"Mot de passe"} />
                          <PasswordInput name="confirmPassword" formik={formik} placeholder={"Confirmation du mot de passe"} />
                        <MainBtn name={"Modifier"} isSubmit={true} className={'btnInMain'}/>
                    </form>
                } />    
            ): 
            (
              <h4 className="formError flex-column alignCenter-AJ">Votre permission est expirés ou votre ne l'avez pas</h4>
            )}
            
        </main>
    )
}

export default ResetPassword;