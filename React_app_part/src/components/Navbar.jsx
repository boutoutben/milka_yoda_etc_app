import CloseImg from './closeImg';
import MainBtn from './mainBtn';
import { useNavigate, Link } from "react-router-dom"
import './../css/navbar.css'
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import getFetchApi from '../utils/getFetchApi';

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

NavElement.propTypes = {
    navClass: PropTypes.string.isRequired
}


const UserBtn = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const token = localStorage.getItem("token")
    useEffect(() => {
        if (!token) return;
        getFetchApi("user/getRole", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          },
        })
        .then(data => {
          if (data) {
            setUserInfo(data.role[0]);
          }
        })
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error("Erreur lors de la récupération des infos personnelles :", err);
          }
        });
        console.log(userInfo)
      }, [token]);
      
    const handleAccountClick = (event) => {
        event.preventDefault();
        try {
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
        <button onClick={handleAccountClick} className="unstyled-button" aria-label="Compte utilisateur">
            <img src="/img/user.png" alt="Compte utilisateur" />
        </button>
    );
};

const Menu = ({redirection}) => {
    const [menuType, setMenuType] = useState("btn");
    const wrapperRef = useRef(null);

    useEffect(() => {
        const mobileNavLinks = document.querySelectorAll("header>div :is(nav>ul>a, a)");

        // Définir la fonction en dehors de forEach
        const handleClick = () => {
            setMenuType("btn");
        };

        mobileNavLinks.forEach(link => {
            link.addEventListener("click", handleClick);
        });

        // Nettoyage propre avec la même référence de fonction
        return () => {
            mobileNavLinks.forEach(link => {
                link.removeEventListener("click", handleClick);
            });
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setMenuType("btn");
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
    const navigate = useNavigate();
    const handleClick = (event) => {
        event.preventDefault();
        setMenuType("btn");
        navigate(redirection);
    }
    return (
        <div ref={wrapperRef}>
            <button id="menuBtn" className='unstyled-button' onClick={() => setMenuType("menu")}>
                <img 
                    src="/img/menu.png"  
                    alt="Menu"
                />       
            </button>
            
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

Menu.propTypes = {
    redirection: PropTypes.string.isRequired
}

const Navbar = () => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate('/');
    };


    return (
        <header>
            <button onClick={handleClick} className='unstyled-button'>
                <img src="/img/AssocJuliette.png" alt="logo" id='headerLogo' />        
            </button>
            
            <NavElement />
            <div className='flex-row alignCenter-AJ'>
                <UserBtn />
                <button href="" className='unstyled-button'><img src='/img/shopping-cart.png' alt='shop en ligne' className='shopImg'/></button>
                <Menu redirection={'/don'}/>
                <div className='verticalLine'></div>
                <Link to={'/don'}><MainBtn name={"Nous soutenir"}/></Link>    
            </div>     
        </header>
    );
}

export default Navbar;