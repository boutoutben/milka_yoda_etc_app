import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import EditElement from "../../components/editElement";

describe("DeleteElement", () => {
    test("handle onDelete click", async () => {
        const mockEdit = jest.fn();
        render(<EditElement onEdit={mockEdit} />);
        const editParaph = await screen.getByTestId("edit-paraph");
        await userEvent.click(editParaph);
        expect(mockEdit).toHaveBeenCalledTimes(1);
    })
})