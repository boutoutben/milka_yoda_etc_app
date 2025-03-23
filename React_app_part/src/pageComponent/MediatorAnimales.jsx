import { AllAnimales, WelcomeSection } from "./Component";
import './../css/mediatorAnimal.css'

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
    const animalData = {
        animal1:{img:'tatai.JPG', name:'taitai', age:4, isMale:false},
        animal2:{img:'beber.jpeg', name:'beber', age:1, isMale: true},
        animal3:{img:'soso.JPG', name:'soleil', age:8, isMale:true},
        animal4:{img:'clochette.JPG', name:'clochette', age:2, isMale:false}
    }
    return (
        <main>
            <PresentationMediation />
            <AllAnimales animalData={animalData} redirectionUrl={'/mediatorAnimalDetail'} className='mediator'/>    
        </main>
        
    )
}

export default MediatorAnimal;