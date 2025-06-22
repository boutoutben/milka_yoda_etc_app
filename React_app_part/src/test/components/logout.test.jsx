import { render, screen } from "@testing-library/react"
import Logout from "../../components/logout"
import userEvent from "@testing-library/user-event"
import { useNavigate } from "react-router-dom";

// Mock du useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

describe("Logout", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Remplace useNavigate par un mock
    useNavigate.mockReturnValue(mockNavigate);

    // Mock de localStorage.clear
    Object.defineProperty(window, "localStorage", {
      value: {
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  test("should logout", async () => {
    render(<Logout message="test" />);
    const logoutIcon = await screen.findByTestId("logout-icon");
    await userEvent.click(logoutIcon);

    expect(localStorage.clear).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
  test("the message should show the message", async () => {
    render(<Logout message="test" />);
    const heading = screen.getByRole("heading", { level: 1, name: /test/i });
    expect(heading).toBeInTheDocument();
  })
});