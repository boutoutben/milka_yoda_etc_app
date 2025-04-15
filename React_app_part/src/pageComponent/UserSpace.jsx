import '../css/userSpace.css'
import { Logout } from "./Component";

const UserSpace = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInformation"));
  return (
    <main>
      <Logout message={`Bienvenue, ${userInfo.firstname || "Utilisateur"}`} />
    </main>
  );
};

export default UserSpace;