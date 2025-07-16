import { render, renderHook, screen, waitFor } from "@testing-library/react"
import { ApprouvedBtn, handleAcceptClick, handleRefuseClick, RenderAlertBox, useFetchData } from "../../handles/ApprouvedAdoption"
import emailjs from '@emailjs/browser';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import getFetchApi from "../../utils/getFetchApi";

jest.mock("@emailjs/browser");
jest.mock("axios");

jest.mock("../../utils/getFetchApi");

jest.mock('../../utils/getEnvVars', () => ({
    __esModule: true,
    default: () => ({
      GMAIL_SERVICE_ID: 'test',
      GMAIL_AUTO_REPLY_MODELE_ID: 'test',
      GMAILJS_PUBLIC_KEY: 'test',
    }),
  }));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: () => ({ id: '123' }),
  }));

describe("handleRefuseClick", () => {
    const mockNavigate = jest.fn()
    const mockData = {
        animal: {
            name: "test"
        },
        values: {
            id: 1,
            firstname: "Bob",
            email: "test@example.com"
        }
    }
    beforeEach(() => {
        jest.clearAllMocks();
        axios.delete.mockResolvedValue();
        emailjs.send.mockResolvedValue();
        useNavigate.mockReturnValue(mockNavigate);
        jest.spyOn(console, "error").mockImplementation(() => {})
    })
    const mockSetAlert = jest.fn();
    test("should send the email, refuse the adoption and navigate to adminSpace after 3s", async () => {
        //navigate after 3s 
        handleRefuseClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalled()    
        })
        expect(mockSetAlert).toHaveBeenCalledWith("Adoption refusée");
        setTimeout(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/adminSpace")
        }, 3000)

        //no navigate after 2s
        handleRefuseClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalled()    
        })
        expect(mockSetAlert).toHaveBeenCalledWith("Adoption refusée");
        setTimeout(() => {
            expect(mockNavigate).not.toHaveBeenCalled()
        }, 2000)
    });
    test("should fail when the email fail to send", async () => {
        emailjs.send.mockRejectedValue(new Error("Email fail to send"));
        handleRefuseClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalled()    
        })
        expect(mockSetAlert).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi de l'email:", "Email fail to send");
    });
    test("should fail when axios delete error", async () => {
        axios.delete.mockRejectedValue(new Error("Mock error"));
        handleRefuseClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi:", "Mock error");   
        });
        expect(emailjs.send).not.toHaveBeenCalled() 
    })
})

describe("handleAcceptClick", () => {
    const mockNavigate = jest.fn()
    const mockData = {
        animal: {
            name: "test"
        },
        values: {
            id: 1,
            firstname: "Bob",
            email: "test@example.com"
        }
    }
    beforeEach(() => {
        jest.clearAllMocks();
        axios.patch.mockResolvedValue();
        emailjs.send.mockResolvedValue();
        useNavigate.mockReturnValue(mockNavigate);
        jest.spyOn(console, "error").mockImplementation(() => {})
    })
    const mockSetAlert = jest.fn();
    test("should send the email, accept the adoption and navigate to adminSpace ", async () => {
        handleAcceptClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalled()
        })
        expect(mockSetAlert).toHaveBeenCalledWith("Adoption acceptée");
        setTimeout(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/adminSpace")
        }, 3000);

        handleAcceptClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalled()
        })
        expect(mockSetAlert).toHaveBeenCalledWith("Adoption acceptée");
        setTimeout(() => {
            expect(mockNavigate).not.toHaveBeenCalledWith("/adminSpace")
        }, 2000);
    });
    test("should fail when the email fait to send", async () => {
        emailjs.send.mockRejectedValue(new Error("Email fail to send"));
        handleAcceptClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(emailjs.send).toHaveBeenCalled()    
        })
        expect(mockSetAlert).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi de l'email:", "Email fail to send");
    });
    test("should fail when axios delete error", async () => {
        axios.delete.mockRejectedValue(new Error("Mock error"));
        handleRefuseClick(mockData, mockSetAlert, mockNavigate);
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi:", "Mock error");   
        });
        expect(emailjs.send).not.toHaveBeenCalled() 
    })
});

describe("ApprouvedBtn", () => {
    const mockNavigate = jest.fn()
    const mockData = {
        animal: {
            name: "test"
        },
        values: {
            id: 1,
            firstname: "Bob",
            email: "test@example.com"
        }
    }

    const mockSetAlert = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        axios.delete.mockResolvedValue();
        emailjs.send.mockResolvedValue();
        useNavigate.mockReturnValue(mockNavigate);
        jest.spyOn(console, "error").mockImplementation(() => {})
    })
    test("should refuse the adoption on refuse click", async () => {
        render(<ApprouvedBtn data={mockData} setAlert={mockSetAlert} />)
        await userEvent.click(screen.getByText("Refuser"));
        await waitFor(() => {
            expect(mockSetAlert).toHaveBeenCalledWith("Adoption refusée")
        })
    })
    test("should accept the adoption on accept click", async () => {
        render(<ApprouvedBtn data={mockData} setAlert={mockSetAlert} />)
        await userEvent.click(screen.getByText("Accepter"));
        await waitFor(() => {
            expect(mockSetAlert).toHaveBeenCalled()
        })
    })
})

describe("useFetchData", () => {
    test("should return the data", async () => {
        const mockData = [{id: 1}]
        getFetchApi.mockResolvedValue(mockData);
        const { result } = renderHook(() => useFetchData(1));

        await waitFor(() => {
            expect(result.current).toEqual(mockData);
        });
    })
    test("should return null and the error", async () => {
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        const { result } = renderHook(() => useFetchData(1));

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Erreur lors de la recherche:", "Mock error")
        });
        expect(result.current).toEqual(null);
    })
})

describe("RenderAlertBox", () => {
    const mockSetAlert = jest.fn();
    test("should render alertBox is alert is not null", async () => {
        render(<RenderAlertBox alert={"fake alex"} setAlert={mockSetAlert} />)
        expect(document.querySelector(".alertBox")).toBeInTheDocument();
    })
    test("should not render alertBox is alert is  null", async () => {
        render(<RenderAlertBox alert={null} setAlert={mockSetAlert} />)
        expect(document.querySelector(".alertBox")).not.toBeInTheDocument();
    })
})