import { useEffect, useState } from "react";
import getFetchApi from "../utils/getFetchApi";

const useGetPublicKey = () => {
    const [publicKey, setPublicKey] = useState(null);
    useEffect(() => {
        getFetchApi("encrypt/public-key")
        .then(data => {
            setPublicKey(data)
        }) 
        .catch(err => {
            console.error("Une erreur est survenue:", err.message);
        })
    }, []);

    return publicKey;
}

export default useGetPublicKey;