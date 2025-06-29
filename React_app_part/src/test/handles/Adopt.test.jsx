import { render, renderHook, screen, waitFor } from "@testing-library/react"
import { ChoiceField, Filter, SearchBottom, useAdoptAnimals } from "../../handles/Adopt"
import axios from "axios";
import userEvent from "@testing-library/user-event";
import getFetchApi from "../../utils/getFetchApi";

jest.mock("axios");

describe('ChoiceField', () => {
    test('should call API and set filtered animals on submit', async () => {
        const mockSetFilteredAnimals = jest.fn();
        const filteredAnimals = [{ id: 1, name: 'Dog' }];
        const mockResponseData = [{ id: 2, name: 'Puppy' }];
    
        axios.post.mockResolvedValueOnce({ data: mockResponseData });
    
        render(<ChoiceField filteredAnimals={filteredAnimals} setFilteredAnimals={mockSetFilteredAnimals} />);
  
      // Simulate click on the submit button
      await userEvent.click(screen.getByRole('button', { name: /filtrer/i }));
  
      await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/filter',
          { values: expect.any(Object), filteredAnimals }
        );
      
        expect(mockSetFilteredAnimals).toHaveBeenCalledWith(mockResponseData);
      });
    });
    test("should fail when API error", async () => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        
        axios.post.mockRejectedValue(new Error("Mock error"));
      
        const mockSetFilteredAnimals = jest.fn();
        const filteredAnimals = [{ id: 1, name: 'Dog' }];
      
        render(
          <ChoiceField
            filteredAnimals={filteredAnimals}
            setFilteredAnimals={mockSetFilteredAnimals}
          />
        );
      
        await userEvent.click(screen.getByRole('button', { name: /filtrer/i }));
      
        await waitFor(() => {
          expect(axios.post).toHaveBeenCalledWith(
            'http://localhost:5000/api/filter',
            { values: expect.any(Object), filteredAnimals }
          );
        });
      
        expect(console.error).toHaveBeenCalledWith("Erreur serveur:", "Mock error");
      });
  });

  describe('Filter component', () => {
    test('should show correct class when filter is true', () => {
      render(
        <Filter
          filter={true}
          setFilter={jest.fn()}
          filteredAnimals={[]}
          setFilteredAnimals={jest.fn()}
        />
      );
  
      const aside = screen.getByRole('complementary'); // <aside> defaults to 'complementary' landmark
      expect(aside.className).toContain('showFilter');
    });
  
    test('should not have showFilter class when filter is false', () => {
      render(
        <Filter
          filter={false}
          setFilter={jest.fn()}
          filteredAnimals={[]}
          setFilteredAnimals={jest.fn()}
        />
      );
  
      const aside = screen.getByRole('complementary');
      expect(aside.className).not.toContain('showFilter');
    });
  
    test('should call setFilter(false) when close button clicked', async () => {
      const mockSetFilter = jest.fn();
  
      render(
        <Filter
          filter={true}
          setFilter={mockSetFilter}
          filteredAnimals={[]}
          setFilteredAnimals={jest.fn()}
        />
      );
  
      await userEvent.click(screen.getByTestId('close-button'));
      expect(mockSetFilter).toHaveBeenCalledWith(false);
    });
  
    
  });
  
  describe('SearchBottom', () => {
    test('should render SearchBar', () => {
      render(
        <SearchBottom
          filter={false}
          setFiltered={jest.fn()}
          setSearchTerm={jest.fn()}
          count={5}
          searchTerm=""
          elements={[]}
        />
      );
  
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });
  
    test('should display correct result count', () => {
      render(
        <SearchBottom
          filter={false}
          setFiltered={jest.fn()}
          setSearchTerm={jest.fn()}
          count={3}
          searchTerm=""
          elements={[]}
        />
      );
  
      expect(screen.getByText(/3 résultat/i)).toBeInTheDocument();
    });
  
    test('should toggle filter when filter button clicked', async () => {
      const mockSetFilter = jest.fn();
      render(
        <SearchBottom
          filter={false}
          setFilter={mockSetFilter}
          setFiltered={jest.fn()}
          setSearchTerm={jest.fn()}
          count={0}
          searchTerm=""
          elements={[]}
        />
      );
  
      await userEvent.click(screen.getByRole('heading', { name: /filtre/i }));
      expect(mockSetFilter).toHaveBeenCalledWith(true);
    });
  });

  jest.mock('../../utils/getFetchApi');

describe('useAdoptAnimals', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch animals and update states on success', async () => {
    const mockAnimals = [{ id: 1, name: 'Dog' }, { id: 2, name: 'Cat' }];
    getFetchApi.mockResolvedValue({ animals: mockAnimals });

    const mockSetAnimals = jest.fn();
    const mockSetFilteredAnimals = jest.fn();

    renderHook(() => useAdoptAnimals(mockSetAnimals, mockSetFilteredAnimals));

    // Attendre la résolution de la promesse
    await Promise.resolve();

    expect(getFetchApi).toHaveBeenCalledWith('adopt');
    expect(mockSetAnimals).toHaveBeenCalledWith(mockAnimals);
    expect(mockSetFilteredAnimals).toHaveBeenCalledWith(mockAnimals);
  });

  test('should log error when API fails', async () => {
    const mockError = new Error('API Failed');
    getFetchApi.mockRejectedValue(mockError);
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const mockSetAnimals = jest.fn();
    const mockSetFilteredAnimals = jest.fn();
  
    renderHook(() => useAdoptAnimals(mockSetAnimals, mockSetFilteredAnimals));
  
    await waitFor(() => {
      expect(getFetchApi).toHaveBeenCalledWith('adopt');
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  
    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
  
    consoleErrorSpy.mockRestore();
  });
});