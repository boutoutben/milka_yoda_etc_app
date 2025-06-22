import { fireEvent, render, screen } from "@testing-library/react"
import PersonnelInfo from "../../components/personnelInfo"

describe("Personnel info", () => {
    let mockFormik = {
        values: {
          civility: "",
          lastname: "",
          firstname: "",
          age: "",
          adressePostale: "",
          phone: "",
          email: ""
        },
        touched: {},
        errors: {},
        handleChange: jest.fn(),
      };
    test("should render the message", async () => {
        render(<PersonnelInfo message={"Welcome to test"} formik={mockFormik} />);
        const userMessage = await screen.getByText("Welcome to test");
        expect(userMessage).toBeInTheDocument();
    });
    test("should call formik.handleChange on input change", () => {
        render(<PersonnelInfo formik={mockFormik} message="" btn="Valider" />);
        
        const lastnameInput = screen.getByPlaceholderText("Nom*");
        fireEvent.change(lastnameInput, { target: { name: "lastname", value: "Doe" } });
    
        expect(mockFormik.handleChange).toHaveBeenCalled();
      });
      test("should render an field error", () => {
        mockFormik.touched = {
            lastname: true,
            firstname: true
        };
        mockFormik.errors = {
            lastname: 'lastname mock error',
            firstname: "firstname mock error"
        }
        render(<PersonnelInfo formik={mockFormik} message="" btn="Valider" />);
        const mockError = document.querySelectorAll(".formError");
        expect(mockError[0]).toHaveTextContent("lastname mock error");
        expect(mockError[1]).toHaveTextContent("firstname mock error");
      })
})