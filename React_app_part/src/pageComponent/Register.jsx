import axios from 'axios';
import '../css/auth.css';
import MainBtn from '../components/mainBtn';
import AppSection from '../components/AppSection';
import PasswordInput from '../components/passwordInput';
import {useFormik} from 'formik';
import { useNavigate } from 'react-router-dom';
import encryptWithPublicKey from '../utils/encryptWithPublicKey';
import getFetchApi from '../utils/getFetchApi';
import { useEffect, useState } from 'react';
import registerSchema from '../validationSchema/RegisterSchema';

const RegisterSection =  () => {
    const [publicKey, setPublicKey] = useState("");
    useEffect(() => {
         getFetchApi("encrypt/public-key")
                .then(data => {
                    setPublicKey(data)
                }) 
                .catch(err => {
                    console.log("Error ", err);
                })
    })
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
        onSubmit: async (values) => {
            const encryptedData = await encryptWithPublicKey(values, publicKey);
            axios.post('http://localhost:5000/api/register',  {
                data: encryptedData
              }, {
                headers: {
                    'Content-Type': 'application/json'
                  },
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
        <AppSection
            title={"Créer une compte"}
            content={
                <div className="flex-column alignCenter-AJ row-gap-15">
                    <a href="/login">J'ai déjà un compte</a>
                    <form className='flex-column alignCenter-AJ row-gap-15' onSubmit={formik.handleSubmit}>
                        <div className="flex-column all-field">
                        <div className='flex-row'>
                            <div className="flex-column">
                                <input type="text" name="lastname" placeholder='Nom' value={formik.values.lastname}
                                    onChange={formik.handleChange} />  
                                {formik.touched.lastname && formik.errors.lastname && (
                                <div className="formError">{formik.errors.lastname}</div>
                                )}    
                            </div>
                            <div className="flex-column">
                                <input type="text" name="firstname" placeholder="Prénom" value={formik.values.firstname}
                                    onChange={formik.handleChange} /> 
                                {formik.touched.firstname && formik.errors.firstname && (
                                    <div className="formError">{formik.errors.firstname}</div>
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
                        <PasswordInput name="password" formik={formik} placeholder={"Mot de passe"} />
                        <PasswordInput name="confirmPassword" formik={formik} placeholder={"Confirmation du mot de passe"} />
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
                       
                        <MainBtn name={"Créer un compte"} isSubmit={true} className={"btnInMain"} />
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