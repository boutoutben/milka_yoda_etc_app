import getFetchApi from "./getFetchApi";

async function isGranted(roleName) {
  try {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") {
      return false;
    }
    const response = await getFetchApi("user/getRole", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      return false; // Pas d’erreur affichée dans console
    }

    return response.role[0].roleName === roleName;
  } catch (err) {
    console.error("Erreur dans isGranted :", err.message)
    return false; // silence côté console
  }
}

export default isGranted;