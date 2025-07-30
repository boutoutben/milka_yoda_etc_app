import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getFetchApi from "../utils/getFetchApi";

import axios from "axios";
import AppSection from "../components/AppSection";
import PresentationAnimal from "../components/presentationAnimal"; 
import SearchBar from "../components/searchBar";
import PropTypes from "prop-types";

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
            if (err.status == 403 || err.status == 401) {
              navigate("/login", { state: { error: "Vous n'êtes pas ou plus authorisée" } });
            } else {
              console.error("Unexpected error: ", err.message);
            }
          });
    });
    const handleClick = (id) => {
        navigate(`/adopterApprouved/${id}`)
    }

    if(!animals) return <p>Chargement ...</p>

    return (
        <AppSection
            id={"askForAdopt"}
            title={"Demande d'adoption"}
            content={
                <div className='flex-row alignCenter-AJ gap-15'>
                    {animals.length === 0 ? <h4>Il n'y a pas de demande</h4> : null}
                    {animals.map((animal) => (
                        <PresentationAnimal
                            key={animal.id}
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
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            }
          }
        )
        .then(() => {
            setBan(!isBan);
        })
        .catch(err => {
            if (err.status == 403 || err.status == 401 ) {
              navigate("/login", { state: { error: "Vous n'êtes pas ou plus authorisée" } });
            } else {
              console.error("Unexpected error: ", err.message);
            }
          });
    }
    return (
        <div  className="userPresentation flex-row alignCenter-AJ">
            <div className="flex-column">
                <p>{user.lastname}</p>
                <p>{user.firstname}</p>
            </div>
            <p>{user.email}</p>
            <img src="/img/suspended.png" data-testid="banUser" onClick={handleClick} className={isBan ? "ban" : ''} alt="" />
        </div>
    )
}

UserPresentation.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        lastname: PropTypes.string,
        firstname: PropTypes.string,
        email: PropTypes.string,
        isBlock: PropTypes.bool
    })
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
            setFilteredUsers(data.users);
          })
          .catch(err => {
            if (err.status == 403 || err.status == 401) {
                navigate("/login", { state: { error: "Vous n'êtes pas ou plus authorisée" } });
              } else {
                console.error("Unexpected error: ", err.message);
              }
            });
    }, []);
    

   
    if(!users || !filteredUsers) return <p>Chargement ...</p>
    return (
        <AppSection
            id={"UserBan"}
            title={"Blocker des utilisateurs"}
            content={
                <div className="flex-column row-gap-25">
                    <h4>Vous accueillez {users.length} utilsateurs</h4>
                    <SearchBar elements={users} setFiltered={setFilteredUsers} searchTerm={searchTerm} setSearchTerm={setSearchTerm} fieldName={"email"}/>
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

export {AskForAdoption, UserPresentation, BanUser}