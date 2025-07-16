import { cleanup, render, renderHook, screen, waitFor } from "@testing-library/react";
import { AcceptationCondition, AdopterBtn, AdopterForm, AnimalsPlace, CheckBoxElement, FamillyField, HaveAnimals, HaveChildrenElement, Motivation , useUserInfo} from "../../handles/AdopterProfile";
import userEvent from "@testing-library/user-event";
import getFetchApi from "../../utils/getFetchApi";
import { MemoryRouter, useNavigate } from "react-router-dom";


let mockFormik;

afterEach(cleanup);

describe("CheckBoxElement", () => {
  const mockArray = ["test1", "test2", "test3"];
  const testFormik = {
    values: { test: [] },
    setFieldValue: jest.fn(),
  };

  test("renders all checkbox labels", () => {
    render(<CheckBoxElement array={mockArray} formik={testFormik} name="test" />);
    const labels = screen.getAllByTestId("checkboxLabel");
    expect(labels).toHaveLength(mockArray.length);
    mockArray.forEach((labelText, index) => {
      expect(labels[index]).toHaveTextContent(labelText);
    });
  });

  test("selects and unselects a checkbox", async () => {
    render(<CheckBoxElement array={mockArray} formik={testFormik} name="test" />);
    const firstCheckbox = screen.getAllByRole("checkbox")[0];

    await userEvent.click(firstCheckbox);
    expect(testFormik.setFieldValue).toHaveBeenCalledWith("test", ["test1"]);

    testFormik.values.test = ["test1"];
    await userEvent.click(firstCheckbox);
    expect(testFormik.setFieldValue).toHaveBeenCalledWith("test", []);
  });

  test("checks correct checkboxes based on formik.values", () => {
    testFormik.values.test = ["test2"];
    render(<CheckBoxElement array={mockArray} formik={testFormik} name="test" />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
  });
});

describe("AnimalsPlace", () => {
  beforeEach(() => {
    mockFormik = {
      values: { animalPlace: "" },
      touched: {},
      errors: {},
      setFieldValue: jest.fn(),
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
    };
  });

  test("displays error when field is touched and has error", () => {
    mockFormik.touched.animalPlace = true;
    mockFormik.errors.animalPlace = "Ce champ est requis";
    render(<AnimalsPlace formik={mockFormik} />);
    expect(screen.getByText("Ce champ est requis")).toBeInTheDocument();
  });

  test("does not display error when field is not touched", () => {
    mockFormik.errors.animalPlace = "Ce champ est requis";
    mockFormik.touched.animalPlace = false;
    render(<AnimalsPlace formik={mockFormik} />);
    expect(screen.queryByText("Ce champ est requis")).not.toBeInTheDocument();
  });
});

describe("HaveAnimals", () => {
  const mockArray = ["test1", "test2"];

  beforeEach(() => {
    mockFormik = {
      values: {
        animalCase: [],
        otherAnimals: [{ name: "", number: "" }],
        animalNumber: {},
      },
      touched: {},
      errors: {},
      setFieldValue: jest.fn(),
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
    };
  });

  test("renders all animal labels including extra options", async () => {
    render(<HaveAnimals formik={mockFormik} array={mockArray} />);
    const labels = await screen.findAllByTestId("haveAnimalsLabel");
    expect(labels).toHaveLength(mockArray.length + 2);
    expect(labels[0]).toHaveTextContent("Pas encore");
    mockArray.forEach((text, index) => {
      expect(labels[index + 1]).toHaveTextContent(text);
    });
    expect(labels[mockArray.length + 1]).toHaveTextContent("Autre");
  });

  test("selects and unselects a checkbox", async () => {
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    const firstCheckbox = screen.getAllByRole("checkbox")[0];

    await userEvent.click(firstCheckbox);
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith("animalCase", ["Pas encore"]);

    mockFormik.values.animalCase = ["Pas encore"];
    await userEvent.click(firstCheckbox);
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith("animalCase", []);
  });

  test("checks correct checkboxes based on formik.values", () => {
    mockFormik.values.animalCase = ["test2"];
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
  });

  test("renders input next to checked classical animals", () => {
    mockFormik.values.animalCase = ["test1"];
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(screen.getByTestId("test1_number")).toBeInTheDocument();
  });

  test("does not render input for unclassical animals", () => {
    mockFormik.values.animalCase = ["Autre"];
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(screen.queryByTestId("autre_number")).not.toBeInTheDocument();
  });

  test("number input shows error only when touched", async () => {
    mockFormik.values.animalCase = ["test1"];
    mockFormik.errors.animalNumber = { test1: "Le champ est requis." };
    mockFormik.touched.animalNumber = { test1: true };

    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(await screen.findByText("Le champ est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.animalNumber = { test1: false };
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(screen.queryByText("Le champ est requis.")).not.toBeInTheDocument();
  });

  test("renders 'other' input when 'Autre' is checked", async () => {
    mockFormik.values.animalCase = ["Autre"];
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(mockFormik.values.otherAnimals).toEqual([{ name: "", number: "" }]);
    const otherInputs = await screen.findAllByTestId("otherAnimals");
    expect(otherInputs).toHaveLength(1);
  });

  test("handles change in 'otherAnimals' inputs", async () => {
    mockFormik.handleChange = jest.fn();
    mockFormik.values.animalCase = ["Autre"];
    mockFormik.values.otherAnimals = [{ name: "", number: "" }];

    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    const nameInput = screen.getByTestId("otherAnimals_0_name");
    const numberInput = screen.getByTestId("otherAnimals_0_number");

    await userEvent.type(nameInput, "Dog");
    await userEvent.type(numberInput, "2");

    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test("shows errors for 'otherAnimals' only when touched", async () => {
    mockFormik.values.animalCase = ["Autre"];
    mockFormik.values.otherAnimals = [{ name: "", number: "" }];
    mockFormik.errors.otherAnimals = [{ name: "Le nom est requis.", number: "Le nombre est requis." }];
    mockFormik.touched.otherAnimals = [{ name: true, number: true }];

    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(await screen.findByText("Le nom est requis.")).toBeInTheDocument();
    expect(await screen.findByText("Le nombre est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.otherAnimals = [{ name: false, number: false }];
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(screen.queryByText("Le nom est requis.")).not.toBeInTheDocument();
    expect(screen.queryByText("Le nombre est requis.")).not.toBeInTheDocument();
  });

  test("adds another animal input when plus button clicked", async () => {
    mockFormik.values.animalCase = ["Autre"];
    mockFormik.values.otherAnimals = [{ name: "", number: "" }];
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);

    const plusBtn = screen.getByTestId("plusBtn");
    await userEvent.click(plusBtn);
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith("otherAnimals", [
      { name: "", number: "" },
      { name: "", number: "" },
    ]);
  });

  test("deletes an animal input when delete button clicked", async () => {
    mockFormik.values.animalCase = ["Autre"];
    mockFormik.values.otherAnimals = [{ name: "", number: "" }];
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);

    const deleteBtn = screen.getByTestId("delete-paraph");
    await userEvent.click(deleteBtn);
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith("otherAnimals", []);
  });

  test("animalCase formik error shows correctly", async () => {
    mockFormik.values.animalCase = [""];
    mockFormik.errors.animalCase = "Le champs est requis.";
    mockFormik.touched.animalCase = true;
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(await screen.findByText("Le champs est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.animalCase = false;
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(screen.queryByText("Le champs est requis.")).not.toBeInTheDocument();
  });

  test("otherAnimals formik error shows correctly", async () => {
    mockFormik.values.animalCase = ["Autre"];
    mockFormik.errors.otherAnimals = "Le champs est requis.";
    mockFormik.touched.otherAnimals = true;
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(await screen.findByText("Le champs est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.otherAnimals = false;
    render(<HaveAnimals array={mockArray} formik={mockFormik} />);
    expect(screen.queryByText("Le champs est requis.")).not.toBeInTheDocument();
  });
});

describe("HaveChildrenElement", () => {
  beforeEach(() => {
    mockFormik = {
      values: { child: [""] },
      touched: {},
      errors: {},
      setFieldValue: jest.fn(),
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
    };
  });

  test("renders child input", () => {
    render(<HaveChildrenElement formik={mockFormik} />);
    expect(screen.getByTestId("child_0")).toBeInTheDocument();
  });

  test("handles input value and error display", async () => {
    mockFormik.errors.child = ["Le champ est requis."];
    mockFormik.touched.child = [true];
    render(<HaveChildrenElement formik={mockFormik} />);
    expect(await screen.findByText("Le champ est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.child = [false];
    render(<HaveChildrenElement formik={mockFormik} />);
    expect(screen.queryByText("Le champ est requis.")).not.toBeInTheDocument();

    cleanup();

    render(<HaveChildrenElement formik={mockFormik} />);
    const input = screen.getByTestId("child_0");
    await userEvent.clear(input);
    await userEvent.type(input, "5");
    expect(mockFormik.handleChange).toHaveBeenCalled();
  });

  test("adds a child field", async () => {
    render(<HaveChildrenElement formik={mockFormik} />);
    const plusBtn = screen.getByTestId("plusBtn");
    await userEvent.click(plusBtn);
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith("child", ["", ""]);
  });

  test("deletes a child field", async () => {
    mockFormik.values.child = ["cc", "ere"];
    render(<HaveChildrenElement formik={mockFormik} />);
    const deleteBtns = screen.getAllByTestId("delete-paraph");
    await userEvent.click(deleteBtns[0]);
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith("child", ["ere"]);
  });
});

describe("FamillyField", () => {
  const mockArray = ["test1", "test2"];

  beforeEach(() => {
    mockFormik = {
      values: { haveChildren: '', lifeRoutine: [], child: [] },
      touched: {},
      errors: {},
      setFieldValue: jest.fn(),
      handleChange: jest.fn(),
      handleBlur: jest.fn(),
    };
  });

  test("lifeRoutine formik error displays correctly", async () => {
    mockFormik.touched.lifeRoutine = true;
    mockFormik.errors.lifeRoutine = "Le champs est requis.";
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
    expect(screen.getByText("Le champs est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.lifeRoutine = false;
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
    expect(screen.queryByText("Le champs est requis.")).not.toBeInTheDocument();
  });

  test('should create an empty string in the child array if haveChildren is true', async () => {
    const user = userEvent.setup();
  
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
  
    // Simule le changement de valeur de Formik (car le onChange mocké ne fait rien)
    mockFormik.values.haveChildren = "true";
  
    // Déclenche le click sur le radio
    await user.click(screen.getByTestId('haveChildren'));
  
    // Force un re-render du composant
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
  
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith('child', ['']);
  });

  test("should restore the empty array of child if haveChildren is false", async () => {
    const user = userEvent.setup();
  
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
  
    // Simule le changement de valeur de Formik (car le onChange mocké ne fait rien)
    mockFormik.values.haveChildren = "false";
    mockFormik.values.child = ["2"];
  
    // Déclenche le click sur le radio
    await user.click(screen.getByTestId('haveNotChildren'));
  
    // Force un re-render du composant
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
  
    expect(mockFormik.setFieldValue).toHaveBeenCalledWith('child', []);
  })
  test("should render HaveChildrenElement is haveChildren is true", async () => {
    mockFormik.values.haveChildren = "true";
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
    await waitFor(() => {
      expect(screen.getByTestId("haveChildrenElement"));
    })
  })

  test("haveChildren formik error displays correctly", async () => {
    mockFormik.touched.haveChildren = true;
    mockFormik.errors.haveChildren = "Le champs est requis.";
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
    expect(screen.getByText("Le champs est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.haveChildren = false;
    render(<FamillyField formik={mockFormik} lifeRoutine={mockArray} />);
    expect(screen.queryByText("Le champs est requis.")).not.toBeInTheDocument();
  });
});

describe("motivation", () => {
  beforeEach(() => {
    mockFormik = {
      values: { motivation: '' },
      touched: {},
      errors: {},
      handleChange: jest.fn(),
    };
  });
  test("handle change should work", async () => {
    render(<Motivation formik={mockFormik} />);
    const motivationTextarea = screen.getByPlaceholderText("message...");
    await userEvent.type(motivationTextarea, "Example of textarea for test the user motivation and make sure that all work");
    expect(mockFormik.handleChange).toHaveBeenCalled()
  });
  test("motivation formik error should work", async () => {
    mockFormik.touched.motivation = true;
    mockFormik.errors.motivation = "Le champs est requis.";
    render(<Motivation formik={mockFormik} />);
    expect(screen.getByText("Le champs est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.motivation = false;
    render(<Motivation formik={mockFormik}/>);
    expect(screen.queryByText("Le champs est requis.")).not.toBeInTheDocument();
  });
});

describe("AcceptationCondition", () => {
  beforeEach(() => {
    mockFormik = {
      values: { accept: false },
      touched: {},
      errors: {},
      handleChange: jest.fn(),
    };
  });
  test("accept checkbox should valid the field", async () => {
    render(<AcceptationCondition formik={mockFormik}/>)
    const acceptCheckBox = screen.getByLabelText("J'accepte que ces informations soient transmise à l'association pour s'assurer du bien être de l'animal");
    await userEvent.click(acceptCheckBox);
    expect(mockFormik.handleChange).toHaveBeenCalled();
  })
  test("accept formik error should work", async () => {
    mockFormik.touched.accept = true;
    mockFormik.errors.accept = "Le champs est requis.";
    render(<AcceptationCondition formik={mockFormik} />);
    expect(screen.getByText("Le champs est requis.")).toBeInTheDocument();

    cleanup();

    mockFormik.touched.accept = false;
    render(<AcceptationCondition formik={mockFormik}/>);
    expect(screen.queryByText("Le champs est requis.")).not.toBeInTheDocument();
  });
});

describe('AdpoterBtn', () => {
  test("handleResetClick should be call is click", async () => {
    const mockHandleResetClick = jest.fn()
    render(<AdopterBtn handleResetClick={mockHandleResetClick} />)
    const handleResetBtn = screen.getByText("Recommencer");
    await userEvent.click(handleResetBtn);
    expect(mockHandleResetClick).toHaveBeenCalledTimes(1)
  });

  test("send btn should be submit type", async () => {
    render(<AdopterBtn handleResetClick={jest.fn} />);
    const sendBtn = screen.getByText("Envoyer");
    expect(sendBtn).toHaveAttribute('type', 'submit');
  })
})

jest.mock('../../utils/getFetchApi', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('useUserInfo', () => {
  const mockToken = 'test-token';

  beforeEach(() => {
    Storage.prototype.getItem = jest.fn(() => mockToken);
    jest.clearAllMocks();
  });

  it('should not fetch if no token', () => {
    Storage.prototype.getItem = jest.fn(() => null);
    renderHook(() => useUserInfo());
    expect(getFetchApi).not.toHaveBeenCalled();
  });

  it('should fetch user info if token exists', async () => {
    const mockData = [{ name: 'John Doe', age: 30 }];
    getFetchApi.mockResolvedValue(mockData);

    const { result } = renderHook(() => useUserInfo());

    await waitFor(() => {
      expect(result.current).toEqual(mockData[0]);
    });

    expect(getFetchApi).toHaveBeenCalledWith(
      'user/fetchPersonnelInfos',
      expect.objectContaining({
        method: 'GET',
        headers: { Authorization: `Bearer ${mockToken}` },
      })
    );
  });

  it('should handle fetch error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getFetchApi.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useUserInfo());

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erreur lors de la récupération des infos personnelles :",
        expect.any(Error)
      );
    });

    expect(result.current).toEqual({});
    consoleErrorSpy.mockRestore();
  });
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('AdopterForm', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    mockFormik = {
      values: {
        civility: 2,
        lastnamel: "Dupond",
        firstname: "Bob",
        adressePostale: "59000",
        email: "test@example.com",
        phone: "0600000000",
        animalCase: ["Pas encore"],
        animalNumber: {Chiens: "2"},
        otherAnimals: [],
        lifeRoutine: ["Dynamique"],
        haveChildren: false,
        motivation: "This is the test of the motivation who check is the motivation is working",
        accept: true,
        animalPlace: "Maison",
        age: "20",
        child: []
      }
    }
  });

  test('should submit and navigate', async () => {
    render(
      <MemoryRouter>
        <AdopterForm />
      </MemoryRouter>
    );
    const civilitySelect = screen.getByTestId("civility");
    await userEvent.selectOptions(civilitySelect, '1');
    expect(civilitySelect.value).toBe('1');
  
    // Remplissage des inputs texte
    await userEvent.type(screen.getByPlaceholderText('Nom*'), 'Dupont');
    await userEvent.type(screen.getByPlaceholderText('Prénom*'), 'Jean');
    await userEvent.type(screen.getByPlaceholderText('age'), '35');
    await userEvent.type(screen.getByPlaceholderText('Code postal*'), '75000');
    await userEvent.type(screen.getByPlaceholderText('Téléphone*'), '0601020304');
    await userEvent.type(screen.getByPlaceholderText('Email*'), 'jean.dupont@example.com');
  
    // Coche un ou plusieurs lieux de vie
    const maisonAvecJardinCheckbox = screen.getByRole('checkbox', { name: /Maison avec jardin/i });
    await userEvent.click(maisonAvecJardinCheckbox);
    expect(maisonAvecJardinCheckbox).toBeChecked();
  
    // Coche la case "Pas encore" dans "Avez-vous des animaux"
    const pasEncoreCheckbox = screen.getByRole('checkbox', { name: /Pas encore/i });
    await userEvent.click(pasEncoreCheckbox);
    expect(pasEncoreCheckbox).toBeChecked();
  
    // Coche "Calme" dans le cadre familial
    const calmeCheckbox = screen.getByDisplayValue('Calme');
    await userEvent.click(calmeCheckbox);
    expect(calmeCheckbox).toBeChecked();
  
    // Sélectionne "Non" pour les enfants
    const haveChildrenRadio = screen.getByTestId('haveNotChildren');
    await userEvent.click(haveChildrenRadio);
    expect(haveChildrenRadio).toBeChecked();
  
    // Remplit la textarea de motivation
    await userEvent.type(screen.getByPlaceholderText('message...'), 'Je souhaite adopter un animal pour lui offrir un foyer.');
  
    // Coche la case d'acceptation des conditions
    const acceptCheckbox = screen.getByRole('checkbox', { name: /j'accepte/i });
    await userEvent.click(acceptCheckbox);
    expect(acceptCheckbox).toBeChecked();
    
    const sendBtn = screen.getByText("Envoyer");
    await userEvent.click(sendBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/adopterSumary", {"state": {"animal": null, "values": {"accept": true, "adressePostale": "75000", "age": 35, "animalCase": ["Pas encore"], "animalNumber": {}, "animalPlace": ["Maison avec jardin"], "child": [], "civility": "1", "email": "jean.dupont@example.com", "firstname": "Jean", "haveChildren": "false", "lastname": "Dupont", "lifeRoutine": ["Calme"], "motivation": "Je souhaite adopter un animal pour lui offrir un foyer.", "otherAnimals": [{"name": "", "number": ""}], "phone": "0601020304"}}})
  });
  test("should not submit is formik error", async () => {
    render(
      <MemoryRouter>
        <AdopterForm />
      </MemoryRouter>
    );
    const sendBtn = screen.getByText("Envoyer");
    await userEvent.click(sendBtn);
    expect(screen.getByText("La civilité est requise.")).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
});