import { render, renderHook, screen, waitFor } from "@testing-library/react";
import getFetchApi from "../../utils/getFetchApi"
import { StateMessage, useFetchMediator } from "../../handles/MediatorAnimales";
import { useLocation } from "react-router-dom";

jest.mock("../../utils/getFetchApi")

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn()
  }));


describe("useFetchMediator", () => {
    test("should return the animals", async () => {
      const mockAnimals = [{ id: 1 }, { id: 2 }];
      getFetchApi.mockResolvedValue(mockAnimals);
  
      const { result } = renderHook(() => useFetchMediator());
  
      await waitFor(() => {
        expect(result.current).toEqual(mockAnimals);
      });
    });
    test("should fails and return an error", async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
        getFetchApi.mockRejectedValue(new Error("Mock error"));
        const { result } = renderHook(() => useFetchMediator());
        
      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error")
        expect(result.current).toEqual(null);
      });
    })
  });
  
  describe("StateMessage", () => {
   
    test("should render the error is state error", async () => {
        useLocation.mockReturnValue({
            state: {message: "mock error"}
          });

        render(<StateMessage />)
        expect(screen.getByText("mock error")).toBeInTheDocument();
    })
    test("should no render the error is no state error", async () => {
        useLocation.mockReturnValue({
            state: {}
          });

        render(<StateMessage />)
        expect(screen.queryByText("mock error")).not.toBeInTheDocument();
    })
  })