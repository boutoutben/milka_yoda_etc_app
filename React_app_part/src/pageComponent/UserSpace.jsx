import '../css/userSpace.css'
import Logout from '../components/logout';
import { useNavigate } from 'react-router-dom';
import { AdoptedAnimals, useGetPersonnelData, useGetUserAnimals, UserInfo } from '../handles/UserSpace';


const UserSpace = () => {
  const navigate = useNavigate();
  const personnelInfo = useGetPersonnelData();
  const animals = useGetUserAnimals(navigate);

  if(!personnelInfo) return <p>Chargement ...</p>
  
  return (
    <main id='userSpace'>
      <Logout message={`Bienvenue, ${personnelInfo.firstname || "Utilisateur"}`} />
      <UserInfo personnelInfo={personnelInfo} navigate={navigate} />
      <AdoptedAnimals animals={animals}  navigate={navigate}/>
    </main>
  );
};

export default UserSpace;