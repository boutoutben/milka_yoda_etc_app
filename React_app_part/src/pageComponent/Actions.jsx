import { WelcomeSection, HorizontaleLine } from "./Component";
import { useNavigate } from "react-router-dom";
import "./../css/action.css"

const Action = ({title, src, alt, text, asBtn}) => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        event.preventDefault();
        navigate('/mediatorAnimal')
    }
    return (
        <WelcomeSection
        id={"action"}
        title={title}
        content={
                <p>
                    <img src={src} alt={alt} />{
                    text}
                </p>
        }
        nameBtn={asBtn!= null?"Voir plus":null}
        click={handleClick}
        />
    )
}
const Actions = () => {
    return (
        <main id="actionPage">
            <h1>Toutes nos actions</h1>
            <Action title='Médiation animal' src={"img/milka.JPG"} alt="cc" 
            text={"Lorem ipsum odor amet, consectetuer adipiscing elit. Purus torquent semper nascetur ultrices dolor penatibus himenaeos. Curae faucibus varius ullamcorper nunc torquent dictum eleifend purus penatibus. Mattis primis lacus proin, elit orci rutrum. Porta litora cras erat finibus morbi diam. Placerat imperdiet augue lobortis sit congue natoque nisi. Finibus natoque ad consequat feugiat; diam gravida gravida dictum? Dapibus magnis ex mollis mattis felis morbi augue. Platea ex varius sagittis donec dolor ultrices tristique magnis."}
            asBtn={true}
            />
            <HorizontaleLine />
            <Action title='Vente de produit' src={"img/ShopOnline.png"} alt="cc" 
            text={"Lorem ipsum odor amet, consectetuer adipiscing elit. Purus torquent semper nascetur ultrices dolor penatibus himenaeos. Curae faucibus varius ullamcorper nunc torquent dictum eleifend purus penatibus. Mattis primis lacus proin, elit orci rutrum. Porta litora cras erat finibus morbi diam. Placerat imperdiet augue lobortis sit congue natoque nisi. Finibus natoque ad consequat feugiat; diam gravida gravida dictum? Dapibus magnis ex mollis mattis felis morbi augue. Platea ex varius sagittis donec dolor ultrices tristique magnis."}
            />
        </main>
    )
}

export default Actions;