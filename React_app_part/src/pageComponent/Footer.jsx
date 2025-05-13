import "./../css/footer.css"
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer>
            <section id="coordinate">
                <div>
                    <p>Tel: 06 00 00 00 00</p>
                    <p>Email: Association@gmail.com</p>  
                </div>
                <Link to='/'><img src="/img/AssocJuliette.png" alt="Logo" id="logo" /></Link>
            </section>
            <section id="legalMention">
                <p>Mentions légal</p>
                <p>Politique de confidentialité</p>
                <p>FAQ</p>
                <p>Contacter-nous</p>
            </section>
            <section id="socialMedias">
                <a href="https://www.instagram.com/milka_yoda_etc?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank"><img src="/img/instagram.png" alt="Logo d'instagram" /></a>
                <a href="https://www.tiktok.com/@milka.yoda.etc" target="_blank"><img src="/img/tik-tok.png" alt="Logo de tiktok" /></a>
                <a href=""><img src="/img/twitter.png" alt="Logo de twitter ou X" /></a>
                <a href="https://www.facebook.com/profile.php?id=61574010993069" target="_blank"><img src="/img/facebook.png" alt="Logo de facebook" /></a>
            </section>
            <section>
                <div className="line"></div>
            </section>
            <section id="copyright">
                <p>© 2025, Milka-yoda-etc</p>    
            </section>
            
        </footer>
    );
};

export default Footer;