import { fireEvent, render, screen } from "@testing-library/react"
import { MemoryRouter, useNavigate } from 'react-router-dom';
import AllAnimales  from "../../components/allAnimales"

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn();
useNavigate.mockImplementation(() => mockNavigate);

describe("AllAnimales", () => {
    const fakeAnimalData = [
        {id: 1, name: "test1", imgName: "test1.jpg", born: "2024-05-25", isMale: true},
        {id: 2, name: "test2", imgName: "test2.jpg", born: "2024-05-27", isMale: false},
    ]
    test("render all the animal and the right className", () => {
        render(
            <MemoryRouter>
              <AllAnimales animalData={fakeAnimalData} className="classTest" />
            </MemoryRouter>
          );
        const allPresentationAnimals = screen.getAllByTestId("presentationAnimal");
        const elementWithClassTest= document.querySelector('.classTest');
        expect(allPresentationAnimals.length).toBe(2);
        expect(allPresentationAnimals[0]).toHaveTextContent('test1');
        expect(allPresentationAnimals[1]).toHaveTextContent('test2');
        expect(elementWithClassTest).not.toBeNull(); 
    });
    test("handleClik should work", () => {
        render(
            <MemoryRouter>
              <AllAnimales animalData={fakeAnimalData} className="classTest" root="/animal/" />
            </MemoryRouter>
          );
        const allPresentationAnimals = screen.getAllByTestId("presentationAnimal");
        fireEvent.click(allPresentationAnimals[0]);
        expect(mockNavigate).toHaveBeenCalledWith("/animal/1")
    })
})