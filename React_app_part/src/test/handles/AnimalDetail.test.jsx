import * as AnimalDetail from '../../handles/AnimalDetail';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import getFetchApi from '../../utils/getFetchApi';
import axios from 'axios';
import { EditAnimal, useApiData } from '../../handles/AnimalDetail';
import { MemoryRouter, useNavigate } from 'react-router-dom';


jest.mock('../../utils/getFetchApi');
jest.mock('axios');

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ id: '123' }),
}));

jest.mock('../../utils/isGranted',() => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(true)),
}));

describe('useApiData', () => {
  const mockNavigate = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('should return data', async () => {
    const apiResponse = {
      animal: { id: 1 },
      animalsRaces: { races: '123' },
      animalsIncompability: { incompatibility: '456' },
    };
    getFetchApi.mockResolvedValue(apiResponse);

    const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
    const { result } = renderHook(() => useApiData(), { wrapper });

    await waitFor(() => {
      expect(result.current).toEqual({
        animal: { id: 1 },
        error: null,
        races: { races: '123' },
        incompatibility: { incompatibility: '456' },
      });
    });
  });

  test('should navigate to "/adopter" when URL contains "adopter" and animal not found', async () => {

    getFetchApi.mockResolvedValue({
      message: 'Animal non trouvé',
      animal: null,
      animalsRaces: null,
      animalsIncompatibility: null,
    });

    const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
    renderHook(() => useApiData("http/localhost/adopter/1"), { wrapper });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/adopter', {
        state: { message: 'Animal non trouvé' },
      });
    });
  });

  test('should navigate to "/mediatorAnimal" when URL contains "mediatorAnimal" and animal not found', async () => {
    getFetchApi.mockResolvedValue({
      message: 'Animal non trouvé',
      animal: null,
      animalsRaces: null,
      animalsIncompatibility: null,
    });
  
    const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
  
    renderHook(() => useApiData("http://localhost/mediatorAnimal/1"), { wrapper });
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/mediatorAnimal', {
        state: { message: 'Animal médiateur non trouvé' },
      });
    });
  });

  test('should fail when server error', async () => {
    getFetchApi.mockRejectedValue(new Error('Mock error'));
    jest.spyOn(console, 'error').mockImplementation(() => {});

    const wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
    const { result } = renderHook(() => useApiData(), { wrapper });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Erreur serveur:', 'Mock error');
      expect(result.current).toEqual({
        animal: null,
        error: 'Une erreur est survenue.',
        races: null,
        incompatibility: null,
      });
    });
  });
});


describe('EditAnimal', () => {
  const mockReload = jest.fn();
  const fakeRaces = [{ _id: 1, name: 'Labrador' }, { _id: 2, name: 'Beagle' }];
  const fakeIncompatibility = [{ _id: 1, name: 'Cats' }, { _id: 2, name: 'Dogs' }];

  const formFill = async () => {
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/nom/i)).toBeInTheDocument();
    });

    // Remplir le formulaire
    await userEvent.type(screen.getByPlaceholderText(/nom/i), 'Buddy');
    await userEvent.type(screen.getByPlaceholderText(/description/i), 'A friendly dog dog with a long description to test validation and state updates.');

    await userEvent.selectOptions(screen.getByLabelText(/sexe:/i), '1');
    await userEvent.selectOptions(screen.getByLabelText(/Sterile:/i), '0');
    await userEvent.type(screen.getByLabelText(/Date de naissance:/i), '2020-01-01');
    await userEvent.selectOptions(screen.getByLabelText(/animal:/i), 'chien');

    await userEvent.click(screen.getByTestId('races-select'));
    await waitFor(() => expect(screen.getByTestId('races-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('races-2'));

    await userEvent.click(screen.getByTestId('incompatibility-select'));
    await waitFor(() => expect(screen.getByTestId('incompatibility-1')).toBeInTheDocument());
    await userEvent.click(screen.getByTestId('incompatibility-1'));

    const file = new File(['dummy'], 'photo.png', { type: 'image/png' });
    await userEvent.upload(screen.getByTestId('mock-file-select-btn'), file);

    await userEvent.click(screen.getByRole('button', { name: /Mettre à jour/i }));
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});


    getFetchApi.mockResolvedValue({
      races: fakeRaces,
      incompatibility: fakeIncompatibility,
    });

    axios.patch.mockResolvedValue({});
  });

  test('should updateRaces, submit and reload', async () => {
    render(
      <MemoryRouter>
          <EditAnimal setEdit={jest.fn()} animalData={{
      animal: { id: 1 },
      error: null,
      races: fakeRaces,
      incompatibility: fakeIncompatibility,
    }} onReload={mockReload} />
      </MemoryRouter>
    
  );
    
    await formFill();
    expect(getFetchApi).toHaveBeenCalledTimes(2);
    expect(getFetchApi).toHaveBeenNthCalledWith(1, "adopt/races");
    expect(getFetchApi).toHaveBeenNthCalledWith(2, "adopt/races?species=chien");
    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalled();
      expect(mockReload).toHaveBeenCalled();
    });
  });
  test("should return an error is server error", async () => {
    axios.patch.mockRejectedValue(new Error("Mock error"))
    render(
      <MemoryRouter>
          <EditAnimal setEdit={jest.fn()} animalData={{
      animal: { id: 1 },
      error: null,
      races: fakeRaces,
      incompatibility: fakeIncompatibility,
    }} onReload={mockReload} />
      </MemoryRouter>
    
  );
    await formFill();
    await waitFor(() => {
      expect(axios.patch).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi:", "Mock error");
    })
  })
});

describe("RaceAnimal", () => {
  test("should give the race golden", async () => {
    render(<AnimalDetail.RaceAnimal race={"golden"} />)
    expect(screen.getByText("golden")).toBeInTheDocument();
  })
})

describe("AnimalIdentity", () => {
  const apiData = {
            animal: {
              id: 1,
              sexe: 1,
              isSterile: 1,
              born: "2024-05-06",

            }, 
            races: [
              {espce: "golden"}
            ],
              error: null
          }
  test("should render the edit form", async () => {
    render(<AnimalDetail.AnimalIdentity apiData={apiData}/>)

    await waitFor(() => {
      expect(screen.getByTestId("edit-paraph"));
    })
    
    await userEvent.click(screen.getByTestId("edit-paraph"));
    expect(screen.getByTestId("editForm")).toBeInTheDocument();
  });

  test("should render the delete form", async () => {
    render(<AnimalDetail.AnimalIdentity apiData={apiData} />);

    await waitFor(() => {
      expect(screen.getByTestId("AnimalIdentity"))
    })
    await userEvent.click(screen.getByTestId("delete-paraph"));
    expect(screen.getByTestId("areYouSure")).toBeInTheDocument();
  })
})

describe("AnimalIncompatibility", () => {
  const mockIncompatibility = {
    incompatibility: [
      { imgName: 'cats.png', name: 'Chats' },
      { imgName: 'dogs.png', name: 'Chiens' },
    ],
  };
  test('renders all incompatibility images with correct src and alt', () => {

  
    render(<AnimalDetail.AnimalIncompatibility apiData={mockIncompatibility} />);
    // Vérifie le nombre d'éléments avec le testid
    const imgsContainers = screen.getAllByTestId('incompatibilityImg');
    expect(imgsContainers).toHaveLength(mockIncompatibility.incompatibility.length);
  
    // Vérifie les images à l'intérieur
    imgsContainers.forEach((img, index) => {
      expect(img).toHaveAttribute('src', `/img/${mockIncompatibility.incompatibility[index].imgName}`);
    });
  });
})

describe("AnimalDescription", () => {
  const mockApiData = {
    animal: {
      description: "Description de l'animal"
    },
    incompatibility: [
      { imgName: 'cats.png', name: 'Chats' },
      { imgName: 'dogs.png', name: 'Chiens' },
    ],
  };
  const mockNavigate = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });
  test("should render incompatibility is that not empty", async () => {
    render(<AnimalDetail.AnimalDescription apiData={mockApiData}/>);
    await waitFor(() => {
      expect(screen.getByTestId("animalIncompatibility")).toBeInTheDocument() 
    })
  })
  test("should not render incompatibility is that empty", async () => {
    mockApiData.incompatibility = null;
    render(<AnimalDetail.AnimalDescription apiData={mockApiData} />);
    await waitFor(() => {
      expect(screen.queryByTestId("animalIncompatibility")).not.toBeInTheDocument() 
    })
  })
  test("should navigate to adopterProfile is AnimalDetailHandleClick", async () => {
    render(<AnimalDetail.AnimalDescription btnName={"click me"} apiData={mockApiData}/>);
    await userEvent.click(screen.getByText("click me"));
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/adopterProfile", {"state": {"description": "Description de l'animal"}})
    })
  })
  test("should not render btn is not btnName", () => {
    render(<AnimalDetail.AnimalDescription apiData={mockApiData} />);
    expect(screen.queryByTestId("mainBtn")).toBeNull();
  })
})