import MainBtn from "../components/mainBtn";
import FloatFormField from "../components/floatFormField";
import AppSection from "../components/AppSection";
import PasswordInput from "../components/passwordInput";
import {useState, useEffect } from 'react';
import '../css/auth.css'
import { useLocation, useNavigate } from "react-router-dom";
import {useFormik} from 'formik';
import axios from "axios";
import convertExpiresInToMs from "../utils/convertExpiresInToMS";
import encryptWithPublicKey from "../utils/encryptWithPublicKey";
import getFetchApi from "../utils/getFetchApi";
import loginSchema from "../validationSchema/LoginSchema";
import emailSchema from "../validationSchema/emailSchema";

const LoginSection = ({setForgot}) => {
    const navigate = useNavigate();
    const [err, setErr] = useState("");
    const [publicKey, setPublicKey] = useState(null);
    const location = useLocation();
    
    const errorMessage = location.state?.error;

    useEffect(() => {
        if (err) {
            console.log("Erreur détectée :", err);
        }
        getFetchApi("encrypt/public-key")
        .then(data => {
            setPublicKey(data)
        }) 
        .catch(err => {
            console.log("Error ", err);
        })
    }, [err]);
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
        console.log(encryptedData);
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
                const { token, userInfo, expiresIn } = response.data;

                const expiresInMs = convertExpiresInToMs(expiresIn);
                const expirationTime = Date.now() + expiresInMs;

                const expirationDate = new Date(expirationTime).toISOString();
                console.log(expirationDate)

                localStorage.setItem("token", token);
                localStorage.setItem("tokenExpiration", expirationDate);
                switch (userInfo.roleName) {
                    case "USER_ROLE":
                        navigate("/userSpace");
                        break;
                    case "ADMIN_ROLE":
                        navigate("/adminSpace");
                        break;
                }
            } else {
                setErr("Token non reçu !");
            }
        } catch (error) {
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
                setErr("Impossible de contacter le serveur.");
            }     
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
                    <div className="flex-row alignCenter-AJ gap-15">
                        <a href="/register">pas encore de compte</a>
                        <a onClick={() => setForgot(true)}>Mot de passe oublié</a>     
                    </div>
                    
                    
                    <form className="flex-column alignCenter-AJ row-gap-15" onSubmit={formik.handleSubmit}>
                        <div className="flex-column all-field">
                            <div>
                                <input type="text" name="email" placeholder="username" value={formik.values.email}
                                            onChange={formik.handleChange} />  
                                {formik.touched.email && formik.errors.email && (
                                    <div className="formError">{formik.errors.email}</div>
                                )}   
                            </div>
                            <PasswordInput formik={formik} name={"password"}placeholder={"Mot de passe"}/>
                        </div>
                        
                        
                        <label className='checkbox'> Se souvenir de moi
                            <input type="checkbox" name="remember_me" id='other'value={formik.values.remenber_me}
                                    onChange={formik.handleChange} />
                            <span className='check'></span>  
                        </label> 
                        <MainBtn name={"Connecter"} isSubmit={true} />
                    </form>
                </div>
            }
        />
    )
}

const Login = () => {
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
            .then((response) => {
                console.log(response);
                location.reload();
            })
            .catch(err => {
                console.log(err);
            })
        }
    })
    return (
        <main id="auth" className="flex-row ">
            <LoginSection setForgot={setForgot} />
            {forgot && (
                        <FloatFormField setter={() => setForgot(false)} action={"Entrer votre email"}
                            content={
                                <form onSubmit={forgetFormik.handleSubmit}>
                                    <div className="flex-column alignCenter-AJ">
                                        <input type="text" name="email" placeholder="Email" value={forgetFormik.values.email} onChange={forgetFormik.handleChange} /> 
                                        {forgetFormik.touched.email && forgetFormik.errors.email && (
                                <div className="formError">{forgetFormik.errors.email}</div>
                            )}    
                                    </div>
                                    <MainBtn name={"valider"} isSubmit={true} className={"btnInMain"} />
                                </form>
                            }
                        />    
                    )}
            <div>
                <img src="/img/loginImg.png" />    
            </div>
            
        </main>
    )
}

export default Login;