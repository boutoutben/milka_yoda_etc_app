import userEvent from "@testing-library/user-event";
import { AlignDropDown, ArticleCancelle, ArticleRegister, convertStyleToHtml, convertStyleToReact, Dropdown, EditColor, format, getContent, handlePaste, isInsideTag, ListDropdown, setDivClass, toggleTagOnSelection, useGetArticleDetail, useSelectionChange } from "../../handles/WriteArticle"
import { fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import React, { act, useEffect, useRef, useState } from "react";
import axios from "axios";
import { MemoryRouter, useParams } from "react-router-dom";
import getFetchApi from "../../utils/getFetchApi";
import updateTools from "../../utils/updateTools";

jest.mock("axios")

jest.mock("../../utils/getFetchApi")

jest.mock("../../utils/updateTools", () => ({
  __esModule: true,
  default: jest.fn(),
  updateTools: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn()
}));

const TestWrapper = ({ Component = null, onMount = null, content = "" }) => {
  const editColorRef = useRef(null);

  useEffect(() => {
    if (onMount && editColorRef.current) {
      onMount(editColorRef.current);
    }
  }, [onMount]);

  return (
    <div>
      <div
        ref={editColorRef}
        contentEditable
        suppressContentEditableWarning
        data-testid="editable"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {Component ? React.cloneElement(Component, { editColorRef }) : null}
    </div>
  );
};


  let mockRange = {
    selectNodeContents: jest.fn(),
    collapse: jest.fn(),
    setStart: jest.fn(),
    setEnd: jest.fn(),
    extractContents: jest.fn(),
    startContainer: jest.fn(),
    commonAncestorContainer: jest.fn(),
  };
  let mockSelection = {
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
    rangeCount: 1,
    isCollapsed: false,
    focusNode: jest.fn(),
    getRangeAt: jest.fn(() => mockRange),
  };
  window.getSelection = jest.fn(() => mockSelection);
  document.createRange = jest.fn(() => mockRange);

describe("EditColor", () => {
    beforeAll(() => {
        document.execCommand = jest.fn();
      });
      
      afterAll(() => {
        document.execCommand.mockRestore?.();
      });
    test("should open the editColor on downdonw click", async () => {
        render(<EditColor />);
        await userEvent.click(screen.getByRole("button", {name:"A"}));
        await waitFor(() => {
            expect(screen.getByTestId("editColor")).toBeInTheDocument()
        })
    });
    test('should change the color on pickup change', async () => {
       
        
          // Mock execCommand
          document.execCommand = jest.fn();
        
          // Mock Selection API
          
        
          render(<TestWrapper Component={<EditColor />} />);
      
        // Open color picker
        await userEvent.click(screen.getByRole('button'));
      
        // Wait for color picker to open
        await waitFor(() => {
          expect(screen.getByText('RGB:')).toBeInTheDocument();
        });
      
        // Select the text
        const editableDiv = screen.getByTestId('editable');
        mockRange.selectNodeContents(editableDiv);
        mockRange.commonAncestorContainer = editableDiv;
      
        // Click swatch to change color
        const swatchButton = screen.getByRole('button', { name: 'rgb(154,154,154)' });
        await userEvent.click(swatchButton);
      
        // Ensure execCommand was called
        await waitFor(() => {
          expect(document.execCommand).toHaveBeenCalled();
        });
        expect(mockSelection.removeAllRanges).toHaveBeenCalled();
        expect(document.createRange).toHaveBeenCalled();
        expect(mockRange.collapse).toHaveBeenCalledWith(false);
        expect(mockSelection.addRange).toHaveBeenCalledWith(mockRange);
      });

      test('closes editColor on outside click', () => {
        render(<TestWrapper Component={<EditColor />} />);
    
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByText('RGB:')).toBeInTheDocument();
    
        // Click outside
        fireEvent.mouseDown(document);
        expect(screen.queryByText('RGB:')).not.toBeInTheDocument();
      });
});

describe("format", () => {
    beforeEach(() => {
      document.execCommand = jest.fn();
    });
  
    test("should execute the command without option", () => {
      format("underline");
      expect(document.execCommand).toHaveBeenCalledWith("underline", false, null);
    });
  
    test("should execute the command with option", () => {
      format("insertHTML", "<p>html</p>");
      expect(document.execCommand).toHaveBeenCalledWith("insertHTML", false, "<p>html</p>");
    });
    test("should return an error if execCommand throws", () => {
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Empêche l'affichage dans la console
      
        document.execCommand = jest.fn(() => {
          throw new Error("Commande non supportée");
        });
      
        format("fakeCommand");
      
        expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Commande non supportée");
      });
  });

describe("Dropdown", () => {
    const mockOption = [
        { value: "test1", icon: "test1", action: "firstTest" },
        { value: "test2", icon: "test2", action: "secondTest" }
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })
    test("should open the dropdown on btn click", async () => {
        render(<TestWrapper Component={<Dropdown options={mockOption} nodeCode={jest.fn()} />} />)
        await userEvent.click(screen.getByRole("button"));
        await waitFor(() => {
            expect(screen.getByTestId("dropDownMenu")).toBeInTheDocument();    
        });
        expect(screen.getAllByTestId("dropDownOption")).toHaveLength(mockOption.length)   
    }) 
    test("should change the select tag on click", async () => {
        jest.spyOn(document, "execCommand").mockImplementation(() => {})
        render(
          <TestWrapper
            Component={
              <Dropdown
                options={mockOption}
                nodeCode={jest.fn()}
              />
            }
          />
        );
      
        const editableDiv = screen.getByTestId("editable");
      
        mockRange.selectNodeContents(editableDiv);
        mockRange.commonAncestorContainer = editableDiv;
      
        // Ouvre le menu déroulant
        await userEvent.click(screen.getByRole("button"));
        await waitFor(() => {
          expect(screen.getByTestId("dropDownMenu")).toBeInTheDocument();
        });
      
        // Cible les options
        const allOptions = screen.getAllByTestId("dropDownOption");
        expect(allOptions.length).toBeGreaterThan(1);
      
        // Clique sur une option avec fireEvent (plus robuste)
        fireEvent.click(allOptions[1]);
        await waitFor(() => {
            expect(document.execCommand).toHaveBeenCalledWith("secondTest", false, null);
        })
        expect(screen.queryByTestId("dropDownMenu")).not.toBeInTheDocument();    
      });

      test("handleSelectionChange should be call and setSelected the tag", async () => {
        const mockNodeCode = jest.fn().mockReturnValue("test2");

        render(
            <TestWrapper
              Component={
                <Dropdown
                  options={mockOption}
                  nodeCode={mockNodeCode}
                />
              }
            />
        )

        act(() => {
            document.dispatchEvent(new Event("selectionchange"));
          });

        expect(mockNodeCode).toHaveBeenCalled();
        await waitFor(() => {  
            expect(screen.getByRole("button").querySelector("i")).toHaveClass("test2")
        })
      })

      test('closes dropDownMenu on outside click', () => {
        render(
            <TestWrapper
              Component={
                <Dropdown
                  options={mockOption}
                  nodeCode={jest.fn()}
                />
              }
            />
          );
    
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(screen.getByTestId("dropDownMenu")).toBeInTheDocument(); 
    
        // Click outside
        fireEvent.mouseDown(document);
        expect(screen.queryByTestId("dropDownMenu")).not.toBeInTheDocument(); 
      });
})

describe("convertStyleToHtml", () => {
    test("should convert JSX inline style to HTML style", () => {
      const jsx = `<div style={{ color: 'red', fontSize: '16px' }}>Text</div>`;
      const expectedHtml = `<div style="color: red; font-size: 16px">Text</div>`;
      const result = convertStyleToHtml(jsx);
      expect(result).toBe(expectedHtml);
    });
  
    test("should handle camelCase style properties", () => {
      const jsx = `<span style={{ backgroundColor: 'blue', borderRadius: '5px' }}>Box</span>`;
      const expectedHtml = `<span style="background-color: blue; border-radius: 5px">Box</span>`;
      const result = convertStyleToHtml(jsx);
      expect(result).toBe(expectedHtml);
    });
  
    test("should return unchanged string if no style present", () => {
      const jsx = `<p>No styles here</p>`;
      const result = convertStyleToHtml(jsx);
      expect(result).toBe(jsx);
    });
  });

describe("convertStyleToReact", () => {
    test("should HTML style to JSX inline style", () => {
        const htmlStyle = `<span style="background-color: blue; border-radius: 5px">Box</span>`;
        const expectedStyle = `<span style={{ backgroundColor: 'blue', borderRadius: '5px' }}>Box</span>`;
        const result = convertStyleToReact(htmlStyle);
        expect(result).toBe(expectedStyle)
    });
    test("should handle camelCase style properties", () => {
        const htmlStyle = `<span style="background-color: blue; border-radius: 5px">Box</span>`;
        const expectedStyle = `<span style={{ backgroundColor: 'blue', borderRadius: '5px' }}>Box</span>`;
        const result = convertStyleToReact(htmlStyle);
        expect(result).toBe(expectedStyle)
    })
    test("should return unchnaged string if no style present", () => {
        const htmlStyle = `<p>No styles here</p>`;
        const result = convertStyleToHtml(htmlStyle);
        expect(result).toBe(htmlStyle);
    })
})

describe('setDivClass', () => {
  let editorRef;

  beforeEach(() => {
    // Simule un éditeur contenteditable avec quelques divs
    document.body.innerHTML = `
      <div id="editor">
        <div id="div1">Texte</div>
        <div id="div2"></div>
        <div id="div3">   </div>
        <div id="div4"><br></div>
      </div>
    `;

    editorRef = {
      current: document.getElementById('editor'),
    };
  });

  it('ajoute la classe "emptyDiv" aux divs vides', () => {
    setDivClass(editorRef);

    expect(document.getElementById('div1').classList.contains('emptyDiv')).toBe(false);
    expect(document.getElementById('div2').classList.contains('emptyDiv')).toBe(true);
    expect(document.getElementById('div3').classList.contains('emptyDiv')).toBe(true);
    expect(document.getElementById('div4').classList.contains('emptyDiv')).toBe(true);
  });

  it('ne plante pas si editorRef.current est null', () => {
    const nullRef = { current: null };
    expect(() => setDivClass(nullRef)).not.toThrow();
  });
});

describe('handlePaste', () => {
  it('should prevent default paste and insert plain text at cursor', () => {
    const mockPreventDefault = jest.fn();
    const mockGetData = jest.fn().mockReturnValue('pasted text');
    const mockExecCommand = jest.spyOn(document, 'execCommand').mockImplementation(() => true);

    const fakeEvent = {
      preventDefault: mockPreventDefault,
      clipboardData: {
        getData: mockGetData,
      },
    };

    handlePaste(fakeEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockGetData).toHaveBeenCalledWith('text');
    expect(mockExecCommand).toHaveBeenCalledWith('insertText', false, 'pasted text');

    mockExecCommand.mockRestore();
  });

  it('should fallback to window.clipboardData if e.clipboardData is undefined', () => {
    const mockPreventDefault = jest.fn();
    const mockGetData = jest.fn().mockReturnValue('legacy pasted');
    const mockExecCommand = jest.spyOn(document, 'execCommand').mockImplementation(() => true);

    // Simule un ancien navigateur
    window.clipboardData = {
      getData: mockGetData,
    };

    const fakeEvent = {
      preventDefault: mockPreventDefault,
      clipboardData: undefined,
    };

    handlePaste(fakeEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
    expect(mockGetData).toHaveBeenCalledWith('text');
    expect(mockExecCommand).toHaveBeenCalledWith('insertText', false, 'legacy pasted');

    mockExecCommand.mockRestore();
    delete window.clipboardData;
  });
});

describe("getContent", () => {
  it("should return converted content without <br>", () => {
    const mockEditorRef = {
      current: {
        innerHTML: "<p>Test</p><br />",
        querySelectorAll: () => []
      }
    };

    const result = getContent(mockEditorRef);
    expect(result).toBe("<p>Test</p>");
  });

  it("should return empty string if editorRef is undefined", () => {
    const result = getContent(undefined);
    expect(result).toBe("");
  });

  it("should return empty string if innerHTML is undefined", () => {
    const mockEditorRef = {
      current: {},
      querySelectorAll: () => []
    };

    const result = getContent(mockEditorRef);
    expect(result).toBe("");
  });

  it("should return empty string if convertStyleToReact returns null", () => {
    const mockEditorRef = {
      current: {
        innerHTML: "",
        querySelectorAll: () => []
      }
    };


    const result = getContent(mockEditorRef);

    expect(result).toBe("");
  });
});

describe("toggleTagOnSelection", () => {
  let container, textNode, mockRange, mockSelection;
  const originalGetSelection = window.getSelection;

  beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);

  const text = document.createTextNode("Hello world");
  const p = document.createElement("p");
  p.appendChild(text);
  container.appendChild(p);
  textNode = text;
  const parentNode = document.createElement('div');
const commonAncestor = document.createElement('p');
parentNode.appendChild(commonAncestor);


  mockRange = {
    commonAncestorContainer: commonAncestor,  // <-- Ajout important
    extractContents: jest.fn(() => {
      const frag = document.createDocumentFragment();
      frag.appendChild(textNode.cloneNode(true));
      return frag;
    }),
    insertNode: jest.fn(),
    selectNodeContents: jest.fn(),
  };

  mockSelection = {
    rangeCount: 1,
    isCollapsed: false,
    getRangeAt: jest.fn(() => mockRange),
    focusNode: textNode,
    removeAllRanges: jest.fn(),
    addRange: jest.fn(),
  };

  window.getSelection = jest.fn(() => mockSelection);
});

  afterEach(() => {
    window.getSelection = originalGetSelection; // restaure l’original
    delete global.format; // évite les fuites
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  test("should wrap selection with a <u> tag if not already inside", () => {
    toggleTagOnSelection("u");

    expect(mockRange.extractContents).toHaveBeenCalled();
    expect(mockRange.insertNode).toHaveBeenCalledWith(expect.any(HTMLElement));
    
    const inserted = mockRange.insertNode.mock.calls[0][0];
    expect(inserted.tagName).toBe("U");
    expect(inserted.textContent).toBe("Hello world");

    expect(mockSelection.removeAllRanges).toHaveBeenCalled();
    expect(mockSelection.addRange).toHaveBeenCalled();
  });

  test("should unwrap <u> tag if already inside", () => {
  const u = document.createElement("u");
  const inner = document.createTextNode("Hello world");
  u.appendChild(inner);
  container.appendChild(u);

  const range = document.createRange();
  range.setStart(inner, 0);
  range.setEnd(inner, inner.length);

  // On redéfinit proprement le mock du range
  const mockRange = {
    ...range,
    commonAncestorContainer: u,
    extractContents: jest.fn(), // on vérifie que ce n'est pas appelé
    cloneContents: () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(inner.cloneNode(true));
      return frag;
    },
  };

  mockSelection.getRangeAt = jest.fn(() => mockRange);
  mockSelection.focusNode = inner;

  window.getSelection = jest.fn(() => mockSelection);

  toggleTagOnSelection("u");

  expect(container.innerHTML).toContain("Hello world");
  expect(container.querySelector("u")).toBeNull(); // il n'y a plus de <u>
  expect(document.body.contains(u)).toBe(false);   // le noeud <u> original est bien supprimé
  expect(mockRange.extractContents).not.toHaveBeenCalled(); // pas de wrapping
});
});

describe("ArticleCancelle", () => {
  const mockNavigate = jest.fn();
  

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "1" }); // Simule l'ID d'URL
  });

  test("should redirect to the response url", async () => {
    axios.post.mockResolvedValue({ data: { url: "/test" } });

    render(
      <MemoryRouter>
        <ArticleCancelle navigate={mockNavigate} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /anuller/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/articles/cancelle/1",
        {},
        { withCredentials: true }
      );
      expect(mockNavigate).toHaveBeenCalledWith("/test");
    });
  });
  test("should return an error with axios fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    axios.post.mockRejectedValue(new Error("Mock error"))
    render(
      <MemoryRouter>
        <ArticleCancelle navigate={mockNavigate} />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /anuller/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:5000/api/articles/cancelle/1",
        {},
        { withCredentials: true }
      );
      expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi :", "Mock error");
    });
  })
});

describe("ArticleRegister", () => {
  const mockNavigate = jest.fn();
  const mockEditorRef = {
    current: {
      innerHTML: null,
    },
  };
  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "1" }); // Simule l'ID d'URL
    jest.spyOn(console, "error").mockImplementation(() => {})
  });

  test("should post content and navigate", async () => { 

  axios.post.mockResolvedValueOnce({}); // simulate success

  render(
    <ArticleRegister editorRef={mockEditorRef} navigate={mockNavigate} />
  );

  await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:5000/api/articles/edit/1",
      { content: "" },
      { withCredentials: true }
    );
    expect(mockNavigate).toHaveBeenCalledWith("/article/1");
  });
});

  test("should not crash if editorRef is undefined", async () => {
  render(<ArticleRegister editorRef={mockEditorRef} navigate={mockNavigate} />);

  await userEvent.click(screen.getByRole("button", { name: /enregistrer/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith("Erreur lors de l'envoi :", "Mock error")
  });
});
});

describe("useGetArticleDetail", () => {
 beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ id: "1" }); // Simule l'ID d'URL
    jest.spyOn(console, "error").mockImplementation(() => {})
  });
  test("should return the return data", async () => {
    getFetchApi.mockResolvedValue({
  content: `
const Article = () => {
  return (
    <>
      <div><h1>ezrui zeri uaezr poiazeu poizeur ipaoz e</h1><div class="emptyDiv"></div></div>
      uriezp oiur piouazerp iuaezpr uzpeoi ruazep ruap ezruapezru paezur apezru paoizeur peuzr ipoauezr paoiuer paoriezur paozeuir poiauezr pauie piaouezrp iuezraporu apzeoiruazpoeiu pazeu poiuazep uazepr
      <div align="center" class="emptyDiv"></div>
      <div><h2> azeiro uazrpeoiu </h2><div class="emptyDiv"></div></div>
      <div>dfk hsfdk hjsdf hqlsjdf hlqsjdfh ljqsdkf hjqsdf hljdqsfh hljkdqs fljdskf hlsdfh</div>
      <div class="emptyDiv"></div>
      <div>
        <ol>
          <li>yry ouiry aezuoriy zaueiry zeoairy oazery oaerzy aory aoeyoia ruiaeyr oaiezy raezr </li>
          <li>r yruia zyero iyaezr</li>
          <li>eziru piazuer </li>
          <li>raize</li>
        </ol>
        <div class="emptyDiv"></div>
        <div>fufiufiufiopufpuepoifu pezoiure poaiuezr piuze</div>
      </div>
    </>
  )
};`
});
  const expectedHtml = `
<div><h1>ezrui zeri uaezr poiazeu poizeur ipaoz e</h1><div class="emptyDiv"></div></div>
uriezp oiur piouazerp iuaezpr uzpeoi ruazep ruap ezruapezru paezur apezru paoizeur peuzr ipoauezr paoiuer paoriezur paozeuir poiauezr pauie piaouezrp iuezraporu apzeoiruazpoeiu pazeu poiuazep uazepr
<div align="center" class="emptyDiv"></div>
<div><h2> azeiro uazrpeoiu </h2><div class="emptyDiv"></div></div>
<div>dfk hsfdk hjsdf hqlsjdf hlqsjdfh ljqsdkf hjqsdf hljdqsfh hljkdqs fljdskf hlsdfh</div>
<div class="emptyDiv"></div>
<div>
  <ol>
    <li>yry ouiry aezuoriy zaueiry zeoairy oazery oaerzy aory aoeyoia ruiaeyr oaiezy raezr </li>
    <li>r yruia zyero iyaezr</li>
    <li>eziru piazuer </li>
    <li>raize</li>
  </ol>
  <div class="emptyDiv"></div>
  <div>fufiufiufiopufpuepoifu pezoiure poaiuezr piuze</div>
</div>`.replace(/\s+/g, ' ').trim();

  const { result } = renderHook(() => useGetArticleDetail());

  await waitFor(() => {
    expect(result.current.replace(/\s+/g, ' ').trim()).toEqual(expectedHtml);
  });
});
  test("should return an not data found", async () => {
    getFetchApi.mockResolvedValue({content: ""});
    const {result} = renderHook(() => useGetArticleDetail());
    await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith("Aucune donnée trouvé dans le code source.");
        expect(result.current).toEqual(null)
    })
    
  })
  test("should return an error is getFetchApi error", async () => {
    getFetchApi.mockRejectedValue(new Error("Mock error"));
    const {result} = renderHook(() => useGetArticleDetail());
    await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith("Une erreur est survenue:", "Mock error");
        expect(result.current).toEqual(null)
    })
  })

})

const HookComponent = () => {
  const [tools, setTools] = useState([
    { name: "u", value: false },
    { name: "strong", value: false },
  ]);
  useSelectionChange(setTools);
  return null;
};

const simulateSelection = () => {
  // Création du <u>
  const target = document.createElement("u");
  target.setAttribute("data-testid", "target");
  target.textContent = "underlined text";
  document.body.appendChild(target);

  const textNode = target.firstChild;

  // Créer un range réel et le configurer
  const range = document.createRange();
  range.setStart(textNode, 0);
  range.setEnd(textNode, textNode.length);

  // Mocker correctement getSelection pour retourner ce range
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  // Si tu mocks getRangeAt, tu dois aussi configurer startContainer
  mockRange.startContainer = textNode;
  mockRange.commonAncestorContainer = textNode;
  mockSelection.getRangeAt.mockReturnValue(mockRange);
};

describe("isInsideTag", () => {
  it("should return true when inside a <u> tag", () => {
    const u = document.createElement("u");
    const span = document.createElement("span");
    u.appendChild(span);
    document.body.appendChild(u);

    expect(isInsideTag(span, "u")).toBe(true);
  });

  it("should return false when not inside the specified tag", () => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    div.appendChild(span);
    document.body.appendChild(div);

    expect(isInsideTag(span, "u")).toBe(false);
  });

  it("should work even when node is deeply nested", () => {
    const u = document.createElement("u");
    const div = document.createElement("div");
    const span = document.createElement("span");
    div.appendChild(span);
    u.appendChild(div);
    document.body.appendChild(u);

    expect(isInsideTag(span, "u")).toBe(true);
  });

  it("should return false if node is null", () => {
    expect(isInsideTag(null, "u")).toBe(false);
  });

  it("should return true if the node itself is the tag", () => {
    const u = document.createElement("u");
    document.body.appendChild(u);
    expect(isInsideTag(u, "u")).toBe(true);
  });
});

describe("useSelectionChange", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    updateTools.mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("should detect <u> tag and call updateTools with true", async () => {
    const html = `
      <div contenteditable="true">
        <u data-testid="target">underlined</u>
      </div>
    `;

    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);
    render(<HookComponent />);

    act(() => {
      simulateSelection('[data-testid="target"]');
      document.dispatchEvent(new Event("selectionchange"));
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(updateTools).toHaveBeenCalledWith("u", true, expect.any(Function));
      expect(updateTools).toHaveBeenCalledWith("b", false, expect.any(Function));
      expect(updateTools).toHaveBeenCalledWith("strike", false, expect.any(Function));
      expect(updateTools).toHaveBeenCalledWith("i", false, expect.any(Function));
      expect(updateTools).toHaveBeenCalledWith("h1", false, expect.any(Function));
      expect(updateTools).toHaveBeenCalledWith("h2", false, expect.any(Function));
    });
  });

  it("should return an warning if no node selected", async () => {
    jest.spyOn(console, "warn").mockImplementation(() => {})
    const container = document.createElement("div");
    container.innerHTML = null;
    document.body.appendChild(container);
    render(<HookComponent />);

    act(() => {
      simulateSelection('[data-testid="target"]');
      mockRange.startContainer = null;
      document.dispatchEvent(new Event("selectionchange"));
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(console.warn).toHaveBeenCalledWith("No startContainer in range");
      expect(updateTools).not.toHaveBeenCalledWith("u", false, expect.any(Function));
    });
  })
});

describe('ListDropdown', () => {
  it('should return "ol" if selection is inside a <ol>', () => {
    // Mock the DOM
    const ul = document.createElement('ol');
    const li = document.createElement('li');
    const textNode = document.createTextNode('Item 1');

    li.appendChild(textNode);
    ul.appendChild(li);
    document.body.appendChild(ul);

    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, textNode.length);
    mockSelection.focusNode = textNode

    const tools = [
      { value: 'ul', label: 'List' },
      { value: 'ol', label: 'Numbered List' }
    ];

    const result = ListDropdown(tools);
    expect(result).toBe('ol');
  });

  it('should return undefined if no matching tag is found', () => {
    const p = document.createElement('p');
    const textNode = document.createTextNode('Hello');
    p.appendChild(textNode);
    document.body.appendChild(p);

    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, textNode.length);

     mockSelection.focusNode = textNode

    const tools = [
      { value: 'ul', label: 'List' },
      { value: 'ol', label: 'Numbered List' }
    ];

    const result = ListDropdown(tools);
    expect(result).toBeUndefined();
  });
});

describe("AlignDropDown", () => {
  test("should return 'center' if selection is in a <p align='center'>", () => {
    // Crée un élément <p align="center">
    const p = document.createElement('p');
    p.setAttribute("align", "center");
    const textNode = document.createTextNode('Hello');
    p.appendChild(textNode);
    document.body.appendChild(p);

    // Crée une sélection autour de "Hello"
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, textNode.length);

    mockSelection.focusNode = textNode


    // Assertion
    const result = AlignDropDown();

    // Vérification
    expect(result).toBe("center");
  });

   test("should return 'right' if selection is in element with style.textAlign = 'right'", () => {
    const div = document.createElement("div");
    div.style.textAlign = "right";
    const textNode = document.createTextNode("Aligned text");
    div.appendChild(textNode);
    document.body.appendChild(div);

    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, textNode.length);

    mockSelection.focusNode = textNode

    const result = AlignDropDown();
    expect(result).toBe("right");
  });

  test("should return 'left' if no align or style found", () => {
    const span = document.createElement("span");
    const textNode = document.createTextNode("No align here");
    span.appendChild(textNode);
    document.body.appendChild(span);

    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, textNode.length);

    
    mockSelection.focusNode = textNode

    const result = AlignDropDown();
    expect(result).toBe("left");
  });
});