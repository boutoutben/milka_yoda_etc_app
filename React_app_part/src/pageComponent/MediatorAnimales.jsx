import { AddAnimals, AllAnimales, WelcomeSection } from "./Component";
import './../css/mediatorAnimal.css'
import { getFetchApi } from "./App";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PresentationMediation = () => {
    return (
        <WelcomeSection 
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
            <AddAnimals apiUrl={'mediator/add'} />
            <PresentationMediation />
            <AllAnimales animalData={animals} className='mediator' root={"/mediatorAnimal/"} />    
        </main>
        
    )
}

export default MediatorAnimal;