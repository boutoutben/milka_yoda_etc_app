import axios from 'axios';
import '../css/auth.css';
import { MainBtn, WelcomeSection } from './Component';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const registerSchema = Yup.object().shape({
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

    email: Yup.string()
       .email("Adresse e-mail invalide")
       .required("L'e-mail est requis."),
    
    phone: Yup.string() 
       .matches(/^(\+33|0)[1-9](\s?\d{2}){4}$/, "Numéro de téléphone invalide"),

    password: Yup.string() 
       .min(8, "Le mot de passe doit contenir au moins 5 caractères.")
       .max(100, "Le mot de passe ne doit pas dépasser 100 caractères.")
       .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, "Le mot de passe n'est pas conforme")
       .required("Le mot de passe est requis."),

    confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Les mots de passe doivent correspondre')
    .required('La confirmation est requis'),

    accept: Yup.boolean()
  .oneOf([true], "Vous devez accepter la condition")
    
});

const RegisterSection = () => {
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues:{
            firstname:'',
            lastname:'',
            email:'',
            phone:'',
            password:'',
            confirmPassword:'',
            accept:false,
        },
        validationSchema:registerSchema,
        onSubmit: (values) => {
            axios.post('http://localhost:5000/api/register', values, {
                withCredentials: true
            })
            .then(response => {
                navigate('/login', { state: { user: response.data } });
            })
            .catch(error => {
                console.error("Erreur lors de l'envoi :", error);
            });
        }
    })
    return (
        <WelcomeSection
            title={"Créer une compte"}
            content={
                <div className="flex-column alignCenter-AJ">
                    <a href="/login">J'ai déjà un compte</a>
                    <form action="" className='flex-colunm alignCenter-AJ' onSubmit={formik.handleSubmit}>
                        <div className='flex-row'>
                            <div className="flex-column">
                                <input type="text" name="firstname" placeholder="nom" value={formik.values.firstname}
                                    onChange={formik.handleChange} /> 
                                {formik.touched.firstname && formik.errors.firstname && (
                                    <div className="formError">{formik.errors.firstname}</div>
                                )}   
                            </div>
                            <div className="flex-column">
                                <input type="text" name="lastname" placeholder='prénom' value={formik.values.lastname}
                                    onChange={formik.handleChange} />  
                                {formik.touched.lastname && formik.errors.lastname && (
                                <div className="formError">{formik.errors.lastname}</div>
                                )}    
                            </div>
                        </div>
                        <div className="flex-row">
                            <div className="flex-column">
                                <input type="text" name="email" placeholder='email' value={formik.values.email}
                                onChange={formik.handleChange} /> 
                                {formik.touched.email && formik.errors.email && (
                                    <div className="formError">{formik.errors.email}</div>
                                )}   
                            </div>
                            <div className="flex-column">
                                <input type="text" name="phone" placeholder='téléphone' value={formik.values.phone}
                                onChange={formik.handleChange}/>  
                                {formik.touched.phone && formik.errors.phone && (
                                    <div className="formError">{formik.errors.phone}</div>
                                )}   
                            </div>
                        </div>
                        <div className="flex-column">
                            <input type="password" name="password" placeholder="mot de passe" value={formik.values.password}
                            onChange={formik.handleChange} />   
                            {formik.touched.password && formik.errors.password && (
                                <div className="formError">{formik.errors.password}</div>
                            )}
                        </div>
                        <div className="flex-column">
                            <input type="password" name="confirmPassword" placeholder='confirmation mot de passe' value={formik.values.confirmPassword}
                            onChange={formik.handleChange} />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                <div className="formError">{formik.errors.confirmPassword}</div>
                            )}
                        </div>
                        <div className="flex-column">
                            <label className='checkbox'> J’accepte que ces données soient envoyée à milka yoda etc
                                <input type="checkbox" name="accept" value={formik.values.accept}
                onChange={formik.handleChange}/>
                                <span className='check'></span>  
                            </label>
                            {formik.touched.accept && formik.errors.accept && (
                                <div className="formError">{formik.errors.accept}</div>
                            )} 
                        </div>
                       
                        <MainBtn name={"Créer un compte"} isSubmit={true} />
                    </form>
                </div>
            }
        />
    )
}

const Register = () => {
    return (
        <main id='auth' className="flex-row register">
            <div>
                <img src="img/registerImg.png" alt="" />
            </div>
            <RegisterSection />
        </main>
    )
}

export default Register;