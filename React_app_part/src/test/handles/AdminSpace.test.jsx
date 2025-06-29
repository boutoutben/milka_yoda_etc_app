import { render, screen, waitFor } from "@testing-library/react"
import { AskForAdoption, BanUser, UserPresentation } from "../../handles/AdminSpace"
import { MemoryRouter } from "react-router-dom"
import getFetchApi from "../../utils/getFetchApi";
import userEvent from "@testing-library/user-event";
import axios from "axios";

const mockNavigate = jest.fn();

jest.mock("axios"); 

jest.mock('../../utils/getFetchApi');

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('AskForAdoption', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() =>{})
    })

    test('All should work correctly with an ask', async () => {
        getFetchApi.mockResolvedValue([
            {
                id: 1,
                imgName: "test.jpg",
                name: "test",
                born: "2023-06-01",
                isMale: true,
                isApprouved: false
            }
        ]);

        render(
            <MemoryRouter>
                <AskForAdoption />
            </MemoryRouter>
        );

        // Attendre que l'animal soit bien rendu dans le DOM
        await waitFor(() => {
            expect(screen.getByTestId('askForAdopt')).toBeInTheDocument();
        });

        // Simuler le clic
        await userEvent.click(screen.getByTestId('presentationAnimal'));

        // Vérifier que navigate a été appelé avec le bon id
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/adopterApprouved/1');
        });
    });

    test("All should work correctly without ask", async () => {
        getFetchApi.mockResolvedValue([]);
        render(
            <MemoryRouter>
                <AskForAdoption />
            </MemoryRouter>
        );

        // Attendre que l'animal soit bien rendu dans le DOM
        await waitFor(() => {
            expect(screen.getByTestId('askForAdopt')).toBeInTheDocument();
        });
        expect(screen.getByText("Il n'y a pas de demande")).toBeInTheDocument();
    })
    test("should fail when error 403", async () => {
        getFetchApi.mockRejectedValue({ status: 403 });
        render(
            <MemoryRouter>
                <AskForAdoption />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login", {
                state: { error: "Vous n'êtes pas ou plus authorisée" }
            });
        });
    });

    test("should fail when other error", async () => {
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        render(
            <MemoryRouter>
                <AskForAdoption />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Unexpected error: ", "Mock error")
        })

    })
});

describe("user presentation", () => {
    test("should ban when click on suspend icon", async () => {
        const user = {
            id: 1,
            lastname: "Dupond",
            firstname: "Bob",
            isBlock: false
        }
        axios.patch.mockResolvedValue({})
        render(
            <MemoryRouter>
                <UserPresentation user={user}/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(document.querySelector(".userPresentation")).toBeInTheDocument()
        })
        await userEvent.click(screen.getByTestId("banUser"));
        expect(screen.getByTestId("banUser")).toHaveClass("ban");   
    })
    test("should have the class ban if the isBLock is true", async () => {
        const user = {
            id: 1,
            lastname: "Dupond",
            firstname: "Bob",
            isBlock: true
        }
        axios.patch.mockResolvedValue({})
        render(
            <MemoryRouter>
                <UserPresentation user={user}/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(document.querySelector(".userPresentation")).toBeInTheDocument()
        })
        expect(screen.getByTestId("banUser")).toHaveClass("ban");   
    })

    test("should not have the class ban if the isBLock is false", async () => {
        const user = {
            id: 1,
            lastname: "Dupond",
            firstname: "Bob",
            isBlock: false
        }
        axios.patch.mockResolvedValue({})
        render(
            <MemoryRouter>
                <UserPresentation user={user}/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(document.querySelector(".userPresentation")).toBeInTheDocument()
        })
        expect(screen.getByTestId("banUser")).not.toHaveClass("ban");   
    })

    test("should disban if click on the ban icon while the user is ban", async () => {
        const user = {
            id: 1,
            lastname: "Dupond",
            firstname: "Bob",
            isBlock: true
        }
        axios.patch.mockResolvedValue({})
        render(
            <MemoryRouter>
                <UserPresentation user={user}/>
            </MemoryRouter>
        )

        await waitFor(() => {
            expect(document.querySelector(".userPresentation")).toBeInTheDocument()
        })
        await userEvent.click(screen.getByTestId("banUser"));
        expect(screen.getByTestId("banUser")).not.toHaveClass("ban");   
    })

    test("should fail when error 403", async () => {
        axios.patch.mockRejectedValue({ status: 403 });
        const user = {
            id: 1,
            lastname: "Doe",
            firstname: "John",
            email: "john.doe@example.com",
            isBlock: false,
        };

        render(
            <MemoryRouter>
                <UserPresentation user={user} />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(document.querySelector(".userPresentation")).toBeInTheDocument()
        })
        await userEvent.click(screen.getByTestId("banUser"));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login", {
                state: { error: "Vous n'êtes pas ou plus authorisée" }
            });
        });
    });

    test("should fail when other error", async () => {
        axios.patch.mockRejectedValue(new Error("Mock error"));
        const user = {
            id: 1,
            lastname: "Doe",
            firstname: "John",
            email: "john.doe@example.com",
            isBlock: false,
        };

        render(
            <MemoryRouter>
                <UserPresentation user={user} />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Unexpected error: ", "Mock error")
        })
    })   
})

describe("BanUser", () => {
    test("should render only the first 3 users", async () => {
        getFetchApi.mockResolvedValue({
            users: [
                { id: 1, email: "user1@example.com", isBlock: false },
                { id: 2, email: "user2@example.com", isBlock: false },
                { id: 3, email: "user3@example.com", isBlock: false },
                { id: 4, email: "user4@example.com", isBlock: false }
            ]
        });

        render(
            <MemoryRouter>
                <BanUser />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId("UserBan")).toBeInTheDocument();
        });

        const usersRendered = document.querySelectorAll(".userPresentation");
        expect(usersRendered.length).toBe(3);
    });

    test("should fail when error 403", async () => {
        getFetchApi.mockResolvedValue([
            {
                id: 1,
                imgName: "test.jpg",
                name: "test",
                born: "2023-06-01",
                isMale: true,
                isApprouved: false
            }
        ]);

        render(
            <MemoryRouter>
                <BanUser />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login", {
                state: { error: "Vous n'êtes pas ou plus authorisée" }
            });
        });
    });

    test("should fail when other error", async () => {
        getFetchApi.mockRejectedValue(new Error("Mock error"));

        render(
            <MemoryRouter>
                <BanUser />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Unexpected error: ", "Mock error")
        })
    }) 

})