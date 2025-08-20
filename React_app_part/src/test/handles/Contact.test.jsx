import emailjs from '@emailjs/browser';
import {ContactForm, handleContactSubmit} from "../../handles/Contact"
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

jest.mock("@emailjs/browser", () => ({
    sendForm: jest.fn().mockResolvedValue({}),
  }));

jest.mock('../../utils/getEnvVars', () => ({
    __esModule: true,
    default: () => ({
      VITE_GMAIL_SERVICE_ID: 'test',
      VITE_GMAIL_CONTACT_MODELE_ID: 'test',
      VITE_GMAILJS_PUBLIC_KEY: 'test',
      VITE_OWNER_EMAIL: "test"
    }),
  }));

describe("handleContactSubmit", () => {
    const mockFormRef = { current: { some: "formElement" } };
    const mockResetForm = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should call emailjs.sendForm and reset form on success", async () => {
        emailjs.sendForm.mockResolvedValueOnce(); 

        const submit = handleContactSubmit(mockFormRef);
        submit({}, { resetForm: mockResetForm });

        expect(emailjs.sendForm).toHaveBeenCalledWith(
            "test",
            "test",
            mockFormRef.current,
            "test"
        );
        await waitFor(() => {
           expect(mockResetForm).toHaveBeenCalled(); 
        })
        
    });

    it("should handle error from emailjs.sendForm", async () => {
        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
        emailjs.sendForm.mockRejectedValueOnce(new Error("Test error"));
    
        const submit = handleContactSubmit(mockFormRef);
        submit({}, { resetForm: mockResetForm }); // ✅ Await here
    
        expect(emailjs.sendForm).toHaveBeenCalled();
        expect(mockResetForm).not.toHaveBeenCalled();
        await waitFor((() => {
            expect(consoleSpy).toHaveBeenCalledWith("Error:", "Test error");
        }))
        
    
        consoleSpy.mockRestore();
    });

    it("should not call emailjs.sendForm if formRef.current is null", async () => {
        const submit = handleContactSubmit({ current: null });
        submit({}, { resetForm: mockResetForm });
        expect(emailjs.sendForm).not.toHaveBeenCalled();
        expect(mockResetForm).not.toHaveBeenCalled();
    });
});

describe("ContactForm", () => {
    test("should submit the form on btn click", async () => {
      const user = userEvent.setup();
  
      // ✅ Patch formRef before rendering
      const fakeForm = document.createElement('form');
      jest.spyOn(React, 'useRef').mockReturnValue({ current: fakeForm });
  
      render(<ContactForm />);
  
      // Fill form fields
      await user.type(screen.getByPlaceholderText("Nom*"), "Doe");
      await user.type(screen.getByPlaceholderText("Prénom*"), "John");
      await user.type(screen.getByPlaceholderText("Email*"), "john@example.com");
      await user.type(screen.getByPlaceholderText("Téléphone"), "0600000000");
      await user.type(screen.getByPlaceholderText("Suject*"), "Test Subject");
      await user.type(screen.getByPlaceholderText("Message*"), "Hello, this is a test.");
  
      // Submit
      await user.click(screen.getByRole("button", { name: /Envoyer/i }));
  
       expect(emailjs.sendForm).toHaveBeenCalled(); 
      
    });
  });