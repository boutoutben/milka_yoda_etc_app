import { render, screen } from "@testing-library/react"
import PresentationAnimal from "../../components/presentationAnimal"
import uploadsImgUrl from "../../utils/uploadsImgUrl";
import userEvent from "@testing-library/user-event";

jest.mock("../../utils/uploadsImgUrl", () => ({
    __esModule: true,
    default: jest.fn(),
}));


describe("PresentationAnimal", () => {
    test("should render the common field for male and is waiting", () => {
        render(<PresentationAnimal img={"test.jpg"} name="test" age="5" isMale={true} isWaiting={true} />);
        const waitingImg = document.querySelector("img.waiting");
        expect(waitingImg).toBeInTheDocument();
        expect(uploadsImgUrl).toHaveBeenCalledTimes(1);
        expect(uploadsImgUrl).toHaveBeenCalledWith("test.jpg")
        expect(screen.getByText("test")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByTestId("sexe-img").getAttribute("src")).toBe("img/animalMale.png");
    })
    test("should render img for female and is not waiting", () => {
        render(<PresentationAnimal img={"test.jpg"} name="test" age="5" isMale={false} isWaiting={false} />);
        const waitingImg = document.querySelector("img.waiting");
        expect(waitingImg).not.toBeInTheDocument();
        expect(screen.getByTestId("sexe-img").getAttribute("src")).toBe("img/animalFemale.png");
    })
    test("should handle click with sucess", async () => {
        const mockClick = jest.fn();
        render(<PresentationAnimal img={"test.jpg"} name="test" age="5" isMale={true} isWaiting={true} handleClick={mockClick} />);
        const animalPresentation = screen.getByTestId("presentationAnimal");
        await userEvent.click(animalPresentation);
        expect(mockClick).toHaveBeenCalledTimes(1);
    })
})