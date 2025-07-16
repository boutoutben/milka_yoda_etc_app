import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import axios from "axios";
import { AddArticle, Article, EditArticle } from "../../handles/Article";
import { useNavigate } from "react-router-dom";

jest.mock("axios");
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

const formFill = async (btnName) => {
    const titleInput = await screen.findByPlaceholderText("Titre");
      await userEvent.type(titleInput, "Title's test");
  
      const descriptionInput = await screen.findByPlaceholderText(
        "Description");
      await userEvent.type(descriptionInput, "Description of the test who argument the article");
  
      const file = new File(["dummy content"], "photo.png", { type: "image/png" });
      await userEvent.upload(screen.getByTestId("mock-file-select-btn"), file);
  
      await userEvent.click(screen.getByRole("button", { name: btnName }));
}

describe("EditArticle", () => {
    const mockReload = jest.fn();
    const mockOnEdit = jest.fn();
      const article = {
        title: "test",
        description: "Description of the test who argument the article initial",
        file: '',
      };

    beforeEach(() => {
        jest.clearAllMocks()
    })
    test("should submit and navigate", async () => {
      axios.patch.mockResolvedValue();
      render(<EditArticle onEdit={mockOnEdit} article={article} onReload={mockReload} />);
      await formFill("Mettre à jour");
      
      await waitFor(() => {
        expect(axios.patch).toHaveBeenCalled();
      });
      expect(mockReload).toHaveBeenCalled();
    });
    test("should submit and return an axios error", async () => {
        axios.patch.mockRejectedValue(new Error("Mock error"));
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
        render(<EditArticle onEdit={mockOnEdit} article={article} onReload={mockReload} />);
        await formFill("Mettre à jour"); 
    
        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalled();
        });
        expect(mockReload).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Erreur lors de l'envoi :", "Mock error");
    });
  });

  describe("Article", () => {
    test("The click should work", async () => {
        const mockClick = jest.fn();
        render(<Article title={"test"} text={"test's test"} src={"/test.jpg"} alt={"fake alt"} click={mockClick} />);
        await userEvent.click(screen.getByTestId("article"));
        expect(mockClick).toHaveBeenCalled();
    })
  })

  describe("AddArticle", () => {
    const mockNavigate = jest.fn();
    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        jest.clearAllMocks();
    })
    test("should submit and navigate to the article created", async () => {
        axios.post.mockResolvedValue({data: {id:1}});
        render(<AddArticle setAdd={jest.fn()}/>);
        await formFill("Créer")
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled()
        })
        expect(mockNavigate).toHaveBeenCalledWith("/writeArticle/1")
    })
    test("should submit and return an axios error", async () => {
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        axios.post.mockRejectedValue(new Error("Mock error")); 
        
        render(<AddArticle setAdd={jest.fn()} />);
        await formFill("Créer"); 
        
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
        });
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(consoleErrorSpy).toHaveBeenCalledWith("Erreur lors de l'envoi :", "Mock error");
    });
  })