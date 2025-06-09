import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './../css/writeArticle.css'
import { use, useEffect, useRef, useState } from 'react';

import { ColorPicker, Text, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'
import { MainBtn } from './Component';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getFetchApi } from './App';

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
          <div className="editColor flex-column alignCenter-AJ row-gap-15">
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
    document.execCommand(command, false, option);
};




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
                <ul className="dropdown-menu">
                    {options.map((option) => (
                        <li
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
 const WriteArticle = () => {
    const {id} = useParams();
    const [articleData, setArticleData] = useState(null);
    const [tools, setTools] = useState([
      {name: "strong", value: false, spanClass: "fa fa-bold fa-fw", format:'bold'},
      {name: "i", value: false, spanClass: "fa fa-italic fa-fw",format:'italic'},
      {name: "u", value: false, spanClass: "fa-solid fa-underline", format:'underline'},
      {name: "h1", value: false, title:'titre', format:null},
      {name: "h2", value: false, title:'sous-titre', format:null},
      {name: "strike", value: false, spanClass: "fa-solid fa-strikethrough", format:'strikeThrough'}
    ]);
    const updateTools = (name, value) => {
      setTools(prev =>
        prev.map(el => el.name === name ? { ...el, value } : el)
      );
    };
   
    const navigate = useNavigate();
    useEffect(() => {
            getFetchApi(`articles/detail/${id}`)
            .then(data => {
                if(data) {
                  const returnContent = data.content.match(/return\s*\(\s*([\s\S]*?)\s*\)[;\n]/);
                  if (returnContent) {
                      let articleData = returnContent[1];
                      setArticleData(convertStyleToHtml(articleData.replace(/<>\s*|\s*<\/>/g, '')));
                  } else {
                      console.error('Aucun return trouvé dans le code source.');
                  }  
                }
                
            })
                .catch(err => {
                    console.error(err);
                });
        }, []); 
    const editorRef = useRef(null);
    const editorRef2 = useRef(null);
    

    const alignOption = [
        { value: 'left', icon: 'fa-align-left', action: 'justifyLeft' },
        { value: 'center', icon: 'fa-align-center', action: 'justifyCenter' },
        { value: 'right', icon: 'fa-align-right', action: 'justifyRight' }
    ];

    const listeOptions = [
        { value: 'ol', icon: 'fa-solid fa-list-ol', action:"insertOrderedList" },
        {value: "ul", icon: 'fa-solid fa-list', action: "insertUnorderedList"}
    ]

    useEffect(() => {
        if (editorRef.current) editorRef.current.setAttribute('contenteditable', 'true');
        if (editorRef2.current) editorRef2.current.setAttribute('contenteditable', 'true');
    }, []);

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
      
    const setDivClass = () => {
        const editor = editorRef.current;
        if (!editor) return;

        const divs = editor.querySelectorAll("div");
        divs.forEach(div => {
            const isEmpty = div.innerHTML.trim() === '' || div.textContent.trim() === '';
        
            if (isEmpty) {
                div.classList.add("emptyDiv");   
            }
          });
    }

    const handlePaste = (e) => {
        e.preventDefault();
      
        // Get plain text from clipboard
        const text = (e.clipboardData || window.clipboardData).getData('text');
      
        // Insert plain text at cursor
        document.execCommand('insertText', false, text);
      };

    const getContent = () => {
        setDivClass();
        const content = convertStyleToReact(editorRef.current.innerHTML);
        
        if(content) return content.replace(/<br\s*\/?>/gi, '');
      };
      

      function toggleTagOnSelection(tagName, tagFormat) {
        const selection = window.getSelection();
        if (!selection.rangeCount || selection.isCollapsed) return;
      
        const range = selection.getRangeAt(0);
      
        // Vérifie si la sélection est dans une balise tagName
        let node = selection.focusNode;
        let insideTag = false;
        while (node) {
          if (node.nodeType === Node.ELEMENT_NODE && node.nodeName.toLowerCase() === tagName.toLowerCase()) {
            insideTag = true;
            break;
          }
          node = node.parentNode;
        }
        if(tagFormat === null) {
          if (insideTag) {
            // Désenvelopper : remplacer la balise tagName par son contenu
            const tagElement = node;
            const parent = tagElement.parentNode;
        
            while (tagElement.firstChild) {
              parent.insertBefore(tagElement.firstChild, tagElement);
            }
            parent.removeChild(tagElement);
        
          } else {
            // Envelopper la sélection dans la balise tagName
            const newElement = document.createElement(tagName);
            try {
              const content = range.extractContents();
              newElement.appendChild(content);
              range.insertNode(newElement);
        
              // Re-sélectionner le contenu dans la nouvelle balise
              selection.removeAllRanges();
              const newRange = document.createRange();
              newRange.selectNodeContents(newElement);
              selection.addRange(newRange);
            } catch (e) {
              console.error(e);
            }
          } 
        }
        else{
          console.log("cc")
          format(tagFormat);
        }
        
      }
    
    const handleArticleCancelle = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/articles/cancelle/${id}`,
                {},
                { withCredentials: true }
            ).then(response => {
                console.log(response);
                navigate(response.data.url);
            })
            }  catch (err) {
            console.error("Erreur lors de l'envoi :", err);
            } 
    }
    const handleArticleRegister =  async () => {
        const content = getContent();
        try {
            await axios.post(
                `http://localhost:5000/api/articles/edit/${id}`,
                {content},
                { withCredentials: true }
            ).then(response => {
                navigate(`/article/${id}`)
            })
            }  catch (err) {
            console.error("Erreur lors de l'envoi :", err);
            } 
    }
    useEffect(() => {
        if (editorRef.current && articleData) {
          editorRef.current.innerHTML = articleData;
        }
      }, [articleData]);

      useEffect(() => {
        let debounceTimer = null;
      
        const handleSelectionChange = () => {
          if (debounceTimer) clearTimeout(debounceTimer);
      
          debounceTimer = setTimeout(() => {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
      
            const range = selection.getRangeAt(0);
      
            const isInsideTag = (tag) => {
              let node = range.commonAncestorContainer;
              while (node) {
                if (node.nodeName === tag) return true;
                node = node.parentNode;
              }
              return false;
            };
      
            updateTools('u', isInsideTag('U'));
            updateTools('strong', isInsideTag('STRONG'));
            updateTools('strike', isInsideTag("STRIKE"));
            updateTools('i', isInsideTag('I'));
            updateTools("h1", isInsideTag("H1"));
            updateTools("h2", isInsideTag("H2"))
          }, 300);
        };
      
        document.addEventListener('selectionchange', handleSelectionChange);
      
        return () => {
          document.removeEventListener('selectionchange', handleSelectionChange);
          if (debounceTimer) clearTimeout(debounceTimer);
        };
      }, []);
    return (
        <main id='writeArticle'>
            <div className=" flex-row sample-toolbar" >
                <button onClick={() => format("undo")}>
                  <span className='fa-solid fa-rotate-left'></span>
                </button>
                <button onClick={() => format("redo")}>
                  <span className='fa-solid fa-rotate-right'></span>
                </button>
                {tools.map((tool) => (
                  <button key={tool.name} onClick={() => toggleTagOnSelection(tool.name, tool.format)} className={tools.find(el => el.name === tool.name && el.value) ? 'editorCheck' : ''}>
                    {tool.spanClass && <span className={tool.spanClass}></span>}
                    {tool.title && <span>{tool.title}</span>}
                  </button>
                ))}
                <Dropdown
                  editorRef={editorRef}
                  options={listeOptions}
                  nodeCode={() => {
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
                        const match = listeOptions.find(option => option.value === tag);
                        if (match) {
                          return tag;
                        }
                      }

                      node = node.parentNode // <== important ! pour éviter une boucle infinie
                    }
                  }}
                />
                <Dropdown
                  editorRef={editorRef}
                  options={alignOption}
                  nodeCode={() => {
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
                  }}
                />  
                <EditColor editColorRef={editorRef}/>
            </div>

            <div
              className="editor"
              ref={editorRef}
              id="sampleeditor"
              contentEditable
              spellCheck={false}
              onPaste={handlePaste}
            ></div>
            <div className="flex-row gap-25">
                <MainBtn name={"Anuller"} click={handleArticleCancelle} />
                <MainBtn name={"Enregistrer"} click={handleArticleRegister} />
            </div>
        </main>
    );
};


export default WriteArticle;
