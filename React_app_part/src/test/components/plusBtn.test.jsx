import { render, screen } from "@testing-library/react"
import PLusBtn from "../../components/plusBtn"
import userEvent from "@testing-library/user-event"

describe("plusBtn", () => {
    const mockFormik = {
        values: {
            test: ''
        },
        setFieldValue: jest.fn()
    }
    test("handle click with nothing in the array and no objectOption", async () => {
        render(<PLusBtn formik={mockFormik} array={[]} element={"test"} />)
        const img = await screen.getByTestId("plusBtn");
        await userEvent.click(img);
        expect(mockFormik.setFieldValue).toHaveBeenCalledWith("test", [""]);
    });
    test("handle click with something in the array and no objectOption", async () => {
        render(<PLusBtn formik={mockFormik} element={"test"} array={["cc", "cc"]} />);
        const img = await screen.getByTestId("plusBtn");
        await userEvent.click(img);
        expect(mockFormik.setFieldValue).toHaveBeenCalledWith("test", ["cc", "cc", ""])
    });
    test("handle click with objectOption", async () => {
        render(<PLusBtn formik={mockFormik} element={"test"} array={[]} objectOption={["name", "value"]} />);
        const img = await screen.getByTestId("plusBtn");
        await userEvent.click(img);
        expect(mockFormik.setFieldValue).toHaveBeenCalledWith("test", [{name: "", value: ""}]);
    })
})