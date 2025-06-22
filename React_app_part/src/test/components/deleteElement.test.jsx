import { render, screen } from "@testing-library/react";
import DeleteElement from "../../components/deleteElement";
import userEvent from '@testing-library/user-event';

describe("DeleteElement", () => {
    test("handle onDelete click", async () => {
        const mockDelete = jest.fn();
        render(<DeleteElement onDelete={mockDelete} />);
        const deleteParaph = await screen.getByTestId("delete-paraph");
        await userEvent.click(deleteParaph);
        expect(mockDelete).toHaveBeenCalledTimes(1);
    })
})