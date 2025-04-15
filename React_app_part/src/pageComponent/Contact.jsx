import './../css/contact.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { MainBtn } from './Component';
import { useRef } from 'react';
import emailjs from '@emailjs/browser';

const ContactSchema = Yup.object().shape({
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

    subject: Yup.string() 
       .min(5, "Le sujet doit contenir au moins 5 caractères.")
       .max(100, "Le sujet ne doit pas dépasser 100 caractères.")
       .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()\- ]+$/, "Le sujet contient des caractères non autorisés.")
       .required("Le sujet est requis."),

    message: Yup.string()
       .min(10, "Le message doit contenir au moins 10 caractères.")
       .max(1000, "Le message ne doit pas dépasser 1000 caractères.")
       .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()\-:;@#*\/\n\r ]+$/, "Le message contient des caractères non autorisés.")
       .required("Le message est requis."),
});

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



    return (
        <section id="contactForm">
            <h1>Nous contacter par mail</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={ContactSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched }) => (
                    <Form ref={formRef}> {/* ✅ Form ref is fine here */}
                        <div>
                            <div>
                                <Field type="text" name="lastname" placeholder="Nom*" />  
                                {errors.lastname && touched.lastname && (
                                    <div className="formError">{errors.lastname}</div>
                                )}  
                            </div>
                            <div>
                                <Field type="text" name="firstname" placeholder="Prénom" />  
                                {errors.firstname && touched.firstname && (
                                    <div className="formError">{errors.firstname}</div>
                                )}  
                            </div>
                            
                        </div>

                        <div>
                            <div>
                                <Field type="text" name="email" placeholder="Email*" />
                                {errors.email && touched.email && (
                                    <div className="formError">{errors.email}</div>
                                )}
                            </div>
                            <div>
                                <Field type="text" name="phone" placeholder="Téléphone" /> 
                                {errors.phone && touched.phone && (
                                    <div className="formError">{errors.phone}</div>
                                )}   
                            </div>
                        </div>              
                        <Field type="text" name="subject" placeholder="Sujet*" />
                        {errors.subject && touched.subject && (
                            <div className="formError">{errors.subject}</div>
                        )}

                        <Field as="textarea" name="message" placeholder="Message*" />
                        {errors.message && touched.message && (
                            <div className="formError">{errors.message}</div>
                        )}

                        {/* ✅ No need for click={handleSubmit}, Formik handles it */}
                        <MainBtn className="btnInMain" name="Envoyer" isSubmit={true} />
                    </Form>
                )}
            </Formik>
        </section>
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