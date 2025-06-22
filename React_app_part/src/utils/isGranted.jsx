import getFetchApi from "./getFetchApi";

async function isGranted(roleName) {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            console.warn("❌ Token absent ou expiré");
            return false;
        }

        const data = await getFetchApi("user/getRole", {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (!data || data.error) {
            console.warn("❌ Erreur côté serveur :", data?.error);
            return false;
        }

        return data.role[0].roleName === roleName;
    } catch (e) {
        console.error("❌ Erreur dans isGranted :", e.message);
        return false;
    }
}

export default isGranted;