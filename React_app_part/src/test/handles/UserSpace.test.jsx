import { render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { AdoptedAnimals, useGetPersonnelData, useGetUserAnimals, UserInfo } from "../../handles/UserSpace";
import encryptWithPublicKey from "../../utils/encryptWithPublicKey";
import getFetchApi from "../../utils/getFetchApi";
import useGetPublicKey from "../../hook/useGetPublicKey";

jest.mock("axios")
jest.mock("../../utils/encryptWithPublicKey");
jest.mock("../../hook/useGetPublicKey.jsx")
jest.mock("../../utils/getFetchApi.jsx")

describe("UserInfo", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        encryptWithPublicKey.mockReturnValue("mock encrypt data");
        jest.spyOn(console, 'error').mockImplementation(() => {})
        jest.spyOn(Storage.prototype, "setItem");
        useGetPublicKey.mockResolvedValue("mock key")
      });
    const mockNavigate = jest.fn()
    const fillForm = async () => {
        const civilitySelect = screen.getByTestId("civility");
        await userEvent.selectOptions(civilitySelect, "2"); // Sélectionne "Madame"
        expect(civilitySelect).toHaveValue("2");

        await userEvent.type(screen.getByPlaceholderText("Nom*"), "Dupont");
        await userEvent.type(screen.getByPlaceholderText("Prénom*"), "Jean");
        await userEvent.type(screen.getByPlaceholderText("age"), "30");
        await userEvent.type(screen.getByPlaceholderText("Code postal*"), "75000");
        await userEvent.type(screen.getByPlaceholderText("Téléphone*"), "0600000000");
        await userEvent.type(screen.getByPlaceholderText("Email*"), "jean.dupont@example.com");

        // Vérification que les valeurs ont bien été mises
        expect(screen.getByPlaceholderText("Nom*")).toHaveValue("Dupont");
        expect(screen.getByPlaceholderText("Prénom*")).toHaveValue("Jean");
        expect(screen.getByPlaceholderText("age")).toHaveValue(30);
        expect(screen.getByPlaceholderText("Code postal*")).toHaveValue("75000");
        expect(screen.getByPlaceholderText("Téléphone*")).toHaveValue("0600000000");
        expect(screen.getByPlaceholderText("Email*")).toHaveValue("jean.dupont@example.com");

        await userEvent.click(screen.getByRole("button", {name: "Mettre à jour"}))
    }
    test("should submit and store the new info in localStorage", async () => {
        const mockData = {data: {message: "Infos mises à jour !", userInfo: {id:1}}}
        axios.put.mockResolvedValue(mockData);
        
        render(<UserInfo personnelInfo={{id:1}} navigate={mockNavigate} />);
        await fillForm();
        
        await waitFor(() => {
          expect(axios.put).toHaveBeenCalled();
        });
        expect(localStorage.setItem).toHaveBeenCalledWith(
            "userInformation",
            JSON.stringify({ id: 1 })
        );
        expect(screen.getByText("Infos mises à jour !")).toBeInTheDocument()
    });
    test("should submit and navigate to login because of no allow", async () => {
        axios.put.mockRejectedValue({
            response: { status: 403 },
          });
        
        render(<UserInfo personnelInfo={{id:1}} navigate={mockNavigate} />);
        await fillForm();
        
        await waitFor(() => {
          expect(axios.put).toHaveBeenCalled();
        });
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/login", {state: {error: "Vous n'êtes pas ou plus autorisé"}})
    });
    test("should submit and return an error is axios error", async () => {
        axios.put.mockRejectedValue(new Error("Mock error"));
        
        render(<UserInfo personnelInfo={{id:1}} navigate={mockNavigate} />);
        await fillForm();
        
        await waitFor(() => {
          expect(axios.put).toHaveBeenCalled();
        });
        expect(localStorage.setItem).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error");
    });
})

describe("AdoptedAnimals", () => {
    const mockNavigate = jest.fn()
    const animals = [
        { id: 1, imgName: "img1.jpg", name: "Rex", born: "2018-06-01", isMale: true, isApprouved: true },
        { id: 2, imgName: "img2.jpg", name: "Mimi", born: "2020-05-01", isMale: false, isApprouved: false },
      ];
    test("should render animals list", () => {
        render(<AdoptedAnimals animals={animals} navigate={mockNavigate} />);
    
        // Vérifie les noms des animaux
        expect(screen.getByText("Rex")).toBeInTheDocument();
        expect(screen.getByText("Mimi")).toBeInTheDocument();
    
        // Vérifie les âges calculés
        const currentYear = new Date().getFullYear();
        expect(screen.getByText(`${currentYear - 2018}`)).toBeInTheDocument();
        expect(screen.getByText(`${currentYear - 2020}`)).toBeInTheDocument();
      });
    
      test("should render empty message if animals is empty array", () => {
        render(<AdoptedAnimals animals={[]} />);
        expect(screen.getByText("Vous n'avez pas encore adopter d'animaux")).toBeInTheDocument();
      });
      test("should navigate to the animal details", async () => {
        render(<AdoptedAnimals animals={animals} navigate={mockNavigate} />);
        const AllPresentationAnimal = screen.getAllByTestId("presentationAnimal");
        await userEvent.click(AllPresentationAnimal[0])
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/adopter/1");
        })
      })
    });

    describe("useGetUserAnimals", () => {
        const mockNavigate = jest.fn()
        test("should return the animals", async () => {
            getFetchApi.mockResolvedValue([{id: 1}, {id:2}])
            const {result} = renderHook(() => useGetUserAnimals());
            await waitFor(() => {
                expect(result.current).toEqual([{id: 1}, {id:2}]);
            })
        })
        test("should return an error and navigate to login because of no allow", async () => {
            getFetchApi.mockRejectedValue({
              response: { status: 403 },
            });
          
            renderHook(() => useGetUserAnimals(mockNavigate));
          
            await waitFor(() => {
              expect(mockNavigate).toHaveBeenCalledWith("/login", {
                state: { error: "Vous n'êtes pas ou plus autorisé" },
              });
            });
          });
          test("should return an error and return null", async () => {
            jest.spyOn(console, "error").mockImplementation(() => {})
            getFetchApi.mockRejectedValue(new Error("Mock error"));
              const {result} = renderHook(() => useGetUserAnimals(mockNavigate));
              await waitFor(() => {
                expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error")
                expect(result.current).toEqual(null)
              })
          })
    })

    describe("useGetPersonnelData", () => {
        test("should return the date", async () => {
            getFetchApi.mockResolvedValue([{id: 1}])
            const {result} = renderHook(() => useGetPersonnelData());
            await waitFor(() => {
                expect(result.current).toEqual({id: 1})
            })
        })
        test("should return an error and null", async () => {
            jest.spyOn(console, "error").mockImplementation(() => {})
            getFetchApi.mockRejectedValue(new Error("Mock error"));
            const {result} = renderHook(() => useGetPersonnelData());
            await waitFor(() => {
                expect(console.error).toHaveBeenCalledWith("Erreur lors de la récupération des infos personnelles:", "Mock error")
                expect(result.current).toEqual(null)
              })
        })
    })