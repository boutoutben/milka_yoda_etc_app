import { useEffect, useState } from "react";
import getFetchApi from "../utils/getFetchApi";
import { useNavigate } from "react-router-dom";
import '../css/adminSpace.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import AppSection from "../components/AppSection";
import Logout from "../components/logout";

const AskForAdoption = () => {
    const [animals, setAnimals] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {
        getFetchApi("user/admin", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          } )
          .then(data => {
            setAnimals(data);
          })
          .catch(err => {
            if (err.status === 403) {
              navigate("/login", { state: { error: "Vous n'êtes pas ou plus authorisée" } });
            } else {
              console.error("Unexpected error:", err.message);
            }
          });
    });
    const handleClick = (id) => {
        navigate(`/user/admin/adopterApprouved/${id}`)
    }

    if(!animals) return <p>Chargement ...</p>

    return (
        <AppSection
            id={"askForAdopt"}
            title={"Demande d'adoption"}
            content={
                <div className='flex-row alignCenter-AJ gap-15'>
                    {animals.length === 0 ? <h4>Il n'y a pas de demande</h4> : null}
                    {animals.map((animal, index) => (
                        <PresentationAnimal
                            key={index}
                            img={animal.imgName}
                            name={animal.name}
                            age={new Date().getFullYear() - new Date(animal.born).getFullYear()}
                            isMale={animal.isMale}
                            handleClick={() => handleClick(animal.id)}
                            isWaiting={!animal.isApprouved}
                        />
                    ))}
                </div>
            }
        />
    )
}

const UserPresentation = ({user}) => {
    const token = localStorage.getItem('token');
    const [isBan, setBan] = useState(user.isBlock);
    const navigate = useNavigate()
    const handleClick = () => {
        axios.patch("http://localhost:5000/api/user/admin/blockUpdate", {
            id: user.id,
            argument: !isBan
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json', // <- correct
              'Authorization': `Bearer ${token}`
            }
          }
        )
        .then(() => {
            setBan(!isBan);
        })
        .catch(error => {
          navigate("/login")
        });
    }
    return (
        <div className="userPresentation flex-row alignCenter-AJ">
            <div className="flex-column">
                <p>{user.lastname}</p>
                <p>{user.firstname}</p>
            </div>
            <p>{user.email}</p>
            <img src="/img/suspended.png" onClick={handleClick} className={isBan ? "ban" : ''} alt="" />
        </div>
    )
}

const BanUser = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const token = localStorage.getItem('token');
    const [users, setUsers] = useState(null);
    const [filteredUsers, setFilteredUsers] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        getFetchApi("user/admin/users", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          } )
          .then(data => {
            setUsers(data.users);
          })
          .catch(err => {
              navigate("/login")
          })
    }, []);
    

    useEffect(() => {
        if (users) {
          const filtered = users.filter((user) =>
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredUsers(filtered);
        }
        else{
            setFilteredUsers(users);
        }
      }, [users, searchTerm]);
    if(!filteredUsers || !users) return <p>Chargement ...</p>
    return (
        <AppSection
            title={"Blocker des utilisateurs"}
            content={
                <div className="flex-column row-gap-25">
                    <h4>Vous accueillez {users.length} utilsateurs</h4>
                   <div className="search-container">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input type="search" placeholder="Rechercher..." onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <div className="flex-column row-gap-15">
                    {filteredUsers.slice(0, 3).map(user => (
                      <UserPresentation key={user.email} user={user} />
                    ))}   
                    </div>
                    
                </div>
            }
        />
    )
}

const AdminSpace = () => {
    return (
        <main>
            <Logout message={"Space admin"}/>
            <AskForAdoption />
            <BanUser />
        </main>
    )
}

export default AdminSpace;