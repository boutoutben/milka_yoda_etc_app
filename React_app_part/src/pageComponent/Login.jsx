import { useNavigate } from 'react-router-dom';
import '../css/auth.css'
import { LoginSection } from "../handles/Login";

const Login = () => {
    const navigate = useNavigate();
    return (
        <main id="auth" className="flex-row ">
            <LoginSection navigate={navigate}/>
            <div>
                <img src="/img/loginImg.png" alt='login img' />    
            </div>
            
        </main>
    )
}

export default Login;