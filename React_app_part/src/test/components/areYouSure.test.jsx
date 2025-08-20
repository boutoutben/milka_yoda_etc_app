import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import AreYouSure from "../../components/areYouSure";

jest.mock("axios");

describe("AreYouSure", () => {
    const mockReload = jest.fn();
  const mockSetter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    axios.delete.mockResolvedValue({});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("handle yes click", async () => {
    render(<AreYouSure setter={mockSetter} apiUrl={"test"} onReload={mockReload} />);

    const yesBtn = await screen.findByRole("button", { name: "Oui" });
    await userEvent.click(yesBtn);

    expect(axios.delete).toHaveBeenCalledWith("http://localhost:5000/api/test", {
      withCredentials: true,
      "headers":  {
        "Authorization": "Bearer null",
      },
    });

    expect(mockReload).toHaveBeenCalled();
  });

  test("handle yes click error", async () => {
    axios.delete.mockRejectedValue(new Error("Mock error"));

    render(<AreYouSure setter={mockSetter} apiUrl={"test"} />);
    const yesBtn = await screen.findByRole("button", { name: "Oui" });
    await userEvent.click(yesBtn);

    expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi : Mock error",);
  });

  test("handle no click", async () => {
    render(<AreYouSure setter={mockSetter} apiUrl={"test"} />);
    const noBtn = await screen.findByRole("button", { name: "Non" });
    await userEvent.click(noBtn);
    expect(mockSetter).toHaveBeenCalled();
  });
});