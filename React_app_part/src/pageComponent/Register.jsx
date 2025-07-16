import { useNavigate } from 'react-router-dom';
import '../css/auth.css';
import { RegisterSection } from '../handles/Register';

const Register = () => {
    const navigate = useNavigate();
    return (
        <main id='auth' className="flex-row register">
            <div>
                <img src="img/registerImg.png" alt="" />
            </div>
            <RegisterSection navigate={navigate} />
        </main>
    )
}

export default Register;