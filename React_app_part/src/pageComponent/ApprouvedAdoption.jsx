import { useParams } from "react-router-dom";
import { useState } from "react";
import HorizontaleLine from "../components/horizontaleLine";
import { ApprouvedBtn, RenderAlertBox, useFetchData } from "../handles/ApprouvedAdoption";
import { Sumary } from "../handles/Sumary";



const ApprouvedAdoption = () => {
    const {id} = useParams();
    const data = useFetchData(id)
    const [alert, setAlert] = useState(null);
    if(!data) return <p>Chargement ...</p>
    return (
        <Sumary
            sumaryData={data}
            extension={
                <>
                    <RenderAlertBox alert={alert} setAlert={setAlert} />
                    <HorizontaleLine />
                    <ApprouvedBtn data={data} setAlert={setAlert}/>
                </>
             }
        />
        
    )
}

export default ApprouvedAdoption;