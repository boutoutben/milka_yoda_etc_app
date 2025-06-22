import PropTypes from "prop-types";
import DeleteElement from "./deleteElement";
import EditElement from "./editElement";
import MainBtn from "./mainBtn";
import isGranted from "../utils/isGranted";
import '../css/component.css'

const AppSection = ({id, title, content, nameBtn, sectionClick, click,isSubmit=false, editAndSup, onEdit, onDelete, ref, attributes, listeners, style}) => {
    const granted = isGranted("ADMIN_ROLE");
    return (
        <section ref={ref} style={style} data-testid={id} onClick={sectionClick} id={id} className='welcomeSection flex-column'>
            {granted && attributes && listeners && (
                 <span
                {...attributes}
                {...listeners}
                className='flex-column alignCenter-AJ attriAndList'
            >
                <img src='/img/grabImg.png' alt="cc" />
            </span>
            )}
           {title && (
                <div className='flex-row alignCenter-AJ relative welcomeTitle'>
                    {title && <h2>{title}</h2>}
                    {editAndSup && granted === true && (
                        <>
                            <EditElement onEdit={onEdit} />
                            <DeleteElement onDelete={onDelete} />
                        </>
                        )}
                </div>
           )}
           
            <div className='contentDiv flex-column relative'>
                {content}
            </div>
            {nameBtn && <MainBtn name={nameBtn} className='btnInMain' click={click} isSubmit={isSubmit}/>}
        </section>
        
    )
}

AppSection.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    content: PropTypes.func,
    nameBtn: PropTypes.string,
    sectionClick: PropTypes.func,
    click: PropTypes.func,
    isSubmit: PropTypes.bool,
    editAndSup: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    ref: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]),
    attributes: PropTypes.object,
    listeners: PropTypes.object,
    style: PropTypes.object,
}



export default AppSection;