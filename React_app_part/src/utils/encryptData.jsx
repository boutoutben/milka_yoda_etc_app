
import axios from "axios";

async function encryptData(data) {
    try {
        const response = await axios.post("http://localhost:5000/api/encrypt/encryptData", {
            data: data
        }, {
            withCredentials: true
        });
        return response.data;   
    } catch (err) {
        console.error('Une erreur est survenue: ', err.message)
    }
    
}

export default encryptData;