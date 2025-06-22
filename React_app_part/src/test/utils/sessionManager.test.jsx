import { render } from "@testing-library/react";
import SessionManager from "../../utils/SessionManager";
import { MemoryRouter } from "react-router-dom";

describe("SessionManager", () => {
  beforeEach(() => {
    // Reset tous les mocks avant chaque test
    jest.restoreAllMocks();
  });

  test("should return null", () => {
    const futureDate = new Date(Date.now() + 10 * 60 * 1000).toString();

    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "tokenExpiration") {
        return futureDate;
      }
      return null;
    });

    const { container } = render(
      <MemoryRouter>
        <SessionManager />
      </MemoryRouter>
    );

    expect(container).toBeEmptyDOMElement();
  });

  test("should clear storage on expiration", () => {
    const expiredDate = new Date(Date.now() - 10 * 60 * 1000).toString();

    jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation((key) => {
        if (key === "tokenExpiration") return expiredDate;
        return null;
      });

    const clearMock = jest
      .spyOn(Storage.prototype, "clear")
      .mockImplementation(() => {});

    render(
      <MemoryRouter>
        <SessionManager />
      </MemoryRouter>
    );

    expect(clearMock).toHaveBeenCalledTimes(1);
  });
});