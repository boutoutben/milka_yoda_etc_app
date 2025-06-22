import { useEffect, useRef, useState } from "react";
import { faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../css/component.css'
import PropTypes from "prop-types";

const CustomSelect = ({data, formik, name, selectValues, searchBar}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValue, setFilterValue] = useState(data);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
        const filtered = Object.values(data).filter(race =>
            race.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilterValue(filtered);
    }, [searchTerm, data]);

    const filteredName = filterValue
    .filter(values => selectValues.includes(values._id))
    .map(values => values.name);
    const displayText =  filteredName.length > 0
    ? filteredName.join(', ')
    : 'Select options';
  return (
    <div className={` custom-select ${isOpen && "isOpen"}`} ref={containerRef}>
        <button
  type="button"
  data-testid={`${name}-select`}
  className="select-box  flex-row alignCenter-AJ "
  onClick={toggleDropdown}
  aria-haspopup="listbox" // Optional: improves screen reader context
>
  {displayText}
  <FontAwesomeIcon icon={faChevronDown} className="chevron-down-icon" />
</button>
        
      {isOpen && (
        <>
        {searchBar && (
            <div className="search-container relative">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input data-testid="select-search-bar" type="search" placeholder="Rechercher..." onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>    
        )}
        <div
          className="options-container"
        >
          {filterValue.map((option) => (
            <div data-testid={"custom-select-option"} key={option._id} className="option">
              <label className="checkbox">
                {option.name}
                <input
                  type="checkbox"
                  data-testid={`${name}-${option._id}`}
                  value={String(option._id)}
                  checked={formik.values[name]?.includes(String(option._id))}
                  onChange={async (e) => {
                    const value = e.target.value;
                    const currentValues = selectValues;
                    const newValuesSet = new Set(currentValues);

                    if (newValuesSet.has(value)) {
                      newValuesSet.delete(value); // Uncheck
                    } else {
                      newValuesSet.add(value); // Check
                    }

                    await formik.setFieldValue(name, Array.from(newValuesSet));
                  }}
                />
                <span className="check"></span>
                </label>
            </div>
          ))}
          
        </div>
        </>
      )}
      
    </div>
  );
};

CustomSelect.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  formik: PropTypes.shape({
    setFieldValue: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  selectValues: PropTypes.array.isRequired,
  searchBar: PropTypes.bool.isRequired,
};

export default CustomSelect
