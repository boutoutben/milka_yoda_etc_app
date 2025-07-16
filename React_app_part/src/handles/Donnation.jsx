import PropTypes from "prop-types";
import PhoneInput from "react-phone-number-input"
import { useState, useEffect } from "react";
import 'react-phone-number-input/style.css'
import fr from 'react-phone-number-input/locale/fr'
import MainBtn from "../components/mainBtn";
import AppSection from "../components/AppSection";
import { useFormik } from "formik";
import fetchCountries from "../utils/fetchCountry";

const DonnationPrice = ({ formik, price, click, checkPrice }) => {
  return (
    <div name="price">
        <label
            data-testid={"donnationPrice"}
          id="donnationPrice"
          className={`${checkPrice}`}
          
        >
          <input
            type="radio"
            name="paymentAmount"
            value={price}
            onChange={formik.handleChange}
            onClick={click} 
          />
          {price}€
        </label>
    </div>
  );
};

const PriceDisplay = ({ formik, valueArray }) => {
    useEffect(() => {
        if (formik.values.paymentAmount < 0) {
          formik.setFieldValue("paymentAmount", valueArray[1]); // valeur par défaut
        }
      }, [formik, valueArray]);
    return (
      <>
        {valueArray.map((priceValue) => (
          <DonnationPrice
            key={priceValue}
            formik={formik} 
            price={priceValue}
            checkPrice={formik.values.paymentAmount == priceValue ? "checkPrice" : ""}
          />
        ))}
      </>
    );
  };

PriceDisplay.propTypes = {
    valueArray: PropTypes.array
}

const PonctualPrices = ({formik}) => {
    return (
      <PriceDisplay valueArray={[10,20,40]} formik={formik}  />
    )
  }
  
  const MentualPrices = ({formik}) => {
    return (
      <PriceDisplay valueArray={[5,10,20]} formik={formik}  />
    )
  }


  const InformationDonnation = ({formik}) => {
  
    return (
      <section data-testid="informationDonnation" id="informationDonnation">
        <h2>Mon don</h2>
        <div>
        <MainBtn
        name="Don ponctuel"
        className={`donnationBtn ${formik.values.paymentFrequency === "ponctual" ? "btnIsSelected" : ""}`}
        click={() => formik.setFieldValue("paymentFrequency", "ponctual")}
      />
      <MainBtn
        name="Don mensual"
        className={`donnationBtn ${formik.values.paymentFrequency === "mentual" ? "btnIsSelected" : ""}`}
        click={() => formik.setFieldValue("paymentFrequency", "mentual")}
      />
        </div>
        <div>
          {formik.values.paymentFrequency === "ponctual" ? <PonctualPrices formik={formik} /> : <MentualPrices formik={formik} />}
        </div>
        <input type="number" name="paymentAmount" placeholder="Montant libre" value={formik.values.paymentAmount} onChange={formik.handleChange} />
      </section>
    );
  };
  
  const CordonateDonnation = ({formik}) => {
    const [countries, setCountries] = useState([]);
  
    useEffect(() => {
      fetchCountries()
      .then(data => {
        setCountries(data.countries);
      })
        .catch(err  => {
          console.error("Une erreur est survenue:", err.message)
        })
    }, []);
  
    return (
      <AppSection
        id="coordonateDonnation"
        title="Mes coordonnées"
        content={ 
          <>
                <input type="text" name="email" placeholder="Email" value={formik.values.email} onChange={formik.handleChange} />
                <div className="flex-row alignCenter-AJ">
                  <select name="gender" value={formik.values.gender} onChange={formik.handleChange}>
                      <option value="">Genre</option>
                      <option value="man">Homme</option>
                      <option value="female">Femme</option>
                      <option value="other">Autre</option>
                  </select>
                  <input type="text" name="lastname" placeholder="Nom" value={formik.values.lastname} onChange={formik.handleChange}  />
                </div>
                <input type="text" name="firstname" placeholder="Prénom" value={formik.values.firstname} onChange={formik.handleChange} />
                <input type="text" name="homeAdress" placeholder="Adresse" value={formik.values.homeAdress} onChange={formik.handleChange} />
                <div>
                  <input type="text" name="postalAdresses" placeholder="Code postal" value={formik.values.postalAdresses} onChange={formik.handleChange}/>
                  <input type="text" name="city" placeholder="Ville" value={formik.values.city} onChange={formik.handleChange} />  
                </div>
                
  
              <select name="country" value={formik.values.country} onChange={formik.handleChange}>
                  <option value="">Sélectionne ton pays</option>
                  {countries.map((country) => (
                      <option key={country.value} value={country.value}>
                      {country.label}
                      </option>
                  ))}
                  </select>

  
                <PhoneInput
                    international
                    defaultCountry="FR"
                    labels={fr}
                    value={formik.values.phone}
                    onChange={(value) => formik.setFieldValue('phone', value)}
                />
          </>
        }
      />
    );
  };

  const PaymentChoice = ({type, setType, formik}) => {
    const paymentChoices = [
      { name: "Carte bancaire", src: "img/credit-card.png", type: "creditCard" },
      { name: "Paypal", src: "img/paypal.png", type: "paypal" }
    ];
  
    return (
      <div id="allPayment">
        {paymentChoices.map((payment, index) => (
          <div data-testid="paymentChoice" key={index} className={`payment ${type === payment.type?'selectPaymentType':''}`}  onClick={() => setType(payment.type)}>
            <input
            id={payment.type}
            type="radio"
            name="paymentType"
            value={payment.type}
            onChange={formik.handleChange}
            hidden
            />
            <label htmlFor={payment.type} className="flex-column alignCenter-AJ">
                <img src={payment.src} alt={payment.name} />
                <p>{payment.name}</p>
            </label>
          </div>
        ))}
      </div>
    );
  };

  const CreditCardType = ({formik}) => {
    const creditCardType = [
      { src: "img/visa.png", alt:"", type: "visa"},
      { src: "img/MasterCard.png", alt:"", type: "masterCard" },
      { src: "img/cb.png",alt:"", type: "cb"}
    ];
    return (
      <div className="creditCardType flex-row">
        {creditCardType.map((type, index) => (
        <div data-testid={"creditCardType"} key={type.src} className="flex-column alignCenter-AJ">
          <label htmlFor={`creditCardType-${index}`}><img src={type.src} alt={type.alt} /></label>
          <input
            type="radio"
            name="creditCardType"
            data-testid={type.type}
            value={type.type}
            id={`creditCardType-${index}`}
            onChange={formik.handleChange}
            />
        </div>
        ))}
      </div> 
    )
  }

  const PayementDonnation = ({formik, paymentType, setPaymentType}) => {
    return (
      <AppSection 
        id='payementDonnation'
        title={"Réglement"}
        content={
        <div>
          <PaymentChoice formik={formik} type={paymentType} setType={setPaymentType}/>
          {paymentType == "creditCard"?<CreditCardType formik={formik} />:null}
          
          <MainBtn className={"BtnInMain"} isSubmit={true} name={"Valider le payement"}/>
        </div>
        }
      />
    )
  }
  
  const FormDonnation = () => {
    const [paymentType, setPaymentType] = useState("creditCard");
    const formik = useFormik({
        initialValues: {
            paymentFrequency: 'ponctual',
            paymentAmount: -1,
            email:"", 
            gender:"",
            lastname: "",
            firstname: "",
            homeAdress: "",
            postalAdresses: "",
            city: "",
            country: "",
            phone: "",
            paymentType: "creditCard",
            creditCardType: ""
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })
    return (
        <form onSubmit={formik.handleSubmit}>
            <InformationDonnation formik={formik} />
            <CordonateDonnation formik={formik} />
            <PayementDonnation formik={formik} paymentType={paymentType} setPaymentType={setPaymentType} />
        </form>
    )
  }

  export {FormDonnation, PayementDonnation, CreditCardType, PaymentChoice, CordonateDonnation, InformationDonnation, MentualPrices, PonctualPrices, PriceDisplay, DonnationPrice}