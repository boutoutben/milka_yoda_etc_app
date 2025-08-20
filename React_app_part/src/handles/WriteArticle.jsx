import { ColorPicker, Text, MantineProvider } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import MainBtn from '../components/mainBtn';
import getFetchApi from '../utils/getFetchApi';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import updateTools from '../utils/updateTools';

const EditColor = ({ editColorRef }) => {
  const [color, setColor] = useState('rgb(0,0,0)');
  const [isOpen, setOpen] = useState(false);
  const wrapperRef = useRef(null); // référence pour détecter les clics extérieurs

  const changeSelectedTextColor = (color) => {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    if (!editColorRef.current.contains(range.commonAncestorContainer)) return;
    
    document.execCommand('insertHTML', false, `<span style="color: ${color};">${selection}</span>`);

    // Reset cursor
    selection.removeAllRanges();
    const newRange = document.createRange();
    newRange.collapse(false);
    selection.addRange(newRange);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <MantineProvider>
      <div ref={wrapperRef} className="chooseColor relative">
        <button onClick={() => setOpen(!isOpen)} className="flex-row alignCenter-AJ relative">
          <div className="flex-row alignCenter-AJ relative">
            A
            <span style={{ backgroundColor: color }} className="pickColor"></span>
          </div>
          <span className="fa-solid fa-chevron-down"></span>
        </button>

        {isOpen && (
          <div data-testid="editColor" className="editColor flex-column alignCenter-AJ row-gap-15">
            <ColorPicker
              format="rgb"
              swatchesPerRow={9}
              size="sm"
              value={color}
              onChange={(newColor) => {
                setColor(newColor);
                changeSelectedTextColor(newColor);
              }}
              swatches={[
                'rgb(0,0,0)', 'rgb(154,154,154)', 'rgb(255,45,0)', 'rgb(255,192,203)', 'rgb(160,32,240)',
                'rgb(0,0,139)', 'rgb(0,0,255)', 'rgb(173,216,230)',
                'rgb(1,50,32)', 'rgb(0,255,0)', 'rgb(144,238,144)', 'rgb(255,255,0)', 'rgb(255,165,0)'
              ]}
            />
            <div className="rgbColor flex-row">
              <p>RGB:</p>
              <input type="text" placeholder="r" />
              <input type="text" placeholder="g" />
              <input type="text" placeholder="b" />
            </div>
          </div>
        )}
      </div>
    </MantineProvider>
  );
};

const format = (command, option = null) => {
    try {
        document.execCommand(command, false, option);
    } catch (err) {
        console.error("Une erreur est survenue:", err.message);
    }
}
    

const Dropdown = ({ editorRef, options, nodeCode }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]?.value || "");
    const wrapperRef = useRef(null);
  
    const handleSelect = (option) => {
      if (editorRef?.current) editorRef.current.focus();
      setSelected(option.value);
      format(option.action);
      setOpen(false);
    };
  
    useEffect(() => {
      const handleSelectionChange = () => {
        const foundTag = nodeCode();
        if (foundTag) {
          setSelected(foundTag);
        }
      };
  
      const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
          setOpen(false);
        }
      };
    
        document.addEventListener("mousedown", handleClickOutside);
  
      document.addEventListener("selectionchange", handleSelectionChange);
      return () => {
        document.removeEventListener("selectionchange", handleSelectionChange);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [nodeCode]);
  
      return (
          <div ref={wrapperRef} className="dropdown relative">
              <button onClick={() => setOpen(!open)} className='flex-row alignCenter-AJ gap-15'>
                  <i className={`fa-solid ${options.find(o => o.value === selected)?.icon}`}></i>
                  <span className='fa-solid fa-chevron-down'></span>
              </button>
              {open && (
                  <ul data-testid="dropDownMenu" className="dropdown-menu">
                      {options.map((option) => (
                          <li 
                            data-testid="dropDownOption"
                            key={option.value}
                            onClick={() => handleSelect(option)}
                          >
                              <i className={`fa-solid ${option.icon}`}></i>
                          </li>
                      ))}
                  </ul>
              )}
          </div>
      );
  };

  const convertStyleToHtml = (jsx) => {
    return jsx.replace(/style=\{\{([^}]+)\}\}/g, (_, styleObjString) => {
      const styleEntries = [];
  
      // Expression pour trouver les paires "clé: 'valeur'" ou "clé: \"valeur\""
      const regex = /([\w$]+)\s*:\s*['"]([^'"]+)['"]/g;
      let match;
  
      while ((match = regex.exec(styleObjString)) !== null) {
        const [_, prop, value] = match;
        const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        styleEntries.push(`${cssProp}: ${value}`);
      }
  
      return `style="${styleEntries.join('; ')}"`;
    });
  };

    

    

    const convertStyleToReact = (html) => {
        return html.replace(/style="([^"]+)"/g, (_, styleString) => {
          const styleObj = styleString
            .split(';')
            .filter(Boolean)
            .map(rule => {
              const [prop, value] = rule.split(':').map(s => s.trim());
              const jsProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
              return `${jsProp}: '${value}'`;
            })
            .join(', ');
          return `style={{ ${styleObj} }}`;
        });
      };
      
    const setDivClass = (editorRef) => {
        const editor = editorRef.current;
        if (!editor) return;

        const divs = editor.querySelectorAll("div");
        divs.forEach(div => {
            const isEmpty = (
              div.innerHTML.trim() === '' ||
              div.innerHTML.trim() === '<br>' ||
              div.textContent.trim() === ''
            );
        
            if (isEmpty) {
                div.classList.add("emptyDiv");   
            }
          });
    }
    const handlePaste = (e) => {
        e.preventDefault();
      
        const text = (e.clipboardData || window.clipboardData).getData('text');
        // Insert plain text at cursor
        format("insertText", text);
      }

const getContent = (editorRef) => {
    if (!editorRef?.current?.innerHTML) return "";

    setDivClass(editorRef);

    const content = convertStyleToReact(editorRef.current.innerHTML);

    return content?.replace(/<br\s*\/?>/gi, '') || "";
  };

function toggleTagOnSelection(tagName, tagFormat) {
  const selection = window.getSelection();
  if (!selection.rangeCount || selection.isCollapsed) return;
 
  const range = selection.getRangeAt(0);
  const commonAncestor = range.commonAncestorContainer;
  let node = commonAncestor.nodeType === Node.ELEMENT_NODE
    ? commonAncestor
    : commonAncestor.parentNode;
  let insideTag = false;
  while (node && node !== document) {
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.nodeName.toLowerCase() === tagName.toLowerCase()
    ) {
      insideTag = true;
      break;
    }
    node = node.parentNode;
  }

  if (!tagFormat) {
    if (insideTag) {
      const parent = node.parentNode;
      if (!parent) return;
      while (node.firstChild) {
        parent.insertBefore(node.firstChild, node);
      }
      parent.removeChild(node);
    } else {
      const wrapper = document.createElement(tagName);
      const contents = range.extractContents();

      if (!contents?.hasChildNodes()) {
        console.warn("No content selected or invalid range.");
        return;
      }

      wrapper.appendChild(contents);
      range.insertNode(wrapper);
      // Repositionner la sélection
      const newRange = document.createRange();
      newRange.selectNodeContents(wrapper);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }
  } else {
    format(tagFormat); // Fallback execCommand
  }
}


      const ArticleCancelle = ({navigate}) => {
        const token = localStorage.getItem("token")
        const {id} = useParams();
        const handleArticleCancelle = async () => {
            try {
                await axios.post(
                    `http://localhost:5000/api/articles/cancelle/${id}`,
                    {},
                    {
                        withCredentials: true,
                        headers: { 
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }}
                ).then(response => {
                    navigate(response.data.url);
                })
            }  catch (err) {
              console.error("Erreur lors de l'envoi :", err.message);
            } 
        }
        return (
            <MainBtn name={"Anuller"} click={handleArticleCancelle} />
        )
    }

    const ArticleRegister = ({editorRef, navigate}) => {
      const {id} = useParams();
      const token = localStorage.getItem("token")
        const handleArticleRegister =  async () => {
            const content = getContent(editorRef);
            console.log(content)
            try {
                const formData = new FormData();
                formData.append('content', content);

                await axios.post(
                  `http://localhost:5000/api/articles/edit/${id}`,
                  formData,
                  {
                    withCredentials: true,
                    headers: {
                      'Authorization': `Bearer ${token}`
                      // ❌ Do NOT set Content-Type manually here
                    }
                  }
                ).then(() => {
                    navigate(`/article/${id}`);
                });
                }  catch (err) {
                console.error("Erreur lors de l'envoi :", err.message);
                } 
        }
        return (
             <MainBtn name={"Enregistrer"} click={handleArticleRegister} />
        )
    }

   const isInsideTag = (node, tag) => {
  tag = tag.toUpperCase();
  let current = node;
  while (current) {
    if (current.nodeType === Node.ELEMENT_NODE && current.nodeName === tag) {
      return true;
    }
    current = current.parentNode;
  }
  return false;
};

    const useGetArticleDetail = () => {
        const {id} = useParams();
        const [articleData, setArticleData] = useState(null);
        useEffect(() => {
            getFetchApi(`articles/detail/${id}`)
            .then(data => {
                if(data) {
                  const returnContent = data.content.match(/return\s*\(\s*([\s\S]*?)\s*\)[;\n]/);
                  if (returnContent) {
                      let articleData = returnContent[1];
                      setArticleData(convertStyleToHtml(articleData.replace(/<>\s*|\s*<\/>/g, '')));
                  } else {
                      console.error('Aucune donnée trouvé dans le code source.');
                  }  
                }
                
            })
                .catch(err => {
                    console.error("Une erreur est survenue:", err.message);
                });
        }, []); 

        return articleData
    }
    const useSelectionChange = (setTools) => {
  useEffect(() => {
    let debounceTimer = null;

    const handleSelectionChange = () => {
  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      console.warn("No selection or empty range");
      return;
    }

    const range = selection.getRangeAt(0);
    let node = range.startContainer;

    if (!node) {
      console.warn("No startContainer in range");
      return;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    

   updateTools("u", isInsideTag(node, "U"), setTools);
        updateTools("b", isInsideTag(node, "B"), setTools);
        updateTools("strike", isInsideTag(node, "STRIKE"), setTools);
        updateTools("i", isInsideTag(node, "I"), setTools);
        updateTools("h1", isInsideTag(node, "H1"), setTools);
        updateTools("h2", isInsideTag(node, "H2"), setTools);
  }, 300);
};

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, []);
};


        const ListDropdown = (tools) => {
            const selection = window.getSelection();
            if (!selection.rangeCount || selection.isCollapsed) return;

            let node = selection.focusNode;

            while (node) {
              if (node.nodeType === Node.TEXT_NODE) {
                node = node.parentNode; // remonter au parent élément
                continue;
              }

              if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.nodeName.toLowerCase();
                const match = tools.find(option => option.value === tag);
                if (match) {
                  return tag;
                }
              }

              node = node.parentNode // <== important ! pour éviter une boucle infinie
            }
          }

          const AlignDropDown = () => {
            const selection = window.getSelection();
            if (!selection.rangeCount || selection.isCollapsed) return;

            let node = selection.focusNode;

            while (node) {
              if (node.nodeType === Node.TEXT_NODE) {
                node = node.parentNode;
                continue;
              }

              // Pour les éléments HTML comme <p align="center">
              if (node.nodeType === Node.ELEMENT_NODE) {
                // Vérifie l’attribut `align` (ancien HTML) ou le style CSS
                if (node.hasAttribute?.("align")) {
                  return node.getAttribute("align");
                }

                const textAlign = node.style?.textAlign;
                if (textAlign) {
                  return textAlign;
                }
              }

              node = node.parentNode;
            }
            return 'left';
          }

export { EditColor, format, Dropdown, convertStyleToHtml, convertStyleToReact, setDivClass, handlePaste, getContent, toggleTagOnSelection, ArticleCancelle, ArticleRegister, useGetArticleDetail, isInsideTag, useSelectionChange, ListDropdown, AlignDropDown }