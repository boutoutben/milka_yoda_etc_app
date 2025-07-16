import { FormDonnation } from '../handles/Donnation';
import './../css/donnation.css'


const Donnation = () => {
    return (
        <main id="donnationPage">
            <h1>Espace de dons</h1> 
            <section id="donnationData">
              <FormDonnation />   
            </section>
        </main>
        
    )
}

export default Donnation; 