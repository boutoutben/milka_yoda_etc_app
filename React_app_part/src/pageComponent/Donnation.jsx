import { Formik, Form, Field } from "formik";
import { MainBtn, WelcomeSection } from "./Component";
import './../css/donnation.css'
import PhoneInput from "react-phone-number-input"
import { useState, useEffect } from "react";
import 'react-phone-number-input/style.css'
import fr from 'react-phone-number-input/locale/fr'

const DonnationPrice = ({ price, click, checkPrice }) => {
  return (
    <Field name="price">
      {({ field }) => (
        <label
          id="donnationPrice"
          className={`${checkPrice}`}
          onClick={click} // Call the function passed as a prop
        >
          <input
            type="radio"
            {...field}
            value={price}
          />
          {price}€
        </label>
      )}
    </Field>
  );
};

const PriceDisplay = ({ valueArray }) => {
  const [checkId, setCheckId] = useState(valueArray[1]);

  return (
    <>
      {valueArray.map((priceValue) => (
        <DonnationPrice
          key={priceValue} // Always add a key when mapping
          price={priceValue}
          click={() => setCheckId(priceValue)} // Set as a string, not an object
          checkPrice={checkId === priceValue ? "checkPrice" : ""}
        />
      ))}
    </>
  );
};

const PonctualPrices = () => {
  return (
    <PriceDisplay valueArray={[10,20,40]} />
  )
}

const MentualPrices = () => {
  return (
    <PriceDisplay valueArray={[5,10,20]} />
  )
}

const InformationDonnation = () => {
  const [donnationPrices, setDonnationPrices] = useState("ponctual");

  return (
    <section id="informationDonnation">
      <h2>Mon don</h2>
      <div>
        <MainBtn
          name="Don ponctuel"
          className={`donnationBtn ${donnationPrices === 'ponctual' ? 'btnIsSelected' : ''}`}
          click={() => setDonnationPrices("ponctual")}
        />
        <MainBtn
          name="Don mensual"
          className={`donnationBtn ${donnationPrices === 'mentual' ? 'btnIsSelected' : ''}`}
          click={() => setDonnationPrices("mentual")}
        />
      </div>
      <div>
        {donnationPrices === "ponctual" ? <PonctualPrices /> : <MentualPrices />}
      </div>
      <input type="number" placeholder="Montant libre" />
    </section>
  );
};



const CordonateDonnation = () => {
  const [phone, setPhone] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code"
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      });
  }, []);

  return (
    <WelcomeSection
      id="coordonateDonnation"
      title="Mes coordonnées"
      content={ 
        <>
              <Field type="text" name="email" placeholder="Email" />
              <div className="flex-row alignCenter-AJ">
                <Field as="select" name="gender">
                    <option value="">Genre</option>
                    <option value="man">Homme</option>
                    <option value="female">Femme</option>
                    <option value="other">Autre</option>
                </Field>
                <Field type="text" name="lastname" placeholder="Nom" />
              </div>
              <Field type="text" name="firstname" placeholder="Prénom" />
              <Field type="text" name="homeAdress" placeholder="Adresse" />
              <div>
                <Field type="text" name="adressePostale" placeholder="Code postal" />
                <Field type="text" name="city" placeholder="Ville" />  
              </div>
              

            <Field as="select" name="country" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
                <option value="">Sélectionne ton pays</option>
                {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                    {country.label}
                    </option>
                ))}
                </Field>

              <PhoneInput
              international
              defaultCountry="FR"
              labels={fr}
              value={phone}
              onChange={value=>setPhone(value)}
              />
        </>
      }
    />
  );
};


const PaymentChoice = ({type, setType}) => {
  const paymentChoices = [
    { name: "Carte bancaire", src: "img/credit-card.png", type: "creditCard" },
    { name: "Paypal", src: "img/paypal.png", type: "paypal" }
  ];

  return (
    <div id="allPayment">
      {paymentChoices.map((payment, index) => (
        <div key={index} className={`payment ${type === payment.type?'selectPaymentType':''}`}  onClick={() => setType(payment.type)}>
          <img src={payment.src} alt={payment.name} />
          <p>{payment.name}</p>
        </div>
      ))}
    </div>
  );
};

const CreditCardType = () => {
  const creditCardType = [
    { src: "img/visa.png", alt:""},
    { src: "img/MasterCard.png", alt:"" },
    { src: "img/cb.png",alt:""}
  ];
  return (
    <div className="creditCardType flex-row">
      {creditCardType.map((type, index) => (
      <div key={index} className="flex-column alignCenter-AJ">
        <label htmlFor={index}><img src={type.src} alt={type.alt} /></label>
        <Field type="radio" name="type" id={index}/>
      </div>
      ))}
    </div>
      
  )
  
}

const PayementDonnation = () => {
  const [paymentType, setPaymentType] = useState("creditCard");
  return (
    <WelcomeSection 
      id='payementDonnation'
      title={"Réglement"}
      content={
      <div>
        <PaymentChoice type={paymentType} setType={setPaymentType}/>
        {paymentType == "creditCard"?<CreditCardType />:null}
        
        <MainBtn className={"BtnInMain"} name={"Valider le payement"}/>
      </div>
      }
    />
  )
}


const FormDonnation = () => {
  return (
      <Formik>
        <Form>
          <InformationDonnation />
          <CordonateDonnation />
          <PayementDonnation />
        </Form>
      </Formik>
  )
}

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