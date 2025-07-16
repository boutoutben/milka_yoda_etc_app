import AddAnimals from "../components/addAnimals";
import AllAnimales from "../components/allAnimales";
import './../css/mediatorAnimal.css'
import useIsGrandted from "../hook/useIsgranted";
import { PresentationMediation, StateMessage, useFetchMediator } from "../handles/MediatorAnimales";



const MediatorAnimal = () => {
    const granted = useIsGrandted("ADMIN_ROLE")
    const animals = useFetchMediator()
    if(!animals) return(<p>chargement ...</p>)
    return (
        <main>
            <StateMessage />
            {granted &&
                <AddAnimals apiUrl={'mediator/add'} />
            }
            <PresentationMediation />
            <AllAnimales animalData={animals} className='mediator' root={"/mediatorAnimal/"} />    
        </main>
        
    )
}

export default MediatorAnimal;