
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Actions from './Actions';
import Adopt from './Adopt';
import Article from './article';
import Contact from './Contact';
import Welcome from './Welcome';
import Footer from '../components/Footer.jsx';
import Donnation from './Donnation';
import AnimalDetail from './AnimalDetail';
import MediatorAnimal from './MediatorAnimales';
import AdopterProfile from './AdopterProfile';
import ArticleDetail from './articleDetail';
import Login from './Login';
import Register from './register';
import UserSpace from './UserSpace';
import AdminSpace from './AdminSpace';
import SessionManager from '../utils/SessionManager.jsx';
import AdopterSumary from './AdopterSumary.jsx';
import AdoptSucess from './AdoptSucess.jsx';
import ApprouvedAdoption from './ApprouvedAdoption.jsx';
import WriteArticle from './WriteArticle.jsx';
import ResetPassword from './ResetPassword.jsx';
import ScrollToTop from '../utils/scrollToTop.jsx';

const App = () => {
    return (
        <Router>
            <SessionManager />
            <ScrollToTop />
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
