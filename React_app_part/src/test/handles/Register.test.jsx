import { render, screen, waitFor } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { RegisterSection } from "../../handles/Register";
import axios from "axios";
import encryptData from "../../utils/encryptData";

jest.mock("axios");
jest.mock("../../utils/encryptData")

describe("RegisterSection", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      encryptData.mockReturnValue("mock encrypt data");
      jest.spyOn(console, 'error').mockImplementation(() => {})
    });
    const mockNavigate = jest.fn();
    const fillForm = async () => {
        const lastnameInput = screen.getByPlaceholderText("Nom");
        await userEvent.type(lastnameInput, "Dupond");
        expect(lastnameInput).toHaveValue("Dupond");

        const firstnameInput = screen.getByPlaceholderText("Prénom");
        await userEvent.type(firstnameInput, "Bob");
        expect(firstnameInput).toHaveValue("Bob");

        const emailInput = screen.getByPlaceholderText("Email");
        await userEvent.type(emailInput, "test@example.com");
        expect(emailInput).toHaveValue("test@example.com");

        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        await userEvent.type(passwordInput, "Password123!");
        expect(passwordInput).toHaveValue("Password123!");

        const confirmPasswordInput = screen.getByPlaceholderText("Confirmation du mot de passe");
        await userEvent.type(confirmPasswordInput, "Password123!");
        expect(confirmPasswordInput).toHaveValue("Password123!");

        await userEvent.click(screen.getByRole("checkbox"));

        await userEvent.click(screen.getByRole("button", {name: "Créer un compte"}));
    }
    
    test("should submit and navigate to login", async () => {
        const mockResponse = { data: { id: 1 } };
        axios.post.mockResolvedValue(mockResponse);
    
        render(<RegisterSection navigate={mockNavigate} />);
    
        await fillForm(); // ← important d’attendre ici !
    
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });
    
        expect(mockNavigate).toHaveBeenCalledWith("/login", { state:{ user: { id: 1 }} });
    });

    test("should submit and return an error is server error", async () => {
        axios.post.mockRejectedValue(new Error("Mock error"));
        render(<RegisterSection navigate={jest.fn()} />)

        await fillForm();

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        })
        expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi:", "Mock error")
    })

    test("should not submit if form is not valide", async () => {
        render(<RegisterSection navigate={jest.fn()} />)

        await userEvent.click(screen.getByRole("button", {name: "Créer un compte"}));
        await waitFor(() => {
            expect(axios.post).not.toHaveBeenCalled();
        })
        expect(screen.getByText("Le nom est requis.")).toBeInTheDocument();
        expect(screen.getByText("Le prénom est requis.")).toBeInTheDocument();
        expect(screen.getByText("L'e-mail est requis.")).toBeInTheDocument();
        expect(screen.getByText("Le mot de passe est requis.")).toBeInTheDocument()
        expect(screen.getByText("La confirmation est requise.")).toBeInTheDocument();
        expect(screen.getByText("Vous devez accepter la condition.")).toBeInTheDocument()
    })
})