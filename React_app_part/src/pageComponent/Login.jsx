import { WelcomeSection } from "./Component";
import { MainBtn } from "./Component";
import {useState, useEffect } from 'react';
import '../css/auth.css'
import { useLocation, useNavigate } from "react-router-dom";
import {useFormik} from 'formik';
import axios from "axios";
import * as Yup from 'yup';
import { convertExpiresInToMs } from "./App";

const loginSchema = Yup.object().shape({
    email: Yup.string()
       .email("Adresse e-mail invalide")
       .required("L'e-mail est requis."),

    password: Yup.string() 
       .min(8, "Le mot de passe doit contenir au moins 5 caractères.")
       .max(100, "Le mot de passe ne doit pas dépasser 100 caractères.")
       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Le mot de passe n'est pas conforme")
       .required("Le mot de passe est requis."),

    
});

const LoginSection = () => {
    const navigate = useNavigate();
    const [err, setErr] = useState("");
    const location = useLocation();
    const errorMessage = location.state?.error;

    useEffect(() => {
        if (err) {
            console.log("Erreur détectée :", err);
        }
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

        try {
            const response = await axios.post("http://localhost:5000/api/login", values, {
                withCredentials: true
            });

            if (response.data.token) {
                const { token, user, expiresIn } = response.data;

                const expiresInMs = convertExpiresInToMs(expiresIn);
                const expirationTime = Date.now() + expiresInMs;

                const expirationDate = new Date(expirationTime).toISOString();
                console.log(expirationDate)

                localStorage.setItem("token", token);
                localStorage.setItem("userInformation", JSON.stringify(user));
                localStorage.setItem("tokenExpiration", expirationDate);
                switch (response.data.user.role) {
                    case 1:
                        navigate("/userSpace");
                        break;
                    case 2:
                        navigate("/adminSpace");
                        break;
                }
            } else {
                setErr("Token non reçu !");
            }
        } catch (error) {
            if (error.response?.data) {
                console.log(error)
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
        <WelcomeSection 
            title={"Connexion"}
            content={
                <div className="flex-column alignCenter-AJ">
                    <a href="/register">pas encore de compte</a>
                    {err && <p className="formError">{err}</p>}
                    {errorMessage && <p className="formError">{errorMessage}</p>}
                    <form action="" className="flex-colunm alignCenter-AJ" onSubmit={formik.handleSubmit}>
                        <div>
                            <input type="text" name="email" placeholder="username" value={formik.values.email}
                                        onChange={formik.handleChange} />  
                            {formik.touched.email && formik.errors.email && (
                                <div className="formError">{formik.errors.email}</div>
                            )}   
                        </div>
                        <div>
                            <input type="password" name="password" placeholder="mot de passe" value={formik.values.password}
                                        onChange={formik.handleChange} />    
                            {formik.touched.password && formik.errors.password && (
                                <div className="formError">{formik.errors.password}</div>
                            )} 
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
    return (
        <main id="auth" className="flex-row ">
            <LoginSection />
            <div>
                <img src="/img/loginImg.png" />    
            </div>
            
        </main>
    )
}

export default Login;