import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Action, AddActionForm, changeOrderClick, EditActionForm, handleDragEnd } from "../../handles/actions";
import * as dndKitSortable from '@dnd-kit/sortable';
import axios from "axios";
import isGranted from "../../utils/isGranted";

jest.mock("axios");

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('@dnd-kit/sortable', () => ({
    ...jest.requireActual('@dnd-kit/sortable'),
    useSortable: jest.fn(),
    arrayMove: jest.fn(),
}));

jest.mock('../../utils/isGranted', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('AddAction', () => {
    beforeEach(() => {
        localStorage.setItem('token', 'fake_test_token');
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.clearAllMocks()
      });

    test("should submit with success, reset the form and reload", async () => {
        axios.post.mockResolvedValue({});
        const reloadMock = jest.fn();
    
        render(
            <MemoryRouter>
                <AddActionForm onReload={reloadMock} />
            </MemoryRouter>
        );
    
        const title = await screen.findByPlaceholderText("titre");
        const description = await screen.findByPlaceholderText("description");
        const pageUrl = await screen.findByPlaceholderText("Nom de l'url");
    
        await userEvent.clear(title);
        await userEvent.type(title, 'Test');
    
        await userEvent.clear(description);
        await userEvent.type(description, "test's description who describe the action for give an over view");
    
        await userEvent.clear(pageUrl);
        await userEvent.type(pageUrl, "test/cc");
    
        const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
        await userEvent.upload(screen.getByTestId('mock-file-select-btn'), file);
    
        // Attendre que le fichier soit bien pris en compte
        await waitFor(() => {
            expect(axios.post).not.toHaveBeenCalled(); // S'assure que submit pas encore lancé
            const fileInput = screen.getByTestId('mock-file-select-btn');
            expect(fileInput.files[0]).toBe(file);
        });
    
        await userEvent.click(screen.getByRole('button', { name: /créer/i }));
    
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
    
            const formDataSent = axios.post.mock.calls[0][1];
            expect(formDataSent instanceof FormData).toBe(true);
    
            expect(formDataSent.get('title')).toBe('Test');
            expect(formDataSent.get('description')).toBe("test's description who describe the action for give an over view");
            expect(formDataSent.get('pageUrl')).toBe('test/cc');
    
            const uploadedFile = formDataSent.get('file');
            expect(uploadedFile).toBeTruthy();
            expect(uploadedFile.name).toBe('photo.png');
            expect(uploadedFile.type).toBe('image/png');
    
            expect(reloadMock).toHaveBeenCalled();
        });
    });

    test("should fail when error validation", async () => {
        const reloadMock = jest.fn();
        const action = {
            id: 1, 
            title: "test's title",
            description: "test's description who describe the action for give an over view",
            pageUrl: "test"
        };
    
        render(
            <MemoryRouter>
                <AddActionForm action={action} onReload={reloadMock} />
            </MemoryRouter>
        );
    
        const title = await screen.findByPlaceholderText("titre");

        await userEvent.clear(title);
        await userEvent.click(screen.getByRole('button', { name: /créer/i }));
        // Vérifie que l'API n'est pas appelée à cause d'une validation frontend
        expect(axios.post).not.toHaveBeenCalled();
    
        // Vérifie que le message d'erreur s'affiche
        expect(await screen.findByText(/le titre est requis./i)).toBeInTheDocument();
    });

    test("should fail when axios error", async () => {
        axios.post.mockRejectedValue(new Error('Erreur simulée'));
        const reloadMock = jest.fn();
        const action = {
            id: 1, 
            title: "test's title",
            description: "test's description who describe the action for give an over view",
            pageUrl: "test"
        };
    
        render(
            <MemoryRouter>
                <AddActionForm action={action} onReload={reloadMock} />
            </MemoryRouter>
        );
    
        const title = await screen.findByPlaceholderText("titre");
        const description = await screen.findByPlaceholderText("description");
        const pageUrl = await screen.findByPlaceholderText("Nom de l'url");
    
        await userEvent.clear(title);
        await userEvent.type(title, 'Test');
    
        await userEvent.clear(description);
        await userEvent.type(description, "test's description who describe the action for give an over view");
    
        await userEvent.clear(pageUrl);
        await userEvent.type(pageUrl, "test/cc");
    
        const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
        await userEvent.upload(screen.getByTestId('mock-file-select-btn'), file);
    
        // Attendre que le fichier soit bien pris en compte
        await waitFor(() => {
            expect(axios.post).not.toHaveBeenCalled(); // S'assure que submit pas encore lancé
            const fileInput = screen.getByTestId('mock-file-select-btn');
            expect(fileInput.files[0]).toBe(file);
        });
    
        await userEvent.click(screen.getByRole('button', { name: /créer/i }));
    
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi :", "Erreur simulée")
        });
    });
})

describe("EditActionForm", () => {
    beforeEach(() => {
        localStorage.setItem('token', 'fake_test_token');
        jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.clearAllMocks()
      });
    test("should submit with success reset the form and reload without file", async () => {
        axios.patch.mockResolvedValue({});
        const reloadMock = jest.fn()
        const action = {
            id: 1, 
            title: "test's title",
            description: "test's description who describe the action for give an over view",
            pageUrl: "test"
        };
    
        render(
            <MemoryRouter>
                <EditActionForm action={action} onReload={reloadMock} />
            </MemoryRouter>
        );
    
        const title = await screen.findByPlaceholderText("titre");
        const pageUrl = await screen.findByPlaceholderText("Nom de l'url");
    
        await userEvent.clear(title);
        await userEvent.type(title, 'Test');
        expect(title).toHaveValue('Test');
    
        await userEvent.clear(pageUrl);
        await userEvent.type(pageUrl, "test/cc");
        expect(pageUrl).toHaveValue("test/cc");

        await userEvent.click(screen.getByRole('button', { name: /mettre à jour/i }));
        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalled();
            const formDataSent = axios.patch.mock.calls[0][1];
            expect(formDataSent instanceof FormData).toBe(true);

            // Vérifier que les champs attendus sont dedans
            expect(formDataSent.get('title')).toBe('Test');
            expect(formDataSent.get('description')).toBe('test\'s description who describe the action for give an over view');
            expect(formDataSent.get('pageUrl')).toBe('test/cc');
            expect(reloadMock).toHaveBeenCalled();
        });
    });

    test("should submit with success, reset the form and reload with file", async () => {
        axios.patch.mockResolvedValue({});
        const reloadMock = jest.fn();
        const action = {
            id: 1, 
            title: "test's title",
            description: "test's description who describe the action for give an over view",
            pageUrl: "test"
        };
    
        render(
            <MemoryRouter>
                <EditActionForm action={action} onReload={reloadMock} />
            </MemoryRouter>
        );
    
        const title = await screen.findByPlaceholderText("titre");
        const description = await screen.findByPlaceholderText("description");
        const pageUrl = await screen.findByPlaceholderText("Nom de l'url");
    
        await userEvent.clear(title);
        await userEvent.type(title, 'Test');
    
        await userEvent.clear(description);
        await userEvent.type(description, "test's description who describe the action for give an over view");
    
        await userEvent.clear(pageUrl);
        await userEvent.type(pageUrl, "test/cc");
    
        const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
        await userEvent.upload(screen.getByTestId('mock-file-select-btn'), file);
    
        // Attendre que le fichier soit bien pris en compte
        await waitFor(() => {
            expect(axios.patch).not.toHaveBeenCalled(); // S'assure que submit pas encore lancé
            const fileInput = screen.getByTestId('mock-file-select-btn');
            expect(fileInput.files[0]).toBe(file);
        });
    
        await userEvent.click(screen.getByRole('button', { name: /mettre à jour/i }));
    
        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalled();
    
            const formDataSent = axios.patch.mock.calls[0][1];
            expect(formDataSent instanceof FormData).toBe(true);
    
            expect(formDataSent.get('title')).toBe('Test');
            expect(formDataSent.get('description')).toBe("test's description who describe the action for give an over view");
            expect(formDataSent.get('pageUrl')).toBe('test/cc');
    
            const uploadedFile = formDataSent.get('file');
            expect(uploadedFile).toBeTruthy();
            expect(uploadedFile.name).toBe('photo.png');
            expect(uploadedFile.type).toBe('image/png');
    
            expect(reloadMock).toHaveBeenCalled();
        });
    });

    test("should fail when error validation", async () => {
        const reloadMock = jest.fn();
        const action = {
            id: 1, 
            title: "test's title",
            description: "test's description who describe the action for give an over view",
            pageUrl: "test"
        };
    
        render(
            <MemoryRouter>
                <EditActionForm action={action} onReload={reloadMock} />
            </MemoryRouter>
        );
    
        const title = await screen.findByPlaceholderText("titre");

        await userEvent.clear(title);
        await userEvent.click(screen.getByRole('button', { name: /mettre à jour/i }));
        // Vérifie que l'API n'est pas appelée à cause d'une validation frontend
        expect(axios.patch).not.toHaveBeenCalled();
    
        // Vérifie que le message d'erreur s'affiche
        expect(await screen.findByText(/le titre est requis./i)).toBeInTheDocument();
    });

    test("should fail when axios error", async () => {
        axios.patch.mockRejectedValue(new Error('Erreur simulée'));
        const reloadMock = jest.fn();
        const action = {
            id: 1, 
            title: "test's title",
            description: "test's description who describe the action for give an over view",
            pageUrl: "test"
        };
    
        render(
            <MemoryRouter>
                <EditActionForm action={action} onReload={reloadMock} />
            </MemoryRouter>
        );
    
        const title = await screen.findByPlaceholderText("titre");
        const description = await screen.findByPlaceholderText("description");
        const pageUrl = await screen.findByPlaceholderText("Nom de l'url");
    
        await userEvent.clear(title);
        await userEvent.type(title, 'Test');
    
        await userEvent.clear(description);
        await userEvent.type(description, "test's description who describe the action for give an over view");
    
        await userEvent.clear(pageUrl);
        await userEvent.type(pageUrl, "test/cc");
    
        const file = new File(['dummy content'], 'photo.png', { type: 'image/png' });
        await userEvent.upload(screen.getByTestId('mock-file-select-btn'), file);
    
        // Attendre que le fichier soit bien pris en compte
        await waitFor(() => {
            expect(axios.patch).not.toHaveBeenCalled(); // S'assure que submit pas encore lancé
            const fileInput = screen.getByTestId('mock-file-select-btn');
            expect(fileInput.files[0]).toBe(file);
        });
    
        await userEvent.click(screen.getByRole('button', { name: /mettre à jour/i }));
    
        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalled();
            expect(console.error).toHaveBeenCalledWith("Erreur lors de la mise à jour :", "Erreur simulée")
        });
    });
});

describe('Action component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);
        dndKitSortable.useSortable.mockReturnValue({
            attributes: { 'data-sortable': 'true' },
            listeners: { onDragStart: jest.fn() },
            setNodeRef: jest.fn(),
            transform: null,
            transition: 'all 150ms ease',
        });
        isGranted.mockResolvedValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should render title, text and button when asBtn is provided', () => {
        const mockEdit = jest.fn();
        const mockDelete = jest.fn();

        render(
            <Action
                id={1}
                title="Test Title"
                src="/image.png"
                alt="test image"
                text="Test text"
                asBtn="voirPlus"
                editClick={mockEdit}
                supClick={mockDelete}
                btnClick="details/1"
                granted={true}
            />
        );

        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('Test text')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /voir plus/i })).toBeInTheDocument();
    });

    test('should navigate when clicking button', async () => {
        const user = userEvent.setup();

        render(
            <Action
                id={1}
                title="Test Title"
                src="/image.png"
                alt="test image"
                text="Test text"
                asBtn="voirPlus"
                editClick={() => {}}
                supClick={() => {}}
                btnClick="details/1"
                granted={true}
            />
        );

        const btn = screen.getByRole('button', { name: /voir plus/i });

        await user.click(btn);

        expect(mockNavigate).toHaveBeenCalledWith('/details/1');
    });

    test('should pass sortable attributes and listeners when granted is true', async () => {
        render(
            <Action
                id={1}
                title="Test Title"
                src="/image.png"
                alt="test image"
                text="Test text"
                asBtn="voirPlus"
                editClick={() => {}}
                supClick={() => {}}
                btnClick="details/1"
                granted={true}
            />
        );

        await waitFor(() => {
            const sortableSpan = document.querySelector('span.attriAndList');
            expect(sortableSpan).toBeInTheDocument();
            expect(sortableSpan.getAttribute('data-sortable')).toBe('true');
        });
    });
    test('should not pass sortable props when granted is false', () => {
        const { container } = render(
            <Action
                id={1}
                title="Test Title"
                src="/image.png"
                alt="test image"
                text="Test text"
                asBtn="voirPlus"
                editClick={() => {}}
                supClick={() => {}}
                btnClick="details/1"
                granted={false}
            />
        );

        const appSection = container.querySelector('[data-sortable="true"]');
        expect(appSection).toBeNull();
    });
});


describe('handleDragEnd', () => {
    it('should do nothing if active and over ids are the same', () => {
        const setSaving = jest.fn();
        const setActions = jest.fn();
        const actions = [{ id: 1 }, { id: 2 }, { id: 3 }];

        handleDragEnd(actions, setSaving, setActions, {
            active: { id: 2 },
            over: { id: 2 },
        });

        expect(setSaving).not.toHaveBeenCalled();
        expect(setActions).not.toHaveBeenCalled();
    });

    it('should call setSaving and setActions with correct positions when ids differ', () => {
        const setSaving = jest.fn();
        const setActions = jest.fn((callback) => {
            const prev = [{ id: 1 }, { id: 2 }, { id: 3 }];
            callback(prev);
        });

        const actions = [{ id: 1 }, { id: 2 }, { id: 3 }];

        // Mock arrayMove result
        dndKitSortable.arrayMove.mockImplementation((arr, from, to) => [`moved from ${from} to ${to}`]);

        handleDragEnd(actions, setSaving, setActions, {
            active: { id: 2 },
            over: { id: 1 },
        });

        expect(setSaving).toHaveBeenCalledWith(true);
        expect(dndKitSortable.arrayMove).toHaveBeenCalledWith(actions, 1, 0);
        expect(setActions).toHaveBeenCalled();
    });

    it('should handle missing ids gracefully', () => {
        const setSaving = jest.fn();
        const setActions = jest.fn();

        const actions = [{ id: 1 }, { id: 2 }, { id: 3 }];

        handleDragEnd(actions, setSaving, setActions, {
            active: { id: 999 },  // Not present
            over: { id: 1 },
        });

        expect(setSaving).toHaveBeenCalledWith(true);
        expect(setActions).toHaveBeenCalled();
    });
});

describe("ChangeOrderClick", () => {
    const actions = [
        {id: 1},
        {id: 2},
        {id: 3}
    ];
    const mockReload = jest.fn();
    beforeEach(() => {
        localStorage.setItem('token', 'fake_test_token');
        jest.spyOn(console, "error").mockImplementation(() => {});
    });
    it("should change the order with sucess", async () => {
        axios.patch.mockResolvedValue({});
        await changeOrderClick(actions, mockReload);
        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalled();
        })
        expect(mockReload).toHaveBeenCalledTimes(1);
    })
    it("should fail when error server",async () => {
        axios.patch.mockRejectedValue(new Error("mock error"));
        await changeOrderClick(actions, mockReload);
        await waitFor(() => {
            expect(axios.patch).toHaveBeenCalled();
        })
        expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi :", "mock error")
    })
})