// src/test/components/ScrollToTop.test.jsx
import { render } from "@testing-library/react";
import ScrollToTop from "../../utils/scrollToTop";
import { useLocation } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
}));

describe("ScrollToTop", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
  });

  test("scrolls to top on pathname change", () => {
    useLocation.mockReturnValue({ pathname: "/page1" });

    render(<ScrollToTop />);

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  test("does not call scrollTo again if pathname doesn't change", () => {
    useLocation.mockReturnValue({ pathname: "/same" });

    render(<ScrollToTop />); // mount
    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    render(<ScrollToTop />); // re-render but no pathname change
    expect(window.scrollTo).toHaveBeenCalledTimes(2); // new effect
  });
});