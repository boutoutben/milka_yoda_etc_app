import PropTypes from 'prop-types';
import '../css/component.css'

const ChooseFile = ({formik}) => {
    return (
        <div className='chooseFile'>
            <input
                type="file"
                name="file"
                id="file"
                data-testid="mock-file-select-btn"
                onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (!file) {
                        console.error("no file");
                        return; // ← Empêche l'appel inutile
                    }
                    formik.setFieldValue("file", file);
                }}
            />
            <label htmlFor="file">Choisir un fichier</label>
        </div>
    );
};


ChooseFile.propTypes = {
    formik: PropTypes.shape({
      setFieldValue: PropTypes.func.isRequired,
    }).isRequired,
  };

export default ChooseFile;