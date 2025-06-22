import { render, screen } from "@testing-library/react"
import CustomSelect from "../../components/customSelect"
import userEvent from "@testing-library/user-event";

describe("CustomSelect", () => {
    const fakeData = [
       {_id:1, name:"test1"},
       {_id:2, name:"test2"} 
    ];
    const mockSetFieldValue = jest.fn();
    const mockFormik = { setFieldValue: mockSetFieldValue, values:{
        test: []
    } };
    const mockSelectValues = mockFormik.values.test
    test("should opens the select", async () => {
        render(<CustomSelect data={fakeData} formik={mockFormik} name={"test"} selectValues={mockSelectValues} />)
        await userEvent.click(screen.getByTestId('test-select'));
        const customSelectOptions = screen.getAllByTestId("custom-select-option");
        expect(customSelectOptions.length).toBe(2)
    });
    test("should select the option on click", async () => {
        render(<CustomSelect data={fakeData} formik={mockFormik} name={"test"} selectValues={mockSelectValues} />)
        await userEvent.click(screen.getByTestId('test-select'));
        await userEvent.click(screen.getByTestId("test-1"));
        await userEvent.click(screen.getByTestId("test-2"));
        expect(mockSetFieldValue).toHaveBeenCalledWith("test", ["1"]);
        expect(mockSetFieldValue).toHaveBeenCalledWith("test", ["2"]);
        expect(mockSetFieldValue).not.toHaveBeenCalledWith("test", ["3"])
    })
    test("should search the term", async () => {
        render(
          <CustomSelect
            data={fakeData}
            formik={mockFormik}
            name={"test"}
            selectValues={mockSelectValues}
            searchBar={true}
          />
        );
      
        await userEvent.click(screen.getByTestId('test-select'));
      
        const selectSearchBar = await screen.findByTestId("select-search-bar");
        await userEvent.type(selectSearchBar, "test2");
      
        // Tu peux aussi vérifier que seule "test2" est visible
        const options = screen.getAllByTestId("custom-select-option");
        expect(options.length).toBe(1);
        expect(options[0]).toHaveTextContent("test2");
      });
})