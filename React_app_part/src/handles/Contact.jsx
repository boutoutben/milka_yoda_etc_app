import { useFormik } from "formik";

import MainBtn from '../components/mainBtn';
import AppSection from '../components/AppSection';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import ContactSchema from '../validationSchema/ContactSchema';
import getEnvVars from "../utils/getEnvVars";

const {VITE_GMAIL_SERVICE_ID, VITE_OWNER_EMAIL, VITE_GMAILJS_PUBLIC_KEY, VITE_GMAIL_CONTACT_MODELE_ID} = getEnvVars()

const handleContactSubmit = (formRef) => (values, { resetForm }) => {
        
    if (!formRef.current) return;
    emailjs.sendForm(
        VITE_GMAIL_SERVICE_ID,
        VITE_GMAIL_CONTACT_MODELE_ID,
        formRef.current,
        VITE_GMAILJS_PUBLIC_KEY
    )
    .then(() => {
        resetForm();
    })
    .catch((err) => {
        console.error("Error:", err.message);
    });
};

const ContactForm = () => {
    const formRef = useRef();
    const initialValues = {
        owner_email: VITE_OWNER_EMAIL,
        lastname: "",
        firstname: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    }; 

    const formik = useFormik({
        initialValues:initialValues,
        validationSchema:ContactSchema,
        onSubmit: handleContactSubmit(formRef),
    })

    return (
        <AppSection 
            id={"contactForm"}
            title={"Contactez-nous"}
            content={
                    <form ref={formRef} className='flex-column alignCenter-AJ row-gap-25' onSubmit={formik.handleSubmit}>
                        <div className='flex-column'>
                            <div className='flex-row gap-15'>
                                <div>
                                    <input type="text" name="lastname" placeholder='Nom*' value={formik.values.lastname} onChange={formik.handleChange} />
                                    {formik.errors.lastname && formik.touched.lastname && (
                                        <div className="formError">{formik.errors.lastname}</div>
                                    )}  
                                </div>
                                <div className='flex-column'>
                                    <input type="text" name="firstname" placeholder='Prénom*' value={formik.values.firstname} onChange={formik.handleChange} /> 
                                    {formik.errors.firstname && formik.touched.firstname && (
                                        <div className="formError">{formik.errors.firstname}</div>
                                    )}  
                                </div>
                                
                            </div>

                            <div className='flex-row gap-15'>
                                <div>
                                <input type="text" name="email" value={formik.values.email} placeholder='Email*' onChange={formik.handleChange} />
                                    {formik.errors.email && formik.touched.email && (
                                        <div className="formError">{formik.errors.email}</div>
                                    )}
                                </div>
                                <div>
                                <input type="text" name="phone" value={formik.values.phone} placeholder='Téléphone' onChange={formik.handleChange} /> 
                                    {formik.errors.phone && formik.touched.phone && (
                                        <div className="formError">{formik.errors.phone}</div>
                                    )}   
                                </div>
                            </div>              
                            <input type="text" name="subject" value={formik.values.subject} placeholder='Suject*' onChange={formik.handleChange} />
                            {formik.errors.subject && formik.touched.subject && (
                                <div className="formError">{formik.errors.subject}</div>
                            )}

                            <textarea name="message" value={formik.values.message} placeholder='Message*' onChange={formik.handleChange}></textarea>
                            {formik.errors.message && formik.touched.message && (
                                <div className="formError">{formik.errors.message}</div>
                            )}

                        </div>

                        {/* ✅ No need for click={handleSubmit}, Formik handles it */}
                        <MainBtn className="btnInMain" name="Envoyer" isSubmit={true} />
                    </form>
            }
        />         
    );
};

const ContactText = () => {
    return (
        <section className='contactText'>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </section>
    )
}

export {handleContactSubmit, ContactForm, ContactText}