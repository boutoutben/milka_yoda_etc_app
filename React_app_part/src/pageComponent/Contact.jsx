import './../css/contact.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import MainBtn from '../components/mainBtn';
import AppSection from '../components/AppSection';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';
import ContactSchema from '../validationSchema/ContactSchema';

const ContactForm = () => {
    const formRef = useRef(); // ✅ Still needed for emailjs
    const initialValues = {
        lastname: "",
        firstname: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    };
    
    const handleSubmit = (values, { resetForm }) => {
        console.log("✔ Formik onSubmit is triggered!");
        console.log("📩 Form Values:", values);
        
        if (!formRef.current) return;

        emailjs.sendForm(
            "service_rudbrtp",
            "template_n97r70c",
            formRef.current,
            "mHP87VvYc_0rTgwUu"
        )
        .then((result) => {
            console.log("✅ Email sent:", result.text);
            resetForm(); // ✅ Reset Formik form state
        })
        .catch((err) => {
            console.error("❌ Error:", err.text);
            alert("Échec de l'envoi du message.");
        });
    };

    const formik = useFormik({
        initialValues:initialValues,
        validationSchema:ContactSchema,
        onSubmit: handleSubmit,
    })

    return (
        <AppSection 
            id={"contactForm"}
            title={"Contactez-nous"}
            content={
                    <form className='flex-column alignCenter-AJ row-gap-25' onSubmit={formik.handleSubmit}>
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

const Contact = () => {
    return (
        <main id="contact">
            <img src="img/contactImg.png" alt="" />
            <ContactForm />
            <ContactText />
        </main>
        
    )
}

export default Contact;