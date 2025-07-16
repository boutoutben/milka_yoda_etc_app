import { render, screen, waitFor } from "@testing-library/react";
import { CordonateDonnation, CreditCardType, DonnationPrice, FormDonnation, InformationDonnation, MentualPrices, PayementDonnation, PaymentChoice, PonctualPrices, PriceDisplay } from "../../handles/Donnation";
import userEvent from "@testing-library/user-event";
import fetchCountries from "../../utils/fetchCountry";

let formik;

jest.mock('../../utils/fetchCountry', () => ({
    __esModule: true,  // Obligatoire pour mocker les exports par défaut en ESM
    default: jest.fn(),
  }));
  jest.mock('react-phone-number-input', () => ({
    __esModule: true,
    default: ({ value, onChange }) => (
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="phone-input"
      />
    ),
  }));

describe("DonnationPrice", () => {
    beforeEach(() => {
        formik = {
            values: {
                paymentAmount: ""
            }
        }
    })
    test("should render radio button with correct price and handle click", async () => {
      const mockClick = jest.fn();
      const price = "10";
      const checkPrice = "selected";
  
      render(
        <DonnationPrice  formik={formik} price={price} click={mockClick} checkPrice={checkPrice} />
      );

      const radio = screen.getByRole("radio");
      expect(radio).toBeInTheDocument();
      expect(screen.getByLabelText(/10€/)).toBeInTheDocument();
  
      await userEvent.click(radio);
      expect(mockClick).toHaveBeenCalled();
    });
  });

describe("PriceDisplay", () => {
    const mockValueArray = [5,10,20];
    beforeEach(() => {
        formik = {
            values: {
                paymentAmount: ""
            },
            handleChange: jest.fn()
        }
    })
    test("should render all DonnationPrice", async () => {
        render(
            <PriceDisplay formik={formik} valueArray={mockValueArray} />
        );

        const DonnationPrices = screen.getAllByTestId("donnationPrice");
        expect(DonnationPrices).toHaveLength(mockValueArray.length)
    });
    test("should check the radio on click", async () => {
        render(
            <PriceDisplay formik={formik} valueArray={mockValueArray} />
        );
        const donnationPrice = screen.getByLabelText(/5€/)
        await userEvent.click(donnationPrice);
        expect(formik.handleChange).toHaveBeenCalled()
        expect(donnationPrice).toBeChecked()
        expect(screen.getByLabelText(/10€/)).not.toBeChecked();
        expect(screen.getByLabelText(/20€/)).not.toBeChecked();
    })
})

describe("PonctualPrices", () => {
    beforeEach(() => {
        formik = {
            values: {
                paymentAmount: "",
                paymentFrequency: "ponctual"
            }
        }
    })
    const mockPrice = [10, 20,40]
    test("should render all DonnationPrice", async () => {
        render(
            <PonctualPrices formik={formik} />
        );

        const DonnationPrices = screen.getAllByTestId("donnationPrice");
        expect(DonnationPrices).toHaveLength(mockPrice.length)
        mockPrice.forEach(price => {
            expect(screen.getByLabelText(`${price}€`)).toBeInTheDocument()
        })
    });
})

describe("MentualPrices", () => {
    const mockPrice = [5, 10,20]
    test("should render all DonnationPrice", async () => {
        render(
            <MentualPrices formik={formik} />
        );

        const DonnationPrices = screen.getAllByTestId("donnationPrice");
        expect(DonnationPrices).toHaveLength(mockPrice.length)
        mockPrice.forEach(price => {
            expect(screen.getByLabelText(`${price}€`)).toBeInTheDocument()
        })
    });
});

describe("InformationDonnation", () => {
    beforeEach(() => {
        formik = {
            values: {
                paymentAmount: "",
                paymentFrequency: "ponctual"
            },
            handleChange: jest.fn(),
            setFieldValue: jest.fn()
        }
    })
    test("should have ponction selected by default and ponctionPrices render", async () => {
        render(
            <InformationDonnation formik={formik} />
        );
        const oneOffDonnation = await screen.findByText("Don ponctuel");
        expect(oneOffDonnation).toHaveClass("btnIsSelected");
        const mockOneOffDonnation = [10, 20, 40];
        const DonnationPrices = screen.getAllByTestId("donnationPrice");
        expect(DonnationPrices).toHaveLength(mockOneOffDonnation.length)
        mockOneOffDonnation.forEach(price => {
            expect(screen.getByLabelText(`${price}€`)).toBeInTheDocument()
        });
    })
    test("should have mentual selected on click and mentualPrices render", async () => {
        render(<InformationDonnation formik={formik} />);
      
        const mensualButton = screen.getByText("Don mensual").closest('button');
        await userEvent.click(mensualButton);
        expect(formik.setFieldValue).toHaveBeenCalledWith("paymentFrequency","mentual")
      });

    test("should change the number paymentAmount value ", async () => {
        render(<InformationDonnation formik={formik} />);

        const freePaymentAmountInput = screen.getByPlaceholderText("Montant libre");
        await userEvent.type(freePaymentAmountInput, "5");
        expect(formik.handleChange).toHaveBeenCalled()
    })
})


describe("coordonateDonnation", () => {
    beforeEach(() => {
        fetchCountries.mockResolvedValue({
          countries: [
            { value: 'FR', label: 'France' },
            { value: 'US', label: 'United States' },
          ],
        });
    
        formik = {
          values: {
            email: '',
            gender: '',
            lastname: '',
            firstname: '',
            homeAdress: '',
            postalAdresses: '',
            city: '',
            country: '',
            phone: '',
          },
          handleChange: jest.fn(),
          setFieldValue: jest.fn(),
        };
        jest.spyOn(console, "error").mockImplementation(() => {})
      });
    
      afterEach(() => {
        jest.restoreAllMocks();
      });
    
      test('fetches and displays countries', async () => {
        render(<CordonateDonnation formik={formik} />);
    
        await waitFor(() => {
            const franceOptions = screen.getAllByText('France');
            expect(franceOptions.length).toBeGreaterThan(0); // au moins une occurrence
            expect(screen.getByText('United States')).toBeInTheDocument();
          });
    
        expect(fetchCountries).toHaveBeenCalled();
      });
      test("should fail when displays countries error", async () => {
        fetchCountries.mockRejectedValue(new Error("Fetch error"));
        render(<CordonateDonnation formik={formik} />);
        expect(fetchCountries).toHaveBeenCalled()
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Fetch error")    
        })
        
      })
      test("field should fill after type", async () => {
        render(<CordonateDonnation formik={formik} />);

        await userEvent.type(screen.getByPlaceholderText("Nom"), "Dupont");
        expect(formik.handleChange).toHaveBeenCalled();

        await userEvent.type(screen.getByPlaceholderText("Prénom"), "Bob");
        expect(formik.handleChange).toHaveBeenCalled();

        await userEvent.type(screen.getByPlaceholderText("Email"), "test@example.com");
        expect(formik.handleChange).toHaveBeenCalled();

        await userEvent.type(screen.getByPlaceholderText("Adresse"), "1 rue de la rue");
        expect(formik.handleChange).toHaveBeenCalled();

        await userEvent.type(screen.getByPlaceholderText("Code postal"), "59000");
        expect(formik.handleChange).toHaveBeenCalled();
        
        await userEvent.type(screen.getByPlaceholderText("Ville"), "city");
        expect(formik.handleChange).toHaveBeenCalled();

        const selects = screen.getAllByRole("combobox");
        const genderSelect = selects[0]; 
        await userEvent.selectOptions(genderSelect, "man");
        expect(formik.handleChange).toHaveBeenCalled();

        const countrySelect = selects[1];
        await userEvent.selectOptions(countrySelect, "FR");
        expect(formik.handleChange).toHaveBeenCalled();

        await userEvent.type(screen.getByTestId('phone-input'), '0601020304');
        expect(formik.setFieldValue).toHaveBeenCalled();
        expect(formik.setFieldValue).toHaveBeenCalledTimes(10);
      })
    });

    describe("PaymentChoice", () => {
        const mockType = jest.fn();
        const mockSetType = jest.fn();
        beforeEach(() => {
            jest.clearAllMocks();
            formik = {
                values: {
                    paymentType: "creditCard"
                },
                handleChange: jest.fn()
            };

        })
        test("should render allPayment", async () => {
            render(<PaymentChoice type={mockType} setType={mockSetType} formik={formik} />)
            const paymentChoice = screen.getAllByTestId("paymentChoice");
            expect(paymentChoice).toHaveLength(2)
        });
        test("should select the payment on click", async () => {
            render(<PaymentChoice type={mockType} setType={mockSetType} formik={formik} />);
            await userEvent.click(screen.getByText("Paypal"));
            expect(formik.handleChange).toHaveBeenCalled();
            expect(mockSetType).toHaveBeenCalledWith("paypal")
        })
    })

    describe("CreditCardType", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            formik = {
                values: {
                    creditCardType: ""
                },
                handleChange: jest.fn()
            };

        })
        test("should render all credit card type", async () => {
            render(<CreditCardType formik={formik} />)
            expect(screen.getAllByTestId("creditCardType")).toHaveLength(3)
        })
        test("should select an type on click", async () => {
            render(<CreditCardType formik={formik} />)
            await userEvent.click(screen.getByTestId("masterCard"));
            expect(formik.handleChange).toHaveBeenCalled();
            const allRadio =screen.getAllByRole("radio");

            expect(allRadio[0]).not.toBeChecked();
            expect(allRadio[1]).toBeChecked();
            expect(allRadio[2]).not.toBeChecked();
        })
    })

    describe("PaymentDonnation", () => {
        const setPaymentType = jest.fn();
        beforeEach(() => {
            jest.clearAllMocks();
            formik = {
                values: {
                    paymentType: "creditCard"
                },
                handleChange: jest.fn()
            };

        })
        test("should render CreditCardType if paymentType is creditCard", async () => {
            render(<PayementDonnation formik={formik} paymentType={"creditCard"} setPaymentType={setPaymentType} />)
            await waitFor(() => {
                expect(screen.getAllByTestId("creditCardType")).toHaveLength(3);   
            })
        })
        test("should no render CreditCardType if paymentType is not creditCard", async () => {
            render(<PayementDonnation formik={formik} paymentType={"paypal"} setPaymentType={setPaymentType} />)
            await waitFor(() => {
                expect(screen.queryAllByTestId("creditCardType")).toHaveLength(0);   
            })
        })
    })

    describe("FormDonnation", () => {
        test("should render all component", async () => {
            render(<FormDonnation />)
            expect(screen.getByTestId("informationDonnation")).toBeInTheDocument();
            expect(screen.getByTestId("coordonateDonnation")).toBeInTheDocument();
            expect(screen.getByTestId("payementDonnation")).toBeInTheDocument();
        })
    })