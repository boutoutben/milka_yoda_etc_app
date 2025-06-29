import '../css/adminSpace.css'

import Logout from "../components/logout";
import { AskForAdoption, BanUser } from "../handles/AdminSpace";



const AdminSpace = () => {
    return (
        <main>
            <Logout message={"Space admin"}/>
            <AskForAdoption />
            <BanUser />
        </main>
    )
}

export default AdminSpace;