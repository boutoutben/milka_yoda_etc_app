import { WelcomeSection } from "../pageComponent/Component"

const Article = () => {
    return (
        <>
            <WelcomeSection 
                title={"Pourquoi est-il essentiel de donner de l'attention à son animal de compagnie ?"}
                content={
                    <>
                        <p>Nos animaux de compagnie sont bien plus que de simples compagnons : ils font partie de notre famille. Qu’il s’agisse d’un chien, d’un chat, d’un lapin ou d’un oiseau, chaque animal a besoin d’attention et d’affection pour être heureux et en bonne santé. Mais pourquoi est-ce si important ?</p>
                        <ol>
                            <li>L’attention renforce le lien affectif</li>
                            <p>Un animal bien entouré développe une relation forte avec son propriétaire. En lui accordant du temps chaque jour – en jouant avec lui, en le caressant ou simplement en lui parlant – vous construisez une connexion basée sur la confiance et la sécurité.</p>
                            <li>Une nécessité pour son bien-être mental</li>
                            <p>L’ennui et la solitude peuvent être très néfastes pour un animal domestique. Un chat qui manque d’attention peut devenir anxieux et développer des comportements destructeurs. Un chien laissé seul trop longtemps peut souffrir d’anxiété de séparation et aboyer excessivement. Passer du temps avec son animal réduit son stress et lui procure du bien-être.</p>
                            <li>Favoriser une bonne santé physique</li>
                            <p>L’attention passe aussi par l’activité physique. Les chiens ont besoin de sorties quotidiennes pour se dépenser, les chats adorent jouer pour stimuler leur instinct de chasse, et même les petits rongeurs nécessitent des moments d’exploration hors de leur cage. Un animal actif est un animal en meilleure santé !</p>
                            <li>Une meilleure éducation et un comportement équilibré</li>
                            <p>Un animal qui reçoit de l’attention est plus à l’écoute et mieux éduqué. Il comprend les règles de la maison et s’adapte plus facilement à son environnement. Ignorer un animal peut mener à des comportements indésirables comme la destruction d’objets ou l’agressivité.</p>
                            <li>Un bonheur partagé</li>
                            <p>Prendre soin de son animal ne profite pas qu’à lui ! De nombreuses études montrent que le contact avec un animal réduit le stress et favorise le bien-être chez l’humain. En lui offrant de l’attention, vous recevez en retour beaucoup d’amour et de réconfort.</p>
                        </ol>
                    </>
                }
            />
            <WelcomeSection 
                title={"Comment bien accorder de l’attention à son animal ?"}
                content={
                    <>
                        <p>✔ Jouer avec lui : Des jeux adaptés à son espèce et à ses besoins.</p>
                        <p>✔ Lui parler et le câliner : Les animaux comprennent notre ton de voix et ressentent notre affection.</p>
                        <p>✔ Lui consacrer du temps chaque jour : Même quelques minutes de présence active peuvent faire la différence.</p>
                        <p>✔ Lui proposer des activités stimulantes : Jouets, promenades, entraînements...</p>
                        <p>✔ Observer son comportement : Un changement peut être le signe d’un mal-être ou d’un problème de santé.</p>
                    </>
                }
            />
            <WelcomeSection 
                title={"Conclusion"}
                content={
                    <p>Nos animaux nous donnent tant d’amour, il est essentiel de leur rendre la pareille ! En leur accordant du temps et de l’attention, nous leur offrons une vie plus heureuse et équilibrée. Un animal heureux, c’est un foyer épanoui. Alors, prenez quelques minutes aujourd’hui pour jouer avec votre compagnon à quatre pattes. 🐶🐱🐰</p>
                }
            />
        </>
    )
}

export default Article;