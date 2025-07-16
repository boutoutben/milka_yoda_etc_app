import '../css/adopterProfile.css';
import { AdopterForm } from '../handles/AdopterProfile';

const AdopterProfile = () =>{
    return (
        <main id="adopterProfile">
            <h1>Information de l'adoptant</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat.</p>
            <AdopterForm/>
        </main>
    )
}

export default AdopterProfile;