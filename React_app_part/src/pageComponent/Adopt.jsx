

import AllAnimales from '../components/allAnimales';
import AddAnimals from '../components/addAnimals';
import "./../css/adopt.css";
import { useLocation } from 'react-router-dom';
import { Filter, useAdoptAnimals, SearchBottom } from '../handles/Adopt';
import useIsGrandted from '../hook/useIsgranted';
import { useState } from 'react';

const Adopt = () => {
    const [filter, setFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAnimals, setFilteredAnimals] = useState([]); 
    const location = useLocation();
    const state = location.state;
    const [animals, setAnimals] = useState([]);
    const granted = useIsGrandted("ADMIN_ROLE")

      useAdoptAnimals(setAnimals, setFilteredAnimals);
    
    return (
        <main id='adopt'>
            {state && (
                <p className="formError">{state.message}</p>
            )}
            {granted && (
                <AddAnimals apiUrl="adopt/add" />
            )}
           
            <SearchBottom filter={filter} setFilter={setFilter} searchTerm={searchTerm} setFiltered={setFilteredAnimals} setSearchTerm={setSearchTerm} count={filteredAnimals.length} elements={animals} />
            <section id="adoptInterface">
                <Filter filter={filter} setFilter={setFilter} filteredAnimals={animals} setFilteredAnimals={setFilteredAnimals} />
                
                {filteredAnimals.length == 0 ?<h3 className='noAnimal'>Il n'y a pas d'animaux ou pas qui corresponde à votre demande</h3>: ""}
                <AllAnimales animalData={filteredAnimals} redirectionUrl="/animalToAdoptDetail" />
            </section>
        </main>
    );
};

export default Adopt;