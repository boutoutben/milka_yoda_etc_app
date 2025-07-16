import { useEffect, useState } from "react";
import isGranted from "../utils/isGranted";

const useIsGrandted = (role) => {
    const [granted, setGranted] = useState(false);
    useEffect(() => {
        async function checkSomething() {
           const granted = await isGranted(role);
           setGranted(granted);
        }
        checkSomething();    
    }, []);
    return granted;
}

export default useIsGrandted;