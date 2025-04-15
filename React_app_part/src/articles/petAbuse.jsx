import { WelcomeSection } from "../pageComponent/Component";

const Article = () => {
    return (
        <>
            <WelcomeSection 
                content={
                    <>
                        <p>Stop à la violence envers les animaux domestiques : Agissons ensemble !</p>
                        <p>Nos animaux de compagnie sont bien plus que de simples compagnons : ils sont des membres à part entière de nos familles. Pourtant, chaque année, des milliers d’animaux domestiques subissent des actes de violence et de maltraitance. Il est de notre devoir à tous de prévenir ces comportements et d’agir pour protéger ces êtres sensibles et fidèles.</p>    
                    </>
                }
            />
            <WelcomeSection 
                title={"Comprendre la maltraitance animale"}
                content={
                    <>
                    <p>La maltraitance animale peut prendre différentes formes :</p>
                    <ul>
                        <li>Violences physiques : coups, blessures, mutilations</li>  
                        <li>Négligence : manque de nourriture, d’eau, de soins vétérinaires ou d’un abri adapté</li>
                        <li>Abandon : laisser un animal livré à lui-même sans ressources</li>
                        <li>Exploitation : forcer un animal à des tâches inadaptées ou dans des conditions extrêmes</li>
                    </ul>
                <p>Ces actes ne sont pas seulement cruels, mais ils sont aussi punis par la loi. En France, la maltraitance animale est passible de trois ans d’emprisonnement et 45 000 € d’amende.</p>
                    </>
                }
            />
                
            <WelcomeSection 
                title={"Pourquoi la violence envers les animaux est-elle un problème grave ?"}
                content={
                    <ol>
                        <li>Souffrance physique et psychologique : Comme les humains, les animaux ressentent la douleur, le stress et la peur.</li>
                        <li>Lien avec d’autres formes de violence : De nombreuses études montrent que la maltraitance animale est souvent liée à d’autres violences, notamment envers les enfants et les personnes vulnérables.</li>
                        <li>Impact sur la société : Tolérer la cruauté envers les animaux banalise la violence et nuit au vivre-ensemble.</li>
                    </ol>  
                }
            />   
                   
            <WelcomeSection 
                title={"Comment prévenir la maltraitance animale ?"}
                content={
                    <>
                        <p>✅ Sensibiliser et éduquer : Apprenons dès le plus jeune âge à respecter les animaux. Une éducation bienveillante et responsable est la clé pour prévenir la maltraitance.</p>
                        <p>✅ Adopter de manière responsable : Un animal n’est ni un jouet ni un caprice. Avant d’adopter, assurez-vous de pouvoir lui offrir un foyer stable et adapté à ses besoins.</p>
                        <p>✅ Surveiller et signaler : Si vous êtes témoin d’un acte de maltraitance ou d’un animal en détresse, contactez immédiatement la police, la gendarmerie, une association de protection animale ou la Fondation 30 Millions d’Amis.</p>
                        <p>✅ Soutenir les associations de protection animale : Faites un don, devenez bénévole ou sensibilisez votre entourage aux actions menées par les refuges et organisations de défense des animaux.</p>
                    </>
                }
            />
            <WelcomeSection 
                title={"Ensemble, protégeons nos compagnons !"}
                content={
                    <>
                        <p>Les animaux nous offrent amour et fidélité sans conditions. En retour, nous avons la responsabilité de les protéger et de leur offrir une vie digne et heureuse. La lutte contre la violence envers les animaux commence avec chacun de nous : soyons leur voix et agissons pour un monde plus respectueux et bienveillant.</p>
                        <p>Si vous êtes témoin de maltraitance, contactez la police ou une association de protection animale. Chaque signalement peut sauver une vie !</p>
                    </>
                }
                       
            />
        </>
    )
};

export default Article;


