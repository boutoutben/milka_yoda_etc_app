import { render, screen } from "@testing-library/react";
import MainBtn from "../../components/mainBtn";
import userEvent from "@testing-library/user-event";

describe("MainBtn", () => {
    test("should the button will be type submit", async () => {
        render(<MainBtn name={"test"} isSubmit={true} click={() => {}} />);
        const btn = await screen.getByRole("button", {name: "test"});
        expect(btn.getAttribute("type")).toBe('submit');
    })
    test("should the button will be type button", async () => {
        render(<MainBtn name={"test"} click={() => {}} />);
        const btn = await screen.getByRole("button", {name: "test"});
        expect(btn.getAttribute("type")).toBe('button');
    })
    test("handle click", async () => {
        const mockClick = jest.fn();
        render(<MainBtn name={"test"} click={mockClick} />);
        const btn = await screen.getByRole("button", {name: "test"});
        await userEvent.click(btn);
        expect(mockClick).toHaveBeenCalledTimes(1)
    })
})