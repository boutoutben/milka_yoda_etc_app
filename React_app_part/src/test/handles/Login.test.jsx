import userEvent from "@testing-library/user-event"
import { cleanup, render, screen, waitFor } from "@testing-library/react"
import axios from "axios"
import convertExpiresInToMs from "../../utils/convertExpiresInToMS"
import { MemoryRouter, useLocation } from "react-router-dom"
import encryptWithPublicKey from "../../utils/encryptWithPublicKey"
import * as HandleLogin from "../../handles/Login"

const { ForgetAndNoAccountBtn, handleResponse, LoginSection, handleError } = HandleLogin; 


jest.mock("axios")
jest.mock("../../utils/encryptWithPublicKey")

describe("ForgetBtn", () => {
    const mockReload = jest.fn()
    test("should render the form on forget btn click", async () => {
        render(<ForgetAndNoAccountBtn />)
        await userEvent.click(screen.getByText("mot de passe oublié"));
        await waitFor(() => {
            expect(screen.getByTestId("forgetPasswordForm")).toBeInTheDocument();
        })
    });
    test("should submit on form submit btn click and reload", async () => {
        axios.post.mockResolvedValue();
        render(<ForgetAndNoAccountBtn onReload={mockReload}/>)
        await userEvent.click(screen.getByText("mot de passe oublié"));
        await waitFor(() => {
            expect(screen.getByTestId("forgetPasswordForm")).toBeInTheDocument();
        })
        await userEvent.type(screen.getByTestId("forgetPasswordEmail"), "test@example.com");
        await userEvent.click(screen.getByRole('button', { name: /valider/i }));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        })
        expect(mockReload);
    });
    test("shoud sumit on form submit btn click and fail with error", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        axios.post.mockRejectedValue(new Error("Mock error"));
        render(<ForgetAndNoAccountBtn onReload={mockReload}/>)
        await userEvent.click(screen.getByText("mot de passe oublié"));
        await waitFor(() => {
            expect(screen.getByTestId("forgetPasswordForm")).toBeInTheDocument();
        })
        await userEvent.type(screen.getByTestId("forgetPasswordEmail"), "test@example.com");
        await userEvent.click(screen.getByRole('button', { name: /valider/i }));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        })
        expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error");

    })
});

describe("handleResponse", () => {
    const mockResponse = {
        data: {
            token: "Mock token",
            userInfo: {
                roleName:"USER_ROLE"
            },
            expiresIn: new Date(Date.now + 100 * 1000)
        }
    }
    const mockNavigate = jest.fn()
    test("localStorage should store the tokens and the expirationData", () => {
        jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {});
        jest.spyOn(Date, "now").mockReturnValue(1000000000);
      
        handleResponse(mockNavigate, mockResponse);
      
        const expirationMs = convertExpiresInToMs(mockResponse.expiresIn);
        expect(localStorage.setItem.mock.calls).toEqual([
        ["token", "Mock token"],
        ["tokenExpiration", new Date(1000000000 + expirationMs).toISOString()],
        ]);
      });
      test("should navigate to userSpace", async () => {
        handleResponse(mockNavigate, mockResponse);
        expect(mockNavigate).toHaveBeenCalledWith("/userSpace")
      })
      test("should navigate to adminSpace", async () => {
        mockResponse.data.userInfo.roleName = "ADMIN_ROLE"
        handleResponse(mockNavigate, mockResponse);
        expect(mockNavigate).toHaveBeenCalledWith("/adminSpace")
      })
      test("should navigate to login", async () => {
        mockResponse.data.userInfo.roleName = null
        handleResponse(mockNavigate, mockResponse);
        expect(mockNavigate).toHaveBeenCalledWith("/login")

        cleanup();

        mockResponse.data.userInfo.roleName = "OTHER_ROLE"
        handleResponse(mockNavigate, mockResponse);
        expect(mockNavigate).toHaveBeenCalledWith("/login")
      })
})

describe('handleError', () => {
    let setErr;
  
    // On définit setErr comme mock avant chaque test
    beforeEach(() => {
      setErr = jest.fn();
    });
  
    test('setErr avec string quand data est string', () => {
      handleError({ response: { data: "Erreur simple" } }, setErr);
      expect(setErr).toHaveBeenCalledWith("Erreur simple");
    });
  
    test('setErr avec data.message si présent', () => {
      handleError({ response: { data: { message: "Message d’erreur" } } }, setErr);
      expect(setErr).toHaveBeenCalledWith("Message d’erreur");
    });
  
    test('setErr avec data.error si présent', () => {
      handleError({ response: { data: { error: "Erreur spécifique" } } },setErr);
      expect(setErr).toHaveBeenCalledWith("Erreur spécifique");
    });
  
    test('setErr avec message par défaut si data ne correspond à rien', () => {
      handleError({ response: { data: { autre: "pas d’erreur" } } },setErr);
      expect(setErr).toHaveBeenCalledWith("Une erreur inconnue est survenue.");
    });
  
    test('setErr avec message de serveur inaccessible sinon', () => {
      handleError({ },setErr);
      expect(setErr).toHaveBeenCalledWith("Impossible de contacter le serveur: undefined");
    });
  });

  
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn()
  }));

  describe("LoginSection", () => {
    const mockNavigate = jest.fn()
    beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(HandleLogin, "handleResponse").mockImplementation(() => {});
      
      encryptWithPublicKey.mockReturnValue("mock encrypt data");
    });
  
    const fillForm = async () => {
      const emailField = screen.getByPlaceholderText("Email");
      await userEvent.type(emailField, "test@example.com");
      expect(emailField).toHaveValue("test@example.com");
  
      const passwordField = screen.getByPlaceholderText("Mot de passe");
      await userEvent.type(passwordField, "Password123!");
      expect(passwordField).toHaveValue("Password123!");
  
      await userEvent.click(screen.getByRole("button", { name: /Connecter/i }));
    };
  
    test("should call handleResponse on submit", async () => {
        useLocation.mockReturnValue({
            state: { }
          });
        axios.post.mockResolvedValue({
            data: {
              token: "Mock token",
              userInfo: {
                roleName: "USER_ROLE"
              },
              expiresIn: "100s"
            }
          });
      render(
        <MemoryRouter>
          <LoginSection navigate={mockNavigate} />
        </MemoryRouter>
      );
  
      await fillForm();
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith("/userSpace")
      });
    });
    test("should render token error is submit without token", async () => {
        useLocation.mockReturnValue({
            state: { }
          });
        axios.post.mockResolvedValue({
            data: {
            token: null,
            userInfo: {
                roleName: "USER_ROLE"
            },
            expiresIn: "100s"
            }
        });
        render(
            <MemoryRouter>
              <LoginSection navigate={mockNavigate} />
            </MemoryRouter>
          );
      
          await fillForm();
      
          await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
            expect(screen.getByText("Token non reçu !")).toBeInTheDocument()
          });
    })
    test("should render an error is submit error", async () => {
        useLocation.mockReturnValue({
            state: {}
          });
        axios.post.mockRejectedValue(new Error("Submit error"));
        render(
            <MemoryRouter>
              <LoginSection navigate={mockNavigate} />
            </MemoryRouter>
          );
      
          await fillForm();
      
          await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
            expect(screen.getByText("Impossible de contacter le serveur: Submit error")).toBeInTheDocument()
          });
    });
    test("should render state error", async () => {
        useLocation.mockReturnValue({
            state: { error: "State error" }
          });
        render(
            <MemoryRouter>
              <LoginSection navigate={mockNavigate} />
            </MemoryRouter>
          );

          expect(screen.getByText("State error"))
    })
  });