
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Actions from './Actions';
import Adopt from './adopt';
import Article from './article';
import Contact from './contact';
import Welcome from './Welcome';
import Footer from './Footer';
import Donnation from './Donnation';
import AnimalDetail from './AnimalDetail';
import MediatorAnimal from './MediatorAnimales';
import axios from 'axios';

export const fetchApi = async (url) => {
    try {
        const response = await axios.get(`http://localhost:5000/api/${url}`);
        return response.data; 
    } catch (err) {
        console.error("❌ Erreur API :", err);
        throw err; 
    }
};

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<Welcome />} />
                <Route path="/action" element={<Actions />} />
                <Route path="/adopter" element={<Adopt />} />
                <Route path="/article" element={<Article />} />
                <Route path="/contact" element={<Contact />} />
                <Route path='/don' element={<Donnation />} />
                <Route path='/animalToAdoptDetail' element={<AnimalDetail incompatibilityImgAndAlt={[["noDog.png", ''],['noCat.png','']]} btnName={'Rencontrer cette animal'} />} />
                <Route path='/mediatorAnimal' element={<MediatorAnimal />} />
                <Route path='/mediatorAnimalDetail' element={<AnimalDetail />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
