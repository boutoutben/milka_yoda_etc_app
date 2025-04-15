import { WelcomeSection } from "../pageComponent/Component";

const Article = () => {
    return (
        <>
            <WelcomeSection 
                content={
                    <p>Nos animaux de compagnie sont souvent gourmands et curieux de ce que nous mangeons. Il est tentant de leur donner des restes de table ou des aliments que nous aimons, mais cela peut être dangereux pour leur santé. Une alimentation inadaptée peut entraîner des problèmes digestifs, des intoxications et même des maladies graves. Alors, pourquoi faut-il être vigilant sur ce que l’on donne à nos compagnons à quatre pattes ?</p>
                }
            />
            <WelcomeSection
                title={"1. Leur système digestif est différent du nôtre"}
                content={<p>Les chiens, les chats et autres animaux domestiques n’ont pas le même métabolisme que les humains. Certains aliments que nous digérons sans problème peuvent être toxiques pour eux. Par exemple, le chocolat est inoffensif pour nous, mais il peut provoquer des intoxications graves, voire mortelles, chez les chiens et les chats.</p>}
            />
            <WelcomeSection
                title={"2. Les aliments dangereux à éviter absolument"}
                content={
                    <>
                        <p>De nombreux aliments courants sont nocifs, voire toxiques, pour nos animaux :</p>
                        <ul>
                            <li>Le chocolat : Contient de la théobromine, une substance toxique pour les chiens et les chats.</li>
                            <li>L’oignon, l’ail et l’échalote : Peuvent provoquer une anémie sévère en détruisant les globules rouges.</li>
                            <li>Les raisins et les raisins secs : Peuvent causer une insuffisance rénale aiguë chez le chien.</li>
                            <li>Les os cuits : Peuvent se casser en petits morceaux pointus et provoquer des perforations dans l’estomac ou les intestins.</li>
                            <li>Le lait et les produits laitiers : Beaucoup d’animaux sont intolérants au lactose et peuvent souffrir de diarrhées.</li>
                            <li>L’alcool et le café : Très toxiques, ils peuvent affecter le système nerveux et provoquer des troubles graves.</li>
                        </ul>
                    </>
                }
            />
            <WelcomeSection
                title={"3. Les risques d’une alimentation inadaptée"}
                content={
                    <>
                        <p>Donner des aliments inappropriés à un animal peut entraîner :</p>
                        <ul>
                            <li>Des troubles digestifs : Vomissements, diarrhées, ballonnements.</li>
                            <li>Des intoxications alimentaires : Certains aliments peuvent provoquer des intoxications nécessitant une prise en charge vétérinaire urgente.</li>
                            <li>L’obésité : Les restes de table, souvent trop gras ou trop salés, peuvent entraîner une prise de poids excessive et des problèmes de santé.</li>
                            <li>Des carences nutritionnelles : Un régime déséquilibré peut entraîner des déficiences en vitamines et minéraux essentiels.</li>
                        </ul>
                    </>
                }
            />
            <WelcomeSection
                title={"4. Que donner à son animal pour une alimentation saine ?"}
                content={
                    <>
                        <p>✅ Des croquettes ou pâtées adaptées à son espèce : De qualité et équilibrées.</p>
                        <p>✅ Des fruits et légumes sans danger : Carottes, courgettes, pommes (sans pépins).</p>
                        <p>✅ Des friandises spécifiques : Conçues pour leur digestion et leur plaisir.</p>
                        <p>✅ De l’eau fraîche à volonté : Essentielle pour leur hydratation et leur santé.</p>
                    </>
                }
            />
            <WelcomeSection
                title={"Conclusion"}
                content={
                    <p>Nos animaux ne savent pas toujours ce qui est bon ou mauvais pour eux. Il est donc de notre responsabilité de leur offrir une alimentation adaptée pour leur assurer une vie longue et en bonne santé. Plutôt que de céder à leurs petites bouilles suppliantes, donnons-leur ce qui est vraiment bon pour eux ! 🐶🐱🥕</p>
                }
            />
        </>
    )
}

export default Article;