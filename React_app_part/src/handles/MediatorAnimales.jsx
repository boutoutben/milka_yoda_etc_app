import { useEffect, useState } from "react";
import AppSection from "../components/AppSection";
import getFetchApi from "../utils/getFetchApi";
import { useLocation } from "react-router-dom";

const PresentationMediation = () => {
    return (
        <AppSection 
            id={"presentationMediation"}
            content={
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Nulla vitae elit libero, a pharetra augue. Nullam id dolor id nibh ultricies vehicula ut id elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum.</p>
            }
        />
    )
}

const useFetchMediator = () => {
    const [animals, setAnimals] = useState(null);
    useEffect(() => {
        getFetchApi("mediator")
            .then(data => {
                setAnimals(data);
            })
            .catch(err => {
                console.error("Une erreur est survenue:", err.message);
            });
    }, []);
    return animals 
} 

const StateMessage = () => {
    const location = useLocation();
    const state = location.state;
    return (
        <>
            {state && (
                <p className="formError">{state.message}</p>
            )}
        </>
    )
}

export {PresentationMediation, useFetchMediator, StateMessage}