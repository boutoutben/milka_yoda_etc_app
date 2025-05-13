import {Link} from 'react-router-dom';
import { CloseImg, MainBtn } from './Component';
import { useNavigate } from "react-router-dom"
import './../css/navbar.css'
import { useEffect, useState } from 'react';

const NavElement = ({navClass}) => {
    return (
        <nav>
            <ul className={navClass}>
                <Link to='/action'>Nos actions</Link>
                <Link to='/adopter'>Adopter</Link>
                <Link to='/article'>Article</Link>
                <Link to='/contact'>Contact</Link>    
            </ul>     
        </nav>
    )
}


const UserBtn = () => {
    const navigate = useNavigate();

    const handleAccountClick = (event) => {
        event.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem("userInformation"));
            if (userInfo) {
                switch (userInfo.roleName) {
                    case "USER_ROLE":
                        navigate("/userSpace");
                        break;
                    case "ADMIN_ROLE":
                        navigate("/adminSpace");
                        break;
                }
            } else {
                navigate("/login");
            }
        } catch (err) {
            console.error("Erreur de parsing des infos utilisateur :", err);
            navigate("/login");
        }
    };

    return (
        <a onClick={handleAccountClick}>
            <img src="/img/user.png" alt="Compte utilisateur" />
        </a>
    );
};

const Menu = ({redirection}) => {
    const [menuType, setMenuType] = useState("btn");

   useEffect(() => {
        const mobileNavLinks = document.querySelectorAll("header>div :is(nav>ul>a, a)");
        if (mobileNavLinks.length > 0) {
            
            mobileNavLinks.forEach(link => {
                link.addEventListener("click", () => {
                    setMenuType("btn");
                });
            });
        }
        return () => {
            mobileNavLinks.forEach(link => {
                link.removeEventListener("click", () => setMenuType("btn"));
            });
        };
    }, []);
    const navigate = useNavigate();
    const handleClick = (event) => {
        event.preventDefault();
        setMenuType("btn");
        navigate(redirection);
    }
    return (
        <div>
            <img 
                src="/img/menu.png" 
                id="menuBtn" 
                onClick={() => setMenuType("menu")}
                alt="Menu"
            />
            <div className={`${menuType === "menu" ? "dropdownMenu" : "normalMenu"} flex-column`}>
                <CloseImg click={() => setMenuType('btn')} />
                <NavElement navClass={"flex-column"} />
                <Link to='/'><img src="/img/AssocJuliette.png" alt="logo" id='headerLogo'/></Link>
                <UserBtn />
                <MainBtn name={"Nous soutenir"} click={handleClick} />
            </div>
        </div>
        
    );
};

const Navbar = () => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate('/');
    };


    return (
        <header>
            <img src="/img/AssocJuliette.png" alt="logo" id='headerLogo' onClick={handleClick} />
            <NavElement />
            <div className='flex-row alignCenter-AJ'>
                <UserBtn />
                <a href=""><img src='/img/shopping-cart.png' alt='shop en ligne' className='shopImg'/></a>
                <Menu redirection={'/don'}/>
                <div className='verticalLine'></div>
                <Link to={'/don'}><MainBtn name={"Nous soutenir"}/></Link>    
            </div>     
        </header>
    );
}

export default Navbar;