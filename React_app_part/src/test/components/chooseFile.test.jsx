import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChooseFile from "../../components/chooseFile";

describe('ChooseFile component', () => { 
    const mockSetFieldValue = jest.fn();
    const mockFormik = { setFieldValue: mockSetFieldValue };
    test('calls formik.setFieldValue with the selected file', async () => {
      render(<ChooseFile formik={mockFormik} />);
  
      const fileInput = screen.getByTestId('mock-file-select-btn');
      const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
  
      await userEvent.upload(fileInput, file);
  
      expect(mockSetFieldValue).toHaveBeenCalledWith('file', file);
    });
    test('does not call formik.setFieldValue if no file is selected', async () => {
        const mockSetFieldValue = jest.fn();
        const mockFormik = { setFieldValue: mockSetFieldValue };
        jest.spyOn(console, 'error').mockImplementation(() => {});
    
        render(<ChooseFile formik={mockFormik} />);
    
        const fileInput = screen.getByTestId('mock-file-select-btn');
    
        // Simuler un champ file vide
        fireEvent.change(fileInput, { target: { files: [] } });
    
        expect(mockSetFieldValue).not.toHaveBeenCalled(); 
        expect(console.error).toHaveBeenCalledWith('no file');
    });
});