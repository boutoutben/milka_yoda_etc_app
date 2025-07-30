import { useEffect, useState } from "react";
import axios from "axios";

async function encryptData(data) {
    const response = await axios.post("http://localhost:5000/api/encrypt/encryptData", {
        data: data
    }, {
        withCredentials: true
    });
    return response.data;
}

export default encryptData;