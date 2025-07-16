import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { ActionSumary, AnimalToAdopt, ArrowSeeMore, BeingCarefullAboutAnimales, WelcomeImg, WelcomeToMilkaYodaEtc } from "../../handles/Welcome"
import userEvent from "@testing-library/user-event";
import { act } from "react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import getFetchApi from "../../utils/getFetchApi";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

jest.mock("../../utils/getFetchApi");

describe("WelcomeToMilkaYodaEtc", () => {
    test("should render the first slide", async () => {
        const { container } = render(<WelcomeToMilkaYodaEtc />);
        const slideActive = container.querySelector(".slide.active");
        const img = slideActive.querySelector("img");
        expect(img).toHaveAttribute("src", "img/WelcomeAsso1.JPG");
      });
      test("should render the second slide on right arrow click", async () => {
        const { container } = render(<WelcomeToMilkaYodaEtc />);
      
        const rightArrow = screen.getByTestId("rightArrow");
        await userEvent.click(rightArrow);
      
        const slideActive = container.querySelector(".slide.active");
        const img = slideActive.querySelector("img");
        expect(img).toHaveAttribute("src", "img/WelcomeAsso2.JPG");
      });
      
      test("should loop back to first slide after multiple right arrow clicks", async () => {
        const { container } = render(<WelcomeToMilkaYodaEtc />);
      
        const rightArrow = screen.getByTestId("rightArrow");
        for (let i = 0; i < 11; i++) {
          await userEvent.click(rightArrow);
        }
      
        const slideActive = container.querySelector(".slide.active");
        const img = slideActive.querySelector("img");
        expect(img).toHaveAttribute("src", "img/WelcomeAsso3.JPG");
      });

    test("should render the third shile on left arrow click", async () => {
        const { container } = render(<WelcomeToMilkaYodaEtc />);

        const rightArrow = screen.getByTestId("leftArrow")
        await userEvent.click(rightArrow)
        const slideActive = container.querySelector(".slide.active");
        const img = slideActive.querySelector("img");
        expect(img).toHaveAttribute("src", "img/WelcomeAsso3.JPG");
    })
    test("should loop back to second slide after multiple left arrow clicks", async () => {
        const { container } = render(<WelcomeToMilkaYodaEtc />);
      
        const rightArrow = screen.getByTestId("leftArrow");
        for (let i = 0; i < 11; i++) {
          await userEvent.click(rightArrow);
        }
      
        const slideActive = container.querySelector(".slide.active");
        const img = slideActive.querySelector("img");
        expect(img).toHaveAttribute("src", "img/WelcomeAsso2.JPG");
      });

      test('should render the second slide after 5 seconds', () => {
        jest.useFakeTimers();
      
        const { container } = render(<WelcomeToMilkaYodaEtc />);
      
        // Fast-forward time by 5 seconds (1 interval)
        act(() => {
          jest.advanceTimersByTime(5000);
        });
      
        const slideActive = container.querySelector('.slide.active');
        const img = slideActive.querySelector('img');
        expect(img).toHaveAttribute('src', 'img/WelcomeAsso2.JPG');
      
        jest.useRealTimers();
      });
})

describe("WelcomeImg", () => {
    test('navigates on image click', async () => {
        const mockNavigate = jest.fn();
        useNavigate.mockReturnValue(mockNavigate);
      
        render(
          <MemoryRouter>
            <WelcomeImg src="test.jpg" alt="Test Image" redirection="/next-page" />
          </MemoryRouter>
        );
      
        const img = screen.getByAltText('Test Image');
        await userEvent.click(img);
      
        expect(mockNavigate).toHaveBeenCalledWith('/next-page');
      });
})

describe("ArrowSeeMore", () => {
    test("should redirect to the url when click", async () => {
        const mockNavigate = jest.fn()
        render(
            <MemoryRouter>
                <ArrowSeeMore redirection={"/test"} navigate={mockNavigate} />
            </MemoryRouter>
        )
        const arrowSeeMore = screen.getByTestId("arrowSeeMore");
        await userEvent.click(arrowSeeMore);
        expect(mockNavigate).toHaveBeenCalledWith("/test")
    })
})

describe("ActionSumary", () => {
    const mockAction = {
        actions:[
        {
            id: 1,
            imgName: "test1.jpg",
            pageUrl: "/page1"
        },
        {
            id:2,
            imgName: "test2.jpg",
            pageUrl: "/page2"
        }]
    }
    test("should render all action", async () => {
        getFetchApi.mockResolvedValue(mockAction)
        render(<ActionSumary />);
        await waitFor(() => {
            const allActions = screen.getAllByTestId("welcomeImg");
            expect(allActions).toHaveLength(2);
            mockAction.actions.forEach((action, index) => {
                const actionImg = allActions[index].querySelector("img");
                expect(actionImg).toHaveAttribute("src", `http://localhost:5000/uploads/test${index+1}.jpg`)
            })  
        })
    })
    test("should return an error when server error", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        render(<ActionSumary />)
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error");
            const allActions = screen.queryAllByTestId("welcomeImg");
            expect(allActions).toHaveLength(0);
        })
    })
})

describe("AnimalToAdopt", () => {
    const mockAnimals = {
        animals: [
            {
                id: 1,
                imgName: "test.jpg",
                name: "test1",
                sexe: 1,
            },
            {
                id: 2,
                imgName: "test.jpg",
                name: "test1",
                sexe: 1,
            }
        ]
    }
    test("should render all animals", async () => {
        getFetchApi.mockResolvedValue(mockAnimals);
        render(<AnimalToAdopt />);
        await waitFor(() => {
            const allAnimals = screen.getAllByTestId("presentationAnimal");
            expect(allAnimals).toHaveLength(2)
        })
    })

    test("should return an error when server error", async () => {
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        jest.spyOn(console, "error").mockImplementation(() => {});
        render(<AnimalToAdopt />);
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error")
            const allAnimals = screen.queryAllByTestId("presentationAnimal");
            expect(allAnimals).toHaveLength(0);
        })
    })
})

describe("BeingCarefullAbhoutAnimales", () => {
    const mockArticles = {
        articles: [
            {
                id: 1,
                imgName: "test.jpg",
                title: "test's title"
            },
            {
                id: 2,
                imgName: "test.jpg",
                title: "test's title"
            }
        ]
    }
    const mockNavigate = jest.fn()
    test("should render all article", async () => {
        getFetchApi.mockResolvedValue(mockArticles);
        render(<BeingCarefullAboutAnimales redirection={'/test'} navigate={jest.fn()} />)
        await waitFor(() => {
            const allArticles = screen.getAllByTestId("article");
            expect(allArticles).toHaveLength(2)
            mockArticles.articles.forEach((article, index) => {
                expect(allArticles[index]).toBeInTheDocument();
            
                const img = screen.getByTestId(`articleImg-${article.id}`);
                expect(img).toHaveAttribute('src', `http://localhost:5000/uploads/${article.imgName}`);
            });
        })  
    })
    test("should redirect to article details on article click", async () => {
        getFetchApi.mockResolvedValue(mockArticles);
        render(<BeingCarefullAboutAnimales redirection={'/test'} navigate={mockNavigate} />)
        await waitFor(() => {
            const allArticles = screen.getAllByTestId("article");
            expect(allArticles).toHaveLength(2);
        })
        const allArticles = screen.getAllByTestId("article");
        await userEvent.click(allArticles[0]);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/article/1")
        })
    })
    test("should redirect to all articles on plus btn click", async () => {
        getFetchApi.mockResolvedValue(mockArticles);
        render(<BeingCarefullAboutAnimales redirection={'/test'} navigate={mockNavigate} />)
        await waitFor(() => {
            const allArticles = screen.getAllByTestId("article");
            expect(allArticles).toHaveLength(2);
        })
        await userEvent.click(screen.getByRole("button", {name: "Voir plus"}));
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/test")
        })
    })
    test("should return an error when server error", async () => {
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        jest.spyOn(console, "error").mockImplementation(() => {});
        render(<BeingCarefullAboutAnimales redirection={'/test'} navigate={jest.fn()} />)
        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error")
            const allArticles = screen.queryAllByTestId("article");
            expect(allArticles).toHaveLength(0)
        })  
    })
})