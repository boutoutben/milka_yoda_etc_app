import './../css/contact.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { MainBtn } from './Component';

const ContactSchema = Yup.object().shape({
    lastname: Yup.string()
       .min(3, "Le nom doit comporter au moins 3 caractères.")
       .max(50, "Le nombre maximal de caractères du nom est 50.")
       .matches(/^[A-ZÀ-Ÿ][a-zà-ÿ'-]+(?: [A-ZÀ-Ÿ][a-zà-ÿ'-]+)*$/, "Format invalide : ex. Dupont ou Legrand-Duval")
       .required("Le nom est requis."),
    
    firstname: Yup.string()
       .min(2, "Il faut au moins 2 caractères.")
       .max(50, "Le nombre maximal de caractères est 50.")
       .matches(/^[A-ZÀ-Ÿ][a-zà-ÿ'-]+(?: [A-ZÀ-Ÿ][a-zà-ÿ'-]+)*$/, "Format invalide : ex. Jean ou Marie-Thérèse"),

    email: Yup.string()
       .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Adresse e-mail invalide")
       .required("L'e-mail est requis."),
    
    phone: Yup.string() 
       .matches(/^(\+33|0)[1-9](\d{2}){4}$/, "Numéro de téléphone invalide"),

    topic: Yup.string() 
       .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()\- ]{5,100}$/, "Le sujet doit contenir entre 5 et 100 caractères et ne pas inclure de symboles spéciaux interdits.")
       .required("Le sujet est requis."),

    message: Yup.string()
        .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9.,!?'"()\-:;@#*/\n\r ]{10,1000}$/, "Le message doit contenir entre 10 et 1000 caractères et ne pas inclure de symboles interdits.")
        .required("Le message est requis."),
})

const ContactForm = () => {
    const initialValues =  {
        lastname: "",
        firstname: '',
        email:'',
        phone:'',
        topic:'',
        message:'',
    }

    const onSubmit = () => {
        console.log("Formualaire envoyé")
    }

    return (
        <section id='contactForm'>
            <h1>Nous contacter par mail</h1>
            <Formik
            initialValues={initialValues}
            validationSchema={ContactSchema }
            onSubmit={onSubmit}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div>
                            <Field type='text' name='lastname' placeholder='Nom*'/>
                            <Field type='text' name='firstname' placeholder='Prénom'/>
                        </div>
                        {errors.lastname && touched.lastname ?(
                            <div className='formError'>{errors.lastname}</div>    
                        ) : null} 
                        {errors.firstname && touched.firstname ?(
                            <div className='formError'>{errors.firstname}</div>    
                        ) : null}
                        <div>
                            <Field type='text' name='email' placeholder='Email*'/>  
                            <Field type='text' name='phone' placeholder='Téléphone'/>
                        </div>
                        
                        {errors.email && touched.email ?(
                            <div className='formError'>{errors.email}</div>    
                        ) : null}
                        
                        {errors.phone && touched.phone ?(
                            <div className='formError'>{errors.phone}</div>    
                        ) : null}
                        <Field type='text' name='topic' placeholder='Sujet*'/>
                        {errors.topic && touched.topic ?(
                            <div className='formError'>{errors.topic}</div>    
                        ) : null}
                        <Field as='textarea' name='message' placeholder='Message*'/>
                        {errors.message && touched.message ?(
                            <div className='formError'>{errors.message}</div>    
                        ) : null}
                        <MainBtn className={"btnInMain"} name="Envoyer" isSubmit={true} />
                    </Form>
                )}
            </Formik>    
        </section>
        
    )
}

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