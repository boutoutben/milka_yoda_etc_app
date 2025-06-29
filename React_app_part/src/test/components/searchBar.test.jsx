import { fireEvent, render, screen } from "@testing-library/react";
import SearchBar from "../../components/searchBar";

describe('SearchBar', () => {
    test('should filter elements when search term changes', () => {
      const elements = [
        { name: 'Dog' },
        { name: 'Cat' },
        { name: 'Rabbit' },
      ];
      const mockSetFiltered = jest.fn();
      const mockSetSearchTerm = jest.fn();
  
      render(
        <SearchBar
          elements={elements}
          setFiltered={mockSetFiltered}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
          fieldName="name"
        />
      );
  
      const input = screen.getByPlaceholderText(/rechercher/i);
  
      // Simule la saisie utilisateur
      fireEvent.change(input, { target: { value: 'dog' } });
  
      expect(mockSetSearchTerm).toHaveBeenCalledWith('dog');
    });
  
    test('should render input and search icon', () => {
      const elements = [];
      const mockSetFiltered = jest.fn();
      const mockSetSearchTerm = jest.fn();
  
      render(
        <SearchBar
          elements={elements}
          setFiltered={mockSetFiltered}
          searchTerm=""
          setSearchTerm={mockSetSearchTerm}
          fieldName="name"
        />
      );
  
      expect(screen.getByPlaceholderText(/rechercher/i)).toBeInTheDocument();
      expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    });
  });