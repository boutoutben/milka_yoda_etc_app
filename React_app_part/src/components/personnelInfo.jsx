import AppSection from "./AppSection";
import '../css/component.css'
import PropTypes from "prop-types";

const PersonnelInfo = ({formik, btn, message}) => {
    return (
        <AppSection 
            id={"personnalInfo"}
            title={"Info personnelle"}
            content={
                <>
                    {message && <h4 className='userMessage'>{message}</h4>}
                    <div className='flex-row'>
                        <div>
                            <select
                                data-testid="civility"
                                name="civility"
                                value={formik.values.civility}
                                onChange={formik.handleChange}
                                >
                                <option value="">-- Sélectionnez une civilité --</option>
                                <option value="1">Monsieur</option>
                                <option value="2">Madame</option>
                                <option value="3">Autre</option>
                            </select>
                            {formik.touched.civility && formik.errors.civility && (
                                <div className="formError">{formik.errors.civility}</div>
                            )} 
                        </div>
                        <div>
                            <input type="text" name="lastname" placeholder='Nom*' value={formik.values.lastname} onChange={formik.handleChange} />
                            {formik.touched.lastname && formik.errors.lastname && (
                                <div className="formError">{formik.errors.lastname}</div>
                            )}   
                        </div>
                        </div>
                        <div className="flex-row">
                            <div>
                                <input type="text" name="firstname" placeholder='Prénom*' value={formik.values.firstname} onChange={formik.handleChange} /> 
                                {formik.touched.firstname && formik.errors.firstname && (
                                    <div className="formError">{formik.errors.firstname}</div>
                                )}    
                            </div>
                            <div>
                                <input type="number" placeholder='age' name='age' value={formik.values.age} onChange={formik.handleChange} /> 
                                {formik.touched.age && formik.errors.age && (
                                    <div className="formError">{formik.errors.age}</div>
                                )}     
                            </div> 
                        </div>
                        <div className="flex-row">
                            <div>
                                <input type="text" name="adressePostale" placeholder='Code postal*' value={formik.values.adressePostale} onChange={formik.handleChange} />  
                                {formik.touched.adressePostale && formik.errors.adressePostale && (
                                    <div className="formError">{formik.errors.adressePostale}</div>
                                )}    
                            </div>
                            <div>
                                <input type="text" name="phone" placeholder='Téléphone*' value={formik.values.phone} onChange={formik.handleChange} /> 
                                {formik.touched.phone && formik.errors.phone && (
                                    <div className="formError">{formik.errors.phone}</div>
                                )}    
                            </div>
                            
                        </div>
                        <div className='flex-row'>
                            <div>
                                <input type="text" name="email" placeholder='Email*' value={formik.values.email} onChange={formik.handleChange} />
                                {formik.touched.email && formik.errors.email && (
                                    <div className="formError">{formik.errors.email}</div>
                                )}     
                            </div>
                            
                        </div>
                </>
            }
            nameBtn={btn}
            isSubmit={true}
        />
    )
}

PersonnelInfo.propTypes = {
    formik: PropTypes.shape({
        values: PropTypes.object.isRequired,
        touched: PropTypes.bool.isRequired,
        errors: PropTypes.object.isRequired,
        handleChange: PropTypes.func.isRequired
    }).isRequired,
    btn: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
}

export default PersonnelInfo;