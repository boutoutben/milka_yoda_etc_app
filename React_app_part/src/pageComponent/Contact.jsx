import { ContactForm, ContactText } from '../handles/Contact';
import './../css/contact.css';

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