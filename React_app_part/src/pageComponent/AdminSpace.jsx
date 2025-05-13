import { useEffect, useState } from "react";
import { Logout, PresentationAnimal, WelcomeSection } from "./Component";
import { getFetchApi } from "./App";
import { useNavigate } from "react-router-dom";
import '../css/adminSpace.css'

const AskForAdoption = () => {
    const [animals, setAnimals] = useState(null);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    useEffect(() => {
        getFetchApi("adminSpace", {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          } )
          .then(data => {
            setAnimals(data);
          })
          .catch(err => {
            console.error(err);
          })
    }, []);

    const handleClick = (id) => {
        navigate(`/adopterApprouved/${id}`)
    }

    if(!animals) return <p>Chargement ...</p>

    return (
        <WelcomeSection
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

const AdminSpace = () => {
    return (
        <main>
            <Logout message={"Space admin"}/>
            <AskForAdoption />
        </main>
    )
}

export default AdminSpace;