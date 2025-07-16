import userEvent from "@testing-library/user-event"
import { ValidBtn } from "../../handles/AdopterSumary"
import { render, screen, waitFor } from "@testing-library/react"
import { useNavigate } from "react-router-dom";
import axios from "axios";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: () => ({ id: '123' }),
  }));

jest.mock("axios")

describe("ValidBtn", () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        jest.spyOn(console, "error").mockImplementation(() => {})
        jest.clearAllMocks()
    })

    const mockData = {
        values: {
            id:1
        },
        animal: {
            name: "test"
        }
    }
    test("should navigate after the handelePrevious click", async () => {
        render(<ValidBtn  data={mockData}/>)
        await userEvent.click(screen.getByText("Précédent"));
        expect(mockNavigate).toHaveBeenCalledWith("/adopterProfile", {"state": {"previousAnimal": {"name": "test"}, "previousValues": {"id": 1}}})
    });
    test("should send data and navigate after the handleSubmit click", async () => {
        axios.post.mockResolvedValue();
        render(<ValidBtn  data={mockData}/>)
        await userEvent.click(screen.getByText("Envoyer"));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        })
        expect(mockNavigate).toHaveBeenCalledWith("/adoptSucess")
    })

    test("should fail when server error", async () => {
        axios.post.mockRejectedValue(new Error("Mock error"));
        render(<ValidBtn  data={mockData}/>)
        await userEvent.click(screen.getByText("Envoyer"));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        })
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi du formulaire :", "Mock error")
    })
})