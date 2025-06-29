import AddAnimals from "../components/addAnimals";
import AllAnimales from "../components/allAnimales";
import AppSection from "../components/AppSection";
import './../css/mediatorAnimal.css'
import getFetchApi from "../utils/getFetchApi";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import isGranted from "../utils/isGranted";

const PresentationMediation = () => {
    return (
        <AppSection 
            id={"presentationMediation"}
            content={
                <>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.</p>
                </>
            }
        />
    )
}

const MediatorAnimal = () => {
    const location = useLocation();
    const state = location.state;
    const [animals, setAnimals] = useState(null);
    const granted = isGranted("ADMIN_ROLE")
    useEffect(() => {
            getFetchApi("mediator")
                .then(data => {
                    setAnimals(data);
                   
                })
                .catch(err => {
                    console.error(err);
                });
        }, []); 
    if(!animals) return(<p>chargement ...</p>)
    return (
        <main>
            {state && (
                <p className="formError">{state.message}</p>
            )}
            {granted &&
                <AddAnimals apiUrl={'mediator/add'} />
            }
            <PresentationMediation />
            <AllAnimales animalData={animals} className='mediator' root={"/mediatorAnimal/"} />    
        </main>
        
    )
}

export default MediatorAnimal;