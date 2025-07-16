import { useNavigate } from "react-router-dom";
import { ActionSumary, AnimalToAdopt, AssociationPresentation, BeingCarefullAboutAnimales, SocialMediaPresentation, WelcomeToMilkaYodaEtc } from "../handles/Welcome";
import "./../css/welcome.css"

const Welcome = () => {
    const navigate = useNavigate();
    return (
        <main id="welcomePage">
            <WelcomeToMilkaYodaEtc />
            <AssociationPresentation />
            <ActionSumary />  
            <AnimalToAdopt />
            <BeingCarefullAboutAnimales redirection={'/article'} navigate={navigate}/>
            <SocialMediaPresentation />
        </main>   
    )
}

export default Welcome;