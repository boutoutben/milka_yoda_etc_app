import { useFormik } from "formik";
import { useEffect, useState } from "react";
import resetPasswordSchema from "../validationSchema/resetPasswordSchema";
import axios from "axios";
import { useParams } from "react-router-dom";
import MainBtn from "../components/mainBtn";
import PasswordInput from "../components/passwordInput";
import AppSection from "../components/AppSection";
import PropTypes from "prop-types";
import getFetchApi from "../utils/getFetchApi";
import useEncryptData from "../hook/useEncryptData";

const useGetResetPasswordMessage = () => {
    const {token} = useParams();
    const [message, setMessage] = useState(null);
    useEffect(() => {
        getFetchApi(`reset-password/${token}`)
          .then(response => {
            setMessage(response);
          })
          .catch(err => {
            console.error("Une erreur est survenue:", err.message)
          })
      }, [token]);

    return message;
}

const ResetPasswordSection = ({navigation}) => {
    const {token} = useParams();
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '', 
            token: token
        },
        validationSchema: resetPasswordSchema,
        onSubmit: async (values) => {
            const encryptedData = await useEncryptData(values)
            axios.post("http://localhost:5000/api/reset-password", {
                data: encryptedData
              }, {
                headers: {
                    'Content-Type': 'application/json'
                  },
                withCredentials: true
              })
            .then(() => {
                navigation("/login", {state: {message: 'Mot de passe changé avec succès.'}});
            })
            .catch(err => {
                console.error("Une erreur est survenue:", err.message);
            })
        }
    })
    return (
        <AppSection title={"Modifier le mot de passe"} content={
            <form onSubmit={formik.handleSubmit} className="flex-column row-gap-15">
                <div>
                <PasswordInput name="password" formik={formik} placeholder={"Mot de passe"} />
                </div>
                <div>
                    <PasswordInput name="confirmPassword" formik={formik} placeholder={"Confirmation du mot de passe"} />
                </div>
                <MainBtn name={"Modifier"} isSubmit={true} className={'btnInMain'}/>
            </form>
        } />  
    )
}

ResetPasswordSection.propTypes = {
    navigation: PropTypes.func
}

export {useGetResetPasswordMessage, ResetPasswordSection}