import { fireEvent, render, screen } from "@testing-library/react";
import isGranted from "../../utils/isGranted";
import AppSection from "../../components/AppSection";

jest.mock("../../utils/isGranted", () => ({
    __esModule: true,
    default: jest.fn(),
}))

const attributes = { 'data-testid': 'drag-handle' };
const listeners = { onMouseDown: jest.fn() };

describe("AppSection", () => {
    test("render for admin", () => {
        isGranted.mockReturnValue(true);
        const mockEdit = jest.fn();
        const mockDelete = jest.fn();

        render(<AppSection id={"test"} title={"test"} click={() => {}} nameBtn={"make test"} editAndSup={true} onEdit={mockEdit} onDelete={mockDelete} listeners={listeners} attributes={attributes} />);
        const attriAndListSpan = document.querySelector("span.attriAndList");
        expect(attriAndListSpan).not.toBeNull()
        expect(screen.getByText('modifier')).toBeInTheDocument();
        expect(screen.getByText("supprimer")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /make test/i })).toBeInTheDocument();

    fireEvent.click(screen.getByText('modifier'));
    fireEvent.click(screen.getByText('supprimer'));
    expect(mockEdit).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalled();
    })
    test("render for no admin", () => {
        isGranted.mockReturnValue(false);
        render(<AppSection nameBtn={"make test"} click={() => {}} editAndSup={true} listeners={listeners} attributes={attributes} />);
        const attriAndListSpan = document.querySelector("span.attriAndList");
        expect(attriAndListSpan).toBeNull()
        expect(screen.queryByText("modifier")).toBeNull();
        expect(screen.queryByText("supprimer")).toBeNull();
    })
    test("render without btn and without title", () => {
        render(<AppSection />);
        expect(screen.queryByTestId("mainBtn")).toBeNull();
        expect(document.querySelector("h2")).toBeNull();
    })
})