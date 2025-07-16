import { useLocation } from "react-router-dom";
import FloatFormField from "../components/floatFormField";
import MainBtn from "../components/mainBtn";
import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import emailSchema from "../validationSchema/emailSchema";
import useGetPublicKey from "../hook/useGetPublicKey";
import loginSchema from "../validationSchema/LoginSchema";
import AppSection from "../components/AppSection";
import PasswordInput from "../components/passwordInput";
import encryptWithPublicKey from "../utils/encryptWithPublicKey";
import convertExpiresInToMs from "../utils/convertExpiresInToMS";
import PropTypes from "prop-types";

const ForgetAndNoAccountBtn = ({onReload = () => location.reload()}) => {
    const [forgot, setForgot] = useState(false);
    const forgetFormik = useFormik({
        initialValues: {
            email:''
        },
        validationSchema:emailSchema,
        onSubmit: async (values) => {
            axios.post("http://localhost:5000/api/forgot-password", 
                values, {
              headers: {
                  'Content-Type': 'application/json'
                },
              withCredentials: true
            })
            .then(() => {
                onReload();
            })
            .catch(err => {
                console.error("Une erreur est survenue:", err.message);
            })
        }
    })
    return (
        <>
            <div className="flex-row alignCenter-AJ gap-15">
            <a href="/register">pas encore de compte</a>
            <button type="button" className="unstyled-button link" onClick={() => setForgot(true)}>mot de passe oublié</button>     
            </div>
            {forgot && (
                <FloatFormField setter={() => setForgot(false)} action={"Entrer votre email"}
                content={
                    <form data-testid="forgetPasswordForm" onSubmit={forgetFormik.handleSubmit}>
                        <div className="flex-column alignCenter-AJ">
                            <input data-testid={"forgetPasswordEmail"} type="text" name="email" placeholder="Email" value={forgetFormik.values.email} onChange={forgetFormik.handleChange} /> 
                            {forgetFormik.touched.email && forgetFormik.errors.email && (
                    <div className="formError">{forgetFormik.errors.email}</div>
                    )}    
                            </div>
                            <MainBtn name={"valider"} isSubmit={true} className={"btnInMain"} />
                        </form>
                    }
                />   
            )}
        </>
    )
}

ForgetAndNoAccountBtn.propTypes = {
    onReload: PropTypes.func
}

const handleResponse = (navigate, response) => {
    const { token, userInfo, expiresIn } = response.data;
    const expiresInMs = convertExpiresInToMs(expiresIn);
    const expirationTime = Date.now() + expiresInMs;

    const expirationDate = new Date(expirationTime).toISOString();

    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", expirationDate);
    switch (userInfo.roleName) {
        case "USER_ROLE":
            navigate("/userSpace");
            break;
        case "ADMIN_ROLE":
            navigate("/adminSpace");
            break;
        default: 
            navigate("/login");
            break;
    }
}

const handleError = (error, setErr) => {
    if (error.response?.data) {        
        const data = error.response.data;
        if (typeof data === "string") {
            setErr(data);
        } else if (data.message) {
            setErr(data.message);
        } else if (data.error) {
            setErr(data.error);
        } else {
            setErr("Une erreur inconnue est survenue.");
        }
    } else {
        setErr(`Impossible de contacter le serveur: ${error.message}`);
    } 
}


const LoginSection = ({navigate}) => {
    
    const [err, setErr] = useState("");
    const publicKey = useGetPublicKey();
    const location = useLocation();
    const errorMessage = location.state?.error;    
    
    const formik = useFormik({
        initialValues:{
            email: '',
            password: '',
            remember_me: false,
        },
        validationSchema: loginSchema,
        onSubmit: async (values) => {
            setErr(""); // Reset l'erreur avant tentative
            const encryptedData = await encryptWithPublicKey(values, publicKey)
            try {
                const response = await axios.post("http://localhost:5000/api/login", {
                    data: encryptedData
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                if (response.data.token) {
                    handleResponse(navigate, response)
                } else {
                    setErr("Token non reçu !");
                }
            } catch (error) {
                handleError(error, setErr);
            }
        }
    });

    return (
        <AppSection 
            title={"Connexion"}
            content={
                <div className="flex-column alignCenter-AJ row-gap-15">  
                    {err && <p className="formError">{err}</p>}
            {errorMessage && <p className="formError">{errorMessage}</p>}
                    <ForgetAndNoAccountBtn />
                    <form className="flex-column alignCenter-AJ row-gap-15" onSubmit={formik.handleSubmit}>
                        <div className="flex-column all-field">
                            <div>
                                <input type="text" name="email" placeholder="Email" value={formik.values.email}
                                            onChange={formik.handleChange} />  
                                {formik.touched.email && formik.errors.email && (
                                    <div className="formError">{formik.errors.email}</div>
                                )}   
                            </div>
                            <PasswordInput formik={formik} name={"password"}placeholder={"Mot de passe"}/>
                        </div>
                        <label className="checkbox" htmlFor="other">
                        <input
                        type="checkbox"
                        name="remember_me"
                        id="other"
                        checked={formik.values.remember_me}
                        onChange={formik.handleChange}
                        />
                        <span className="check"></span>Se souvenir de moi
                            </label>
                        <MainBtn name={"Connecter"} isSubmit={true} />
                    </form>
                </div>
            }
        />
    )
}

LoginSection.propTypes = {
    navigate: PropTypes.func
}

export {ForgetAndNoAccountBtn,handleResponse, handleError, LoginSection}