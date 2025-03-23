import { Formik, Form, Field } from 'formik';
import { MainBtn, AllAnimales, CloseImg } from './Component';
import "./../css/adopt.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';


const ChoiceField = () => {
    const initialValues = {
        espece: "dog",
        gender:"Male",
        age: "young",
    }
    const onSubmit = () => {
        console.log("Filter Validé")
    }
    return (
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validate={null}
        >
            <Form>
                <div>
                    <h3>Espèces: </h3>
                    <div>
                        <label>
                            <Field type='radio' name='espece' value='dog'/>
                            Chien
                        </label>
                        <label>
                            <Field type='radio' name='espece' value='cat' />
                            Chat
                        </label>
                    </div>
                </div>
                <div>
                    <h3>Gende: </h3>
                    <div>
                      <label>
                        <Field type='radio' name='gender' value='Male'/>
                            Male
                        </label>
                        <label>
                            <Field type='radio' name='gender' value='Female' />
                            Female
                        </label>  
                    </div>
                </div>
                <div>
                    <h3>Age: </h3>
                    <div>
                        <label>
                            <Field type='radio' name='age' value='young'/>
                            Jeune
                        </label>
                        <label>
                            <Field type='radio' name='age' value='adult' />
                            Adulte
                        </label>
                        <label>
                            <Field type='radio' name='age' value='senior' />
                            Sénior
                        </label>    
                    </div>
                    
                </div>
                <MainBtn name="Filtrer" className={"btnInMain"} isSubmit={true}/>
            </Form>
        </Formik>
    )
}

const Filter = ({filter, setFilter}) => {
    return (
        <aside className={`flex-column ${filter == true ? 'showFilter': ''}`} >
            <CloseImg click={()=> setFilter(false)} />
            <h2>Filter</h2>
            <ChoiceField />   
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
                <div id='filterBtn' onClick={() => setFilter(!filter)}>
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

    const animals = {
        animal1: { img: "tatai.JPG", name: "taitai", age: 4, isMale: false },
        animal2: { img: "beber.jpeg", name: "beber", age: 1, isMale: true },
        animal3: { img: "soso.JPG", name: "soleil", age: 8, isMale: true },
        animal4: { img: "clochette.JPG", name: "clochette", age: 2, isMale: false }
    };

    // Mettre à jour les animaux filtrés quand searchTerm change
    useEffect(() => {
        const filtered = Object.values(animals).filter(animal =>
            animal.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredAnimals(filtered);
    }, [searchTerm]); // Exécuter quand searchTerm change
    return (
        <main>
            <SearchBottom filter={filter} setFilter={setFilter} setSearchTerm={setSearchTerm} count={filteredAnimals.length}/>
            <section id="adoptInterface">
                <Filter filter={filter} setFilter={setFilter} />
                
                {filteredAnimals.length == 0 ?<h3 className='noAnimal'>Il n'y a pas d'animaux ou pas qui corresponde à votre demande</h3>: ""}
                <AllAnimales animalData={filteredAnimals} redirectionUrl="/animalToAdoptDetail" />
            </section>
        </main>
    );
};

export default Adopt;