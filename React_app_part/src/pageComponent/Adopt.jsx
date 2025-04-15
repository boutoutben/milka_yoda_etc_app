import { Formik, Form, Field } from 'formik';
import { MainBtn, AllAnimales, CloseImg } from './Component';
import "./../css/adopt.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import { getFetchApi } from './App';
import axios from 'axios';


const ChoiceField = ({filteredAnimals, setFilteredAnimals}) => {
    const initialValues = {
        espece: "",
        gender:"",
        age: "",
    }
    const onSubmit = async (values) => {
        try {
            const response = await axios.post("http://localhost:5000/api/filter", {values,filteredAnimals});
            setFilteredAnimals(response.data);
            } catch (error) {
                console.error("Error:", error);
        }
    };
    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} validate={null}>
            <Form>
                {/* Sélection de l'espèce */}
                <div>
                    <h3>Espèces: </h3>
                    <div>
                        <label>
                            <Field type="radio" name="espece" value="" />
                            Indifférent
                        </label>
                        <label>
                            <Field type="radio" name="espece" value="chien" />
                            Chien
                        </label>
                        <label>
                            <Field type="radio" name="espece" value="chat" />
                            Chat
                        </label>
                    </div>
                </div>

                {/* Sélection du genre */}
                <div>
                    <h3>Genre: </h3>
                    <div>
                        <label>
                            <Field type="radio" name="gender" value="" />
                            Indifférent
                        </label>
                        <label>
                            <Field type="radio" name="gender" value="1" />
                            Mâle
                        </label>
                        <label>
                            <Field type="radio" name="gender" value="2" />
                            Femelle
                        </label>
                    </div>
                </div>

                {/* Sélection de l'âge */}
                <div>
                    <h3>Âge: </h3>
                    <div>
                        <label>
                            <Field type="radio" name="age" value="" />
                            Indifférent
                        </label>
                        <label>
                            <Field type="radio" name="age" value="young" />
                            Jeune
                        </label>
                        <label>
                            <Field type="radio" name="age" value="adult" />
                            Adulte
                        </label>
                        <label>
                            <Field type="radio" name="age" value="senior" />
                            Sénior
                        </label>
                    </div>
                </div>

                {/* Bouton de soumission */}
                <MainBtn name="Filtrer" className="btnInMain" isSubmit={true} />
            </Form>
        </Formik>

    )
}

const Filter = ({filter, setFilter, filteredAnimals, setFilteredAnimals}) => {
    return (
        <aside className={`flex-column ${filter == true ? 'showFilter': ''}`} >
            <CloseImg click={()=> setFilter(false)} />
            <h2>Filter</h2>
            <ChoiceField filteredAnimals={filteredAnimals} setFilteredAnimals={setFilteredAnimals}/>   
        </aside>
    )
}

const SearchBottom = ({filter, setFilter, setSearchTerm, count}) => {
    return (
        <>
            <div className="search-container">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="search" placeholder="Rechercher..." onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>
            <div id='filterInfo'>
                <div id='filterBtn' className='flex-row' onClick={() => setFilter(!filter)}>
                    <img src="img/filter.png" alt="" className='filterImg' />
                    <h2>Filtre</h2>
                </div>
                <h3>{count} résultat</h3>
            </div>
            
        </>
    )
}


const Adopt = () => {
    const [filter, setFilter] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredAnimals, setFilteredAnimals] = useState([]);
   

    const [animals, setAnimals] = useState([]);
    useEffect(() => {
        getFetchApi("adopt")
            .then(data => {
                setAnimals(data.animals);
            })
            .catch(err => {
                console.error(err);
            });
    }, []); 

    useEffect(() => {
        const filtered = Object.values(animals).filter(animal =>
            animal.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAnimals(filtered);
    }, [searchTerm, animals]);
    return (
        <main>
            <SearchBottom filter={filter} setFilter={setFilter} setSearchTerm={setSearchTerm} count={filteredAnimals.length}/>
            <section id="adoptInterface">
                <Filter filter={filter} setFilter={setFilter} filteredAnimals={animals} setFilteredAnimals={setFilteredAnimals} />
                
                {filteredAnimals.length == 0 ?<h3 className='noAnimal'>Il n'y a pas d'animaux ou pas qui corresponde à votre demande</h3>: ""}
                <AllAnimales animalData={filteredAnimals} redirectionUrl="/animalToAdoptDetail" />
            </section>
        </main>
    );
};

export default Adopt;