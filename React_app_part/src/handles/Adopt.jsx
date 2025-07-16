import { Formik, Form, Field } from 'formik';
import MainBtn from '../components/mainBtn';
import CloseImg from "../components/closeImg";
import SearchBar from "../components/searchBar";
import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import getFetchApi from '../utils/getFetchApi';

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
                console.error("Erreur serveur:", error.message);
        }
    };
    return (
        <Formik initialValues={initialValues} onSubmit={onSubmit} validate={null}>
            <Form>
                <div className='flex-column row-gap-15'>
                <div className='flex-column row-gap-15'>
                    <h3>Espèces: </h3>
                    <div className='flex-column'>
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
                <div className='flex-column row-gap-15'>
                    <h3>Genre: </h3>
                    <div className='flex-column'>
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
                <div className='flex-column row-gap-15'>
                    <h3>Âge: </h3>
                    <div className='flex-column'>
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
                </div>
            </Form>
        </Formik>

    )
}

ChoiceField.propTypes = {
    filteredAnimals: PropTypes.array,
    setFilteredAnimals: PropTypes.func
}

const Filter = ({filter, setFilter, filteredAnimals, setFilteredAnimals}) => {
    return (
        <aside className={`flex-column ${filter === true ? 'showFilter': ''}`} >
            <CloseImg click={()=> setFilter(false)} />
            <h2>Filter</h2>
            <ChoiceField filteredAnimals={filteredAnimals} setFilteredAnimals={setFilteredAnimals}/>   
        </aside>
    )
}

Filter.propTypes = {
    filter: PropTypes.bool,
    setFilter: PropTypes.func,
    filteredAnimals: PropTypes.array,
    setFilteredAnimals: PropTypes.func
}

const SearchBottom = ({filter, setFilter, setFiltered, setSearchTerm, count, searchTerm, elements}) => {
    return (
        <>
            <SearchBar elements={elements} setFiltered={setFiltered} setSearchTerm={setSearchTerm} searchTerm={searchTerm} fieldName={"name"} />
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

SearchBottom.propTypes = {
    filter: PropTypes.bool,
    setFilter: PropTypes.func,
    setFiltered: PropTypes.func,
    setSearchTerm: PropTypes.func,
    count: PropTypes.number,
    searchTerm: PropTypes.string,
    elements: PropTypes.array
}

function useAdoptAnimals(setAnimals, setFilteredAnimals) {
    useEffect(() => {
        getFetchApi("adopt")
            .then(data => {
                setAnimals(data.animals);
                setFilteredAnimals(data.animals);
            })
            .catch(err => {
                console.error(err);
            });
    }, [setAnimals, setFilteredAnimals]);
}

export {ChoiceField, Filter, SearchBottom, useAdoptAnimals }