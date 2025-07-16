import { render, renderHook, screen, waitFor } from "@testing-library/react";
import getFetchApi from "../../utils/getFetchApi";
import { ResetPasswordSection, useGetResetPasswordMessage } from "../../handles/ResetPassword";;
import userEvent from "@testing-library/user-event";
import axios from "axios";
import encryptWithPublicKey from "../../utils/encryptWithPublicKey";

jest.mock("../../utils/getFetchApi.jsx");
jest.mock("axios");
jest.mock("../../utils/encryptWithPublicKey")

describe("useGetResetPasswordMessage", () => {
    test("should return the message get", async () => {
        getFetchApi.mockResolvedValue("Mock message");
        const {result} = renderHook(() => useGetResetPasswordMessage());
        await waitFor(() => {
            expect(result.current).toEqual("Mock message")
        })
    })
    test("should return an error is getFechtApi error", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {})
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        const {result} = renderHook(() => useGetResetPasswordMessage());
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error")
            expect(result.current).toEqual(null);
        })
    })
})

describe("ResetPasswordSection", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        encryptWithPublicKey.mockReturnValue("mock encrypt data");
        jest.spyOn(console, 'error').mockImplementation(() => {})
      });

    const mockNavigate = jest.fn()
    const fillForm = async () => {
        const passwordInput = screen.getByPlaceholderText("Mot de passe");
        await userEvent.type(passwordInput, "Password123!");
        expect(passwordInput).toHaveValue("Password123!");

        const confirmPasswordInput = screen.getByPlaceholderText("Confirmation du mot de passe");
        await userEvent.type(confirmPasswordInput, "Password123!");
        expect(confirmPasswordInput).toHaveValue("Password123!");

        await userEvent.click(screen.getByRole("button", {name: "Modifier"}));
    }
    test("should submit and navigate to loginPage", async () => {
        axios.post.mockResolvedValue();
        render(<ResetPasswordSection navigation={mockNavigate}/>)
        await fillForm()
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled()
        })

        expect(mockNavigate).toHaveBeenCalledWith("/login", {state: {"message": "Mot de passe changé avec succès."}})
    })

    test("should submit and return an error", async () => {
        axios.post.mockRejectedValue(new Error("Mock error"));
        render(<ResetPasswordSection navigation={mockNavigate}/>)
        await fillForm()
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled()
        })

        expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error");
    })

    test("should no submit is form not valid", async () => {
        render(<ResetPasswordSection navigation={mockNavigate}/>)
        await userEvent.click(screen.getByRole("button", {name: "Modifier"}))
        await waitFor(() => {
            expect(axios.post).not.toHaveBeenCalled()
            screen.getByText("Le mot de passe est requis.");
            screen.getByText("La confirmation est requise.");
        })
        
    })
});