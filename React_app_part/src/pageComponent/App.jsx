
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Actions from './Actions';
import Adopt from './Adopt';
import Article from './article';
import Contact from './Contact';
import Welcome from './Welcome';
import Footer from './Footer';
import Donnation from './Donnation';
import AnimalDetail from './AnimalDetail';
import MediatorAnimal from './MediatorAnimales';
import axios from 'axios';
import ScroolToTop, { HorizontaleLine } from './Component';
import AdopterProfile from './AdopterProfile';
import ArticleDetail from './articleDetail';
import Login from './Login';
import Register from './register';
import UserSpace from './UserSpace';
import AdminSpace from './AdminSpace';
import SessionManager from './SessionManager.jsx';
import AdopterSumary from './AdopterSumary.jsx';
import AdoptSucess from './AdoptSucess.jsx';
import ApprouvedAdoption from './ApprouvedAdoption.jsx';
import WriteArticle from './WriteArticle.jsx';
import ResetPassword from './ResetPassword.jsx';


const API_BASE_URL = "http://localhost:5000/api";


export const getFetchApi = async (endpoint, options = {}) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
            timeout: 30000,        // Timeout of 30 seconds
            ...options,            // Allow custom headers or other configurations
            withCredentials: true  // Important for sending cookies with CORS requests
        });
        return response.data;     // Return only the data from the response
    } catch (err) {
        console.error("❌ Erreur API :", err?.response?.data || err.message);

        // Handle different error types and provide useful feedback
        if (err.response) {
            // Server responded with an error
            return { error: true, message: err.response.data.message || "Erreur de connexion à l'API" };
        } else if (err.request) {
            // No response received from the server
            return { error: true, message: "Aucune réponse du serveur" };
        } else {
            // Other errors like network issues
            return { error: true, message: "Erreur de connexion au serveur" };
        }
    }
};

export const convertExpiresInToMs = (expiresIn) => {
    const unit = expiresIn.slice(-1); // 's', 'm', 'h', ou 'd'
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        default: return 0;
    }
};

function pemToBinary(pem) {
    const base64 = pem
      .replace(/-----(BEGIN|END) PUBLIC KEY-----/g, '')
      .replace(/\s+/g, '');
  
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  }
  export async function encryptWithPublicKey(data, pemKey) {
    try {
      const binaryDer = pemToBinary(pemKey.publicKey); // 👈 FIXED here
      const publicKey = await window.crypto.subtle.importKey(
        'spki',
        binaryDer.buffer,
        {
          name: 'RSA-OAEP',
          hash: 'SHA-256',
        },
        false,
        ['encrypt']
      );
  
      const encoded = new TextEncoder().encode(JSON.stringify(data));
  
      const encrypted = await window.crypto.subtle.encrypt(
        {
          name: 'RSA-OAEP',
        },
        publicKey,
        encoded
      );
      return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
    } catch (err) {
      console.error("Error during encryption:", err);
      throw err;
    }
  }

export function isGranted(roleName) {
    try {
        const userInfoString = localStorage.getItem("userInformation");
        if (!userInfoString) return false;

        const userInfo = JSON.parse(userInfoString);
        return userInfo.roleName === roleName;
    } catch (e) {
        console.error("Error parsing userInformation from localStorage:", e);
        return false;
    }
}

export function upluadsImgUrl(name) {
    return `http://localhost:5000/uploads/${name}`
}

export function upluadsArticle(name) {
    return `http://localhost:5000/articles/${name}`
}

const App = () => {
    return (
        <Router>
            <SessionManager />
            <ScroolToTop />
            <Navbar />
            <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path="/action" element={<Actions />} />
                <Route path="/adopter" element={<Adopt />} />
                <Route path="/article" element={<Article />} />
                <Route path='/article/:id' element={<ArticleDetail />}/>
                <Route path='/writeArticle/:id' element={<WriteArticle />} />
                <Route path="/contact" element={<Contact />} />
                <Route path='/don' element={<Donnation />} />
                <Route path='/adopter/:id' element={<AnimalDetail btnName={'Rencontrer cette animal'} />} />
                <Route path='/mediatorAnimal' element={<MediatorAnimal />} />
                <Route path='/mediatorAnimal/:id' element={<AnimalDetail />} />
                <Route path='/adopterProfile' element={<AdopterProfile />} />
                <Route path='/login' element={<Login />} />
                <Route path='/reset-password/:token' element={<ResetPassword />} />
                <Route path='/register' element={<Register />} />
                <Route path="/userSpace" element={<UserSpace />} />
                <Route path='/adminSpace' element={<AdminSpace/>} />
                <Route path='/adopterSumary' element={<AdopterSumary />} />
                <Route path='/adoptSucess' element={<AdoptSucess />} />
                <Route path='/adopterApprouved/:id' element={<ApprouvedAdoption />} />
    
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
