import '../css/component.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import ChooseFile from './chooseFile';
import CustomSelect from './customSelect';
import FloatFormField from './floatFormField';
import MainBtn from './mainBtn';
import getFetchApi from '../utils/getFetchApi';
import axios from 'axios';
import AddUpdateAnimalSchema from '../validationSchema/AddUpdateAnimalSchema';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';

const AddAnimals = ({ apiUrl, onReload = () => window.location.reload() }) => {
  const [races, setRaces] = useState([]);
  const [incompatibility, setIncompatibility] = useState([]);
  const [canAdd, setAdd] = useState(false);
  const token = localStorage.getItem("token")

  useEffect(() => {
    getFetchApi('adopt/races')
      .then((data) => {
        setRaces(data.races || []);
        setIncompatibility(data.incompatibility || []);
      })
      .catch((err) => console.error(err));
  }, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      sexe: '',
      file: '',
      animal: '',
      isSterile: '',
      races: [],
      born: '',
      incompatibility: [],
    },
    validationSchema: AddUpdateAnimalSchema(true),
    onSubmit: (values) => {
      const formData = new FormData();
      for (const key in values) {
        if (Array.isArray(values[key])) {
          formData.append(key, JSON.stringify(values[key]))
        } else {
          formData.append(key, values[key]);
        }
      }

      axios
        .post(`http://localhost:5000/api/${apiUrl}`, formData, {
          withCredentials: true,
          headers: { 
            'Content-Type': 'multipart/form-data',
             'Authorization': `Bearer ${token}`
          },
        })
        .then(() => onReload())
        .catch((error) => console.error(`Erreur lors de l'envoi: ${error.message}`));
    },
  });

  const updateRaces = useCallback(
    (species) => {
      if (formik.values.races.length > 0) {
        formik.setFieldValue('races', []);
      }
      getFetchApi(`adopt/races?species=${encodeURIComponent(species)}`)
        .then((data) => setRaces(data.races || []))
        .catch((err) => console.error(err));
    },
    [formik]
  );

  const previousAnimalRef = useRef(null);

  useEffect(() => {
    const currentAnimal = formik.values.animal;
    if (currentAnimal && currentAnimal !== previousAnimalRef.current) {
      previousAnimalRef.current = currentAnimal;
      updateRaces(currentAnimal);
    }
  }, [formik.values.animal, updateRaces]);

  const handleDateChange = (e) => {
    formik.handleChange(e);
  };

  return (
    <div className="relative">
      <MainBtn name="Ajouter un animal" className="btnInMain" click={() => setAdd(true)} />
      {canAdd && (
        <FloatFormField
          isTop={true}
          setter={() => setAdd(false)}
          action="Ajouter un animal"
          content={
            <form
              data-testid="addAnimals-form"
              onSubmit={formik.handleSubmit}
              className="flex-column alignCenter-AJ row-gap-15"
            >
              <table aria-hidden="true">
                <tbody>
                  <tr>
                    <td>Nom:</td>
                    <td>
                      <input
                        type="text"
                        name="name"
                        placeholder="Nom"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                      />
                    </td>
                  </tr>
                  {formik.touched.name && formik.errors.name && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.name}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td>Description:</td>
                    <td>
                      <textarea
                        name="description"
                        placeholder="description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                      />
                    </td>
                  </tr>
                  {formik.touched.description && formik.errors.description && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.description}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td><label htmlFor="sexe">Sexe:</label></td>
                    <td>
                      <select
                        id="sexe"
                        name="sexe"
                        value={formik.values.sexe}
                        onChange={formik.handleChange}
                      >
                        <option value="">Sélectionner un sexe</option>
                        <option value="1">Mâle</option>
                        <option value="2">Femelle</option>
                      </select>
                    </td>
                  </tr>
                  {formik.touched.sexe && formik.errors.sexe && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.sexe}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td><label htmlFor="sterile">Stérile:</label></td>
                    <td>
                      <select
                        id="sterile"
                        name="isSterile"
                        value={formik.values.isSterile}
                        onChange={formik.handleChange}
                      >
                        <option value="">Sélectionner une réponse</option>
                        <option value="0">Oui</option>
                        <option value="1">Non</option>
                      </select>
                    </td>
                  </tr>
                  {formik.touched.isSterile && formik.errors.isSterile && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.isSterile}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td>Date de naissance:</td>
                    <td>
                      <input
                        data-testid="born"
                        type="date"
                        name="born"
                        value={formik.values.born}
                        onChange={handleDateChange}
                      />
                    </td>
                  </tr>
                  {formik.touched.born && formik.errors.born && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.born}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td><label htmlFor="animal">Animal:</label></td>
                    <td>
                      <select
                        data-testid="animal-select"
                        name="animal"
                        id="animal"
                        value={formik.values.animal}
                        onChange={formik.handleChange}
                      >
                        <option value="">Choisir un animal</option>
                        <option value="chien">Chien</option>
                        <option value="chat">Chat</option>
                      </select>
                    </td>
                  </tr>
                  {formik.touched.animal && formik.errors.animal && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.animal}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td>Race(s):</td>
                    <td>
                      <CustomSelect
                        data={races}
                        formik={formik}
                        name="races"
                        selectValues={formik.values.races}
                        searchBar={true}
                      />
                    </td>
                  </tr>
                  {formik.touched.races && formik.errors.races && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.races}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td>Incompatibilité:</td>
                    <td>
                      <CustomSelect
                        data={incompatibility}
                        formik={formik}
                        name="incompatibility"
                        selectValues={formik.values.incompatibility}
                      />
                    </td>
                  </tr>
                  {formik.touched.incompatibility && formik.errors.incompatibility && (
                    <tr>
                      <td className="formError" colSpan={2}>
                        {formik.errors.incompatibility}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div>
                <ChooseFile formik={formik} />
                {formik.touched.file && formik.errors.file && (
                  <div className="formError">{formik.errors.file}</div>
                )}
              </div>

              <MainBtn name="Créer" isSubmit={true} className="btnInMain" />
            </form>
          }
        />
      )}
    </div>
  );
};

AddAnimals.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  onReload: PropTypes.func,
};

export default AddAnimals;