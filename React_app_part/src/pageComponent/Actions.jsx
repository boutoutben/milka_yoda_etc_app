import { useNavigate } from "react-router-dom";
import "./../css/action.css"
import getFetchApi from "../utils/getFetchApi";
import uploadsImgUrl from "../utils/uploadsImgUrl";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import {closestCorners, DndContext} from '@dnd-kit/core'
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities";
import ChooseFile from "../components/chooseFile";
import MainBtn from "../components/mainBtn";
import FloatFormField from "../components/floatFormField";
import AreYouSure from "../components/areYouSure";
import { Action, AddActionForm, changeOrderClick, EditActionForm, handleDragEnd } from "../handles/actions";
import isGranted from "../utils/isGranted";
import toggleAtIndex from "../utils/toggleAtIndex";
import useIsGrandted from "../hook/useIsgranted";

const Actions = () => {
    const [canAdd, setAdd] = useState(false);
    const [actions, setActions] = useState(null);
    const granted = useIsGrandted("ADMIN_ROLE")
    useEffect(() => {
            getFetchApi("action")
                .then(data => {
                    setActions(data.actions);
                })
                .catch(err => {
                    console.error(err);
                })
        }, []);
    const [canEditArray, setCanEditArray] = useState([]);
    const [canDeleteArray, setDeleteArray] = useState(false);
    const [saving, setSaving] = useState(false);
    useEffect(() => {
        if (actions) {
            setCanEditArray(new Array(actions.length).fill(false));
            setDeleteArray(new Array(actions.length).fill(false));
        }
    }, [actions]);

    const toggleEdit = (index) => toggleAtIndex(canEditArray, setCanEditArray, index);
    const toggleDelete = (index) => toggleAtIndex(canDeleteArray, setDeleteArray, index);

    
        
    if(!actions) return <p>Chargement...</p>

    return (
        <main id="actionPage">
            <h1>Toutes nos actions</h1>
            
            {granted && (
                <div className="addAction">
                    <MainBtn name={"Ajouter une action"} click={() => setAdd(true)} className={"btnInMain"} />
                    {canAdd && (
                        <FloatFormField isTop={true} setter={() => setAdd(false)} action={"Ajouter une action"} content={
                                <AddActionForm />
                        } />
                    )}
                </div>
                
            )}
            <DndContext onDragEnd={(event) => handleDragEnd(actions, setSaving, setActions, event)} collisionDetection={closestCorners}>
                <SortableContext  items={actions} strategy={verticalListSortingStrategy}>
                    <div className="flex-column row-gap-15">
                        {actions.map((action, index) => (
                            <div key={action.id} className="relative">
                                <Action id={action.id} title={action.title} src={uploadsImgUrl(action.imgName)} alt="cc" 
                                    text={action.description} isAdmin={granted} editClick={() =>toggleEdit(index)} supClick={() => toggleDelete(index)}
                                    asBtn={action.pageUrl == "" && null} btnClick={action.pageUrl} granted={granted}
                                />  
                                {canEditArray[index] && (
                                    <FloatFormField setter={() =>toggleEdit(index)} action={"Modifier l'action"} content={
                                        
                                        <EditActionForm action={action} />
                                    } />
                                )}
                                {canDeleteArray[index] && (
                                    <AreYouSure setter={() => toggleDelete(index)} apiUrl={`action/delete/${action.id}`} />                
                                )} 
                            </div>
                            
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            {granted &&<MainBtn name={"Enregistrer la nouvelle dispositon des actions"} disabled={!saving} click={() => changeOrderClick(actions)} /> }
        </main>
    )
}

export default Actions;