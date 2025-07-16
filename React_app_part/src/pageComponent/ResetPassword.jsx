import { useNavigate } from "react-router-dom"
import { ResetPasswordSection, useGetResetPasswordMessage } from "../handles/ResetPassword";

const ResetPassword = () => {
    
    const message = useGetResetPasswordMessage();
    const navigation = useNavigate();
    

    return(
        <main>
            {message=="Can reset password" ? (
                <ResetPasswordSection navigation={navigation} />
            ): 
            (
              <h4 className="formError flex-column alignCenter-AJ">Votre permission est expirés ou votre ne l'avez pas</h4>
            )}
            
        </main>
    )
}

export default ResetPassword;