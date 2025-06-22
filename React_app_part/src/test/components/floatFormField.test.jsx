// FloatFormField.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FloatFormField from "../../components/floatFormField";
import PropTypes from "prop-types";


describe("FloatFormField", () => {
    test("renders title and content", () => {
        render(
            <FloatFormField
                setter={jest.fn()}
                action="Ajouter"
                content={<p>Contenu de test</p>}
            />
        );
        expect(screen.getByText("Ajouter")).toBeInTheDocument();
        expect(screen.getByText("Contenu de test")).toBeInTheDocument();
    });

    test("calls setter when close button is clicked", async () => {
        const mockSetter = jest.fn();
        render(
            <FloatFormField
                setter={mockSetter}
                action="Modifier"
                content={<div>Autre contenu</div>}
            />
        );

        const closeBtn = screen.getByRole("button", {name: /close the page/i});
        await userEvent.click(closeBtn);
        expect(mockSetter).toHaveBeenCalled();
    });

    test('adds isTop class when isTop is true', async () => {
        render(
          <FloatFormField
            setter={() => {}}
            action="Ajouter un animal"
            content={<p>Contenu</p>}  // JSX direct ici
            isTop={true}
          />
        );
      
        // On récupère l'élément par testid
        const element = await screen.getByTestId('floatFormField');
        expect(element).toBeInTheDocument();
        expect(element).toHaveClass('isTop');
      });
});

