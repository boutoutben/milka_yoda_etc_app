import { render, screen } from "@testing-library/react";
import { AdopterInfo, AnimalAdopted, HaveAnimals, HouseType, LifeRoutine, Motivation, Sumary } from "../../handles/Sumary";


describe("AnimalAdopted", () => {
  test("should render animal data correctly", () => {
    const mockAnimal = {
      imgName: "dog.png",
      name: "Rex",
      born: "2020-05-01"
    };

    render(<AnimalAdopted animal={mockAnimal} />);

    // Vérifie l'image
    const image = screen.getByTestId("animalAdoptedImg");
    expect(image).toHaveAttribute("src", "http://localhost:5000/uploads/dog.png");

    // Vérifie le nom
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Rex");

    // Vérifie l'âge (selon l'année actuelle)
    const currentYear = new Date().getFullYear();
    const expectedAge = currentYear - 2020;
    expect(screen.getByText(`${expectedAge} ans`)).toBeInTheDocument();
  });
});

describe("AdopterInfo", () => {
    test("should display adopter's info without children", () => {
      const mockData = {
        values: {
          lastname: "Dupont",
          firstname: "Alice",
          civility: "Mme",
          age: "30",
          adressePostale: "75000",
          email: "alice@example.com",
          phone: "0601020304",
          haveChildren: "false",
          child: []
        }
      };
  
      render(<AdopterInfo data={mockData} />);
  
      expect(screen.getByText("personnel info")).toBeInTheDocument();
      expect(screen.getByText("Nom: Dupont")).toBeInTheDocument();
      expect(screen.getByText("Prénom: Alice")).toBeInTheDocument();
      expect(screen.getByText("Civilité: Mme")).toBeInTheDocument();
      expect(screen.getByText("Age: 30")).toBeInTheDocument();
      expect(screen.getByText("code postal: 75000")).toBeInTheDocument();
      expect(screen.getByText("Email: alice@example.com")).toBeInTheDocument();
      expect(screen.getByText("Téléphone: 0601020304")).toBeInTheDocument();
      expect(screen.getByText("A des enfants: non")).toBeInTheDocument();
    });
  
    test("should display adopter's info with children", () => {
      const mockData = {
        values: {
          lastname: "Martin",
          firstname: "Jean",
          civility: "M.",
          age: "40",
          adressePostale: "69000",
          email: "jean@example.com",
          phone: "0611223344",
          haveChildren: "true",
          child: ["5", "8"]
        }
      };
  
      render(<AdopterInfo data={mockData} />);
  
      expect(screen.getByText("A des enfants: oui")).toBeInTheDocument();
      expect(screen.getByText("Enfant 1: 5 ans")).toBeInTheDocument();
      expect(screen.getByText("Enfant 2: 8 ans")).toBeInTheDocument();
    });
  });

  describe("HaveAnimals", () => {
    test("should render selected animals and other animals", () => {
        const mockData = {
            animalCase: ["Chien", "Chat", "Autre"],
            animalNumber: { Chien: 2, Chat: 1, Autre: 0 },
            otherAnimals: [
                { name: "Lapin", number: 3 },
                { name: "", number: 0 }, // ignoré
                { name: "Hamster", number: 2 },
            ]
        };

        render(<HaveAnimals values={mockData} />);

        const allLi = screen.getAllByRole("listitem");
        expect(allLi).toHaveLength(4); // 2 animaux standards + 2 animaux "autres"

        // Vérifie précisément les contenus :
        expect(allLi[0]).toHaveTextContent("2 Chien");
        expect(allLi[1]).toHaveTextContent("1 Chat");
        expect(allLi[2]).toHaveTextContent("3 Lapin");
        expect(allLi[3]).toHaveTextContent("2 Hamster");
    });

    test("should render nothing if lists are empty", () => {
        const mockData = {
            animalCase: [],
            animalNumber: {},
            otherAnimals: []
        };

        render(<HaveAnimals values={mockData} />);
        const list = screen.getByRole("list");
        expect(list).toBeEmptyDOMElement();
    });
});

describe("LifeRoutine", () => {
    test("should render all lifeRoute", () => {
        const mockData = {
            lifeRoutine: ["Dynamique", "Calme"]
        };
        render(<LifeRoutine values={mockData} />);
        const allLi = screen.getAllByRole("listitem");
            expect(allLi).toHaveLength(2);
    
            // Vérifie précisément les contenus :
            expect(allLi[0]).toHaveTextContent("Dynamique");
            expect(allLi[1]).toHaveTextContent("Calme");
    })

    test("should no render if lifeRoute is empty", async () => {
        const mockData = {
            lifeRoutine: []
        };
        render(<LifeRoutine values={mockData} />);
        const allLi = screen.queryAllByRole("listitem");
            expect(allLi).toHaveLength(0);
    })
})

describe("HouseType", () => {
    test("Should render all animalPlace", async () => {
        const mockData = {
            animalPlace: ["Jardin"]
        };
        render(<HouseType values={mockData} />)
        const allLi = screen.getAllByRole("listitem");
        expect(allLi).toHaveLength(1);
        expect(allLi[0]).toHaveTextContent("Jardin");
    })
    test("should no render if lifeRoute is empty", async () => {
        const mockData = {
            animalPlace: []
        };
        render(<HouseType values={mockData} />);
        const allLi = screen.queryAllByRole("listitem");
            expect(allLi).toHaveLength(0);
    })
})

describe("Motivation", () => {
    const mockData = {values: {motivation: "This is my motivation"}};
    test("should render the motivation", () => {
        render(<Motivation data={mockData} />)
        expect(screen.getByText("This is my motivation"));   
    })
})


describe("Sumary", () => {
    const mockData = {
        animal: {
            imgName: "dog.png",
          name: "Rex",
          born: "2020-05-01",
        },
        values: {
          lastname: "Dupont",
          firstname: "Alice",
          civility: "Mme",
          age: "30",
          adressePostale: "75000",
          email: "alice@example.com",
          phone: "0601020304",
          haveChildren: "false",
          child: [],
          animalCase: ["Chien", "Chat", "Autre"],
          animalNumber: { Chien: 2, Chat: 1, Autre: 0 },
          otherAnimals: [
              { name: "Lapin", number: 3 },
              { name: "", number: 0 }, // ignoré
              { name: "Hamster", number: 2 },
          ],
          lifeRoutine: ["Dynamique", "Calme"],
          animalPlace: ["Jardin"],
          motivation: "This is my motivation"
}}
    test("Extension should be present if she's not empty", () => {
        const mockExtension = <p>This is the extension</p>;
        render(<Sumary sumaryData={mockData} extension={mockExtension} />)
        expect(screen.getByText("This is the extension")).toBeInTheDocument()
    })
    test("Extension should be empty is she's null", () => {
        render(<Sumary sumaryData={mockData} extension={null} />)
        expect(screen.queryByText("This is the extension")).not.toBeInTheDocument()
    })
})