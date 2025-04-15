import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SessionManager = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const expiration = localStorage.getItem("tokenExpiration");
        console.log(expiration);
        if (expiration) {
            const expirationDate = new Date(expiration);

            if (Date.now() > expirationDate.getTime()) {
                localStorage.clear();
                navigate("/login");
            }
        }
    }, [navigate]);

    return null;
};

export default SessionManager;