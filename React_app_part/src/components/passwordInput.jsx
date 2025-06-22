import { useState } from "react";
import '../css/component.css'
import PropTypes from "prop-types";

const PasswordInput = ({ name, formik, placeholder }) => {
    const [showPassword, setShowPassword] = useState(false);
  
    return (
      <div>
        <div className="flex-row alignCenter-AJ relative">
            <input
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            name={name}
            value={formik.values[name]} 
            onChange={formik.handleChange}
            />
            <button type="button" className="unstyled-button password-eye" onClick={() => setShowPassword(!showPassword)}><span className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} eye`}></span></button>   
        </div>
        
  
        {formik.touched[name] && formik.errors[name] && (
          <div className='formError'>{formik.errors[name]}</div>
        )}
      </div>
    );
  };

  PasswordInput.propTypes = {
    name: PropTypes.string.isRequired,
    formik: PropTypes.shape({
      values: PropTypes.object.isRequired,
      handleChange: PropTypes.func.isRequired,
      touched: PropTypes.bool.isRequired,
      errors: PropTypes.object.isRequired
    }).isRequired,
    placeholder: PropTypes.string.isRequired
  }

  export default PasswordInput;