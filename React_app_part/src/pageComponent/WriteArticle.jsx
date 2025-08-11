import '@fortawesome/fontawesome-free/css/all.min.css'; 
import './../css/writeArticle.css'
import { useEffect, useRef, useState } from 'react';
import { ColorPicker, Text, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'
import MainBtn from '../components/mainBtn';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import getFetchApi from '../utils/getFetchApi';
import { AlignDropDown, ArticleCancelle, ArticleRegister, Dropdown, EditColor, format, handlePaste, ListDropdown, toggleTagOnSelection, useGetArticleDetail, useSelectionChange } from '../handles/WriteArticle';



    

    
const WriteArticle = () => {
  const {id} = useParams();
  
 const articleData = useGetArticleDetail()
  const navigate = useNavigate();
  const editorRef = useRef(null);
  const editorRef2 = useRef(null);

  const [tools, setTools] = useState([
    {name: "b", value: false, spanClass: "fa fa-bold fa-fw", format:'bold'},
    {name: "i", value: false, spanClass: "fa fa-italic fa-fw",format:'italic'},
    {name: "u", value: false, spanClass: "fa-solid fa-underline", format:'underline'},
    {name: "h1", value: false, title:'titre', format:null},
    {name: "h2", value: false, title:'sous-titre', format:null},
    {name: "strike", value: false, spanClass: "fa-solid fa-strikethrough", format:'strikeThrough'}
  ]);

    useEffect(() => {
        if (editorRef.current && articleData) {
          editorRef.current.innerHTML = articleData;
        }
      }, [articleData]);

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

      useSelectionChange(setTools);
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
                  nodeCode={() => ListDropdown(tools)}
                />
                <Dropdown
                  editorRef={editorRef}
                  options={alignOption}
                  nodeCode={AlignDropDown}
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
                <ArticleCancelle navigate={navigate} />
                <ArticleRegister editorRef={editorRef} navigate={navigate}/>
            </div>
        </main>
    );
};


export default WriteArticle;
