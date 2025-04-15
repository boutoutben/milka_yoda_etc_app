import { useFormik } from 'formik';
import '../css/adopterProfile.css';
import { MainBtn } from './Component';

const PersonnelInfo = () => {
    return (
        <section id='personnalInfo' className='flex-column'>
            <h2>Info personnelle</h2>
            <div className='flex-column'>
                <div className='flex-row'>
                    <select name="civility" >
                    <option value="monsieur">Monsieur</option>
                    <option value="madame">Madame</option>
                    <option value="autre">Autre</option>
                </select>
                <input type="text" name="lastname" placeholder='Nom*' />
                </div>
                <div className="flex-row">
                    <input type="text" name="firstname" placeholder='Prénom*' />
                    <input type="text" name="adressePostale" placeholder='Code postal*' />
                </div>
                <div className="flex-row">
                    <input type="text" name="email" placeholder='Email*' />
                    <input type="text" name="phone" placeholder='Téléphone*' />
                </div>    
            </div>
            
        </section>
    )
}

const HaveAnimals = () => {
    return(
        <section id='haveAnimals' className='flex-column'>
            <h2>Avez-vous des animaux</h2>
            <div className='flex-row checkbox-align'>
                <label className='checkbox'> Pas encore
                    <input type="checkbox" name="animalCase" />
                    <span className='check'></span>
                </label>
                <label className='checkbox'>Un chien ou +
                    <input type="checkbox" name="animalCase" id='OneDog'/>
                    <span className='check'></span>
                </label>
                <label className='checkbox'>Un chat ou +
                    <input type="checkbox" name="animalCase" id='oneCat'/>
                    <span className='check'></span> 
                </label>
                <label className='checkbox'>Un lapin, hamster
                    <input type="checkbox" name="animalCase" id='RabitAndHamster'/>
                    <span className='check'></span> 
                </label>
                <label className='checkbox'> Un autre animal
                    <input type="checkbox" name="animalCase" id='other'/>
                    <span className='check'></span>  
                </label>  
            </div>
        </section>
    )
}

const FamillyField = () => {
    return (
        <section className='flex-column'>
            <h2>Cadre famillial</h2>
            <h3>Quel est votre mode de vie ?</h3>
            <div className='flex-row checkbox-align'>
                <label className='checkbox'>Calme
                    <input type="checkbox" name="animalCase" />
                    <span className='check'></span>
                </label>
                <label className='checkbox'>Dynamique
                    <input type="checkbox" name="animalCase" id='OneDog'/>
                    <span className='check'></span>
                </label>
                <label className='checkbox'>Sportif
                    <input type="checkbox" name="animalCase" id='oneCat'/>
                    <span className='check'></span> 
                </label>
                <label className='checkbox'>Urbain
                    <input type="checkbox" name="animalCase" id='RabitAndHamster'/>
                    <span className='check'></span> 
                </label>
                <label className='checkbox'> En campagne
                    <input type="checkbox" name="animalCase" id='other'/>
                    <span className='check'></span>  
                </label>  
                <label className='checkbox'> Amoureux dea nature
                    <input type="checkbox" name="animalCase" id='other'/>
                    <span className='check'></span>  
                </label>  
            </div>
            <h3>Avez-vousun ou plusieurs enfant(s) ?</h3>
            <div className="flex-row checkbox-align">
                <label className='checkbox'> Oui
                    <input type="checkbox" name="animalCase" id='other'/>
                    <span className='check'></span>  
                </label>  
                <label className='checkbox'> Non
                    <input type="checkbox" name="animalCase" id='other'/>
                    <span className='check'></span>  
                </label> 
            </div> 
        </section>
    )
}

const Motivation = () => {
    return (
        <section id='modivation' className='flex-column'>
            <h2>Vos motivations</h2>
            <textarea name="" id="" placeholder='message...'></textarea>
        </section>
    )
}

const AcceptationCondition = () => {
    return (
        <section id='acceptationCondition'>
            <label className='checkbox'> J'accepte que ces informations soient transmise à l'association pour s'assurer du bien être de l'animal
                <input type="checkbox" name="animalCase" id='other'/>
                <span className='check'></span>  
            </label>   
        </section>
    )
}

const AdopterBtn = () => {
    return (
        <div className='flex-row alignCenter-AJ'>
            <MainBtn name="Recommencer" />
            <MainBtn name="Envoyer" isSubmit={true} />
        </div>
    )
}

const AdopterForm = () => {
    const formik = useFormik({
        initialValues:{
            email:'',
        },
        onSubmit: values => {
            console.log(JSON.stringify(values, null,2));
        }
    })
    return (
        <form onSubmit={formik.handleSubmit}>
            <PersonnelInfo />
            <HaveAnimals />
            <FamillyField />
            <Motivation />
            <AcceptationCondition />
            <AdopterBtn />
        </form>
    )
}

const AdopterProfile = () =>{
    return (
        <main id="adopterProfile">
            <h1>Information de l'adoptant</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat.</p>
            <AdopterForm />
        </main>
    )
}

export default AdopterProfile;