import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import AddAnimals from '../../components/addAnimals';
import axios from 'axios';
import getFetchApi from '../../utils/getFetchApi';

jest.mock('../../utils/getFetchApi', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('axios');

describe('AddAnimals component', () => {
  const fakeRaces = [
    { _id: 1, name: 'Labrador' },
    { _id: 2, name: 'Beagle' },
  ];
  const fakeIncompatibility = [
    { _id: 1, name: 'Cats' },
    { _id: 2, name: 'Dogs' },
  ];

  const fillForm = async () => {
    // Ouvre le formulaire
    await userEvent.click(screen.getByRole('button', { name: /ajouter un animal/i }));
    await waitFor(() => expect(screen.getByTestId('addAnimals-form')).toBeInTheDocument());
  
    // Champ nom
    await userEvent.type(screen.getByPlaceholderText(/nom/i), 'Buddy');
    expect(screen.getByPlaceholderText(/nom/i)).toHaveValue('Buddy');
  
    // Champ description
    await userEvent.type(
      screen.getByPlaceholderText(/description/i),
      'A friendly dog with a long description to test validation and state updates.'
    );
  
    // Sélection du sexe
    await userEvent.selectOptions(screen.getByLabelText(/sexe:/i), '1');
    await waitFor(() =>
      expect(screen.getByLabelText(/sexe:/i)).toHaveValue('1')
    );
  
    // Sélection de stérilisation
    await userEvent.selectOptions(screen.getByLabelText(/stérile:/i), '0');
    await waitFor(() =>
      expect(screen.getByLabelText(/stérile:/i)).toHaveValue('0')
    );
  
    // Date de naissance
    const bornInput = screen.getByTestId('born');
    await userEvent.clear(bornInput);
    await userEvent.type(bornInput, '2023-06-20');
    expect(bornInput).toHaveValue('2023-06-20');
  
    userEvent.selectOptions(screen.getByTestId('animal-select'),"chien");
    
    await userEvent.click(screen.getByTestId('races-select'));
    await waitFor(() => expect(screen.getByTestId('races-1')).toBeInTheDocument());

    const checkbox = screen.getByTestId(`races-2`);
    userEvent.click(checkbox);
    await userEvent.click(screen.getByTestId('incompatibility-select'));
    await waitFor(() => expect(screen.getByTestId('incompatibility-1')).toBeInTheDocument());

    const checkbox2 = screen.getByTestId(`incompatibility-1`);
    userEvent.click(checkbox2);
    const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
    await userEvent.upload(screen.getByTestId('mock-file-select-btn'), file);
    expect(screen.getByTestId('mock-file-select-btn').files[0].name).toBe('photo.png');
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    getFetchApi.mockResolvedValue({
      races: fakeRaces,
      incompatibility: fakeIncompatibility,
    });
    axios.post.mockResolvedValue({});
  });

  afterEach(() => {
    console.error.mockRestore(); // Nettoyage propre
  });

  test('affiche le formulaire après clic sur "Ajouter un animal"', async () => {
    render(<AddAnimals apiUrl="adopt/add" onReload={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: /ajouter un animal/i }));

    await waitFor(() => {
      expect(screen.getByTestId('addAnimals-form')).toBeInTheDocument();
    });
  });

  test('remplit et envoie le formulaire avec succès', async () => {
    const reloadMock = jest.fn();
    render(<AddAnimals apiUrl="animals" onReload={reloadMock} />);

    await waitFor(() => {
      expect(getFetchApi).toHaveBeenCalledWith('adopt/races');
    });

    await fillForm();

    await userEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(reloadMock).toHaveBeenCalled();
    });
  });

  test('affiche des erreurs de validation quand le formulaire est vide', async () => {
    render(<AddAnimals apiUrl="animals" />);

    await waitFor(() => expect(getFetchApi).toHaveBeenCalled());

    await userEvent.click(screen.getByText(/ajouter un animal/i));
    await waitFor(() =>
      expect(screen.getByTestId('addAnimals-form')).toBeInTheDocument()
    );

    await userEvent.click(screen.getByRole('button', { name: /créer/i }));

    expect(await screen.findByText(/Le nom de l'animal est requis./i)).toBeInTheDocument();
  });

  test('gère les erreurs d’envoi avec axios.post', async () => {
    axios.post.mockRejectedValue(new Error('Erreur simulée'));

    render(<AddAnimals apiUrl="animals" />);
    await waitFor(() =>
      expect(getFetchApi).toHaveBeenCalledWith('adopt/races')
    );

    await fillForm();
    await userEvent.click(screen.getByRole('button', { name: /créer/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi: Erreur simulée");
    });
  });
  
});