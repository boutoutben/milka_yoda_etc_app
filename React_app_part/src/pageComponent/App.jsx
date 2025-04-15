
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

import ScroolToTop from './Component';
import AdopterProfile from './AdopterProfile';
import ArticleDetail from './articleDetail';
import Login from './Login';
import Register from './register';
import UserSpace from './UserSpace';
import AdminSpace from './AdminSpace';
import { useCallback, useEffect } from 'react';
import SessionManager from './SessionManager.jsx';


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
                <Route path="/contact" element={<Contact />} />
                <Route path='/don' element={<Donnation />} />
                <Route path='/adopter/:id' element={<AnimalDetail btnName={'Rencontrer cette animal'} />} />
                <Route path='/mediatorAnimal' element={<MediatorAnimal />} />
                <Route path='/mediatorAnimal/:id' element={<AnimalDetail />} />
                <Route path='/adopterProfile' element={<AdopterProfile />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path="/userSpace" element={<UserSpace />} />
                <Route path='/adminSpace' element={<AdminSpace/>} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
