import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const SearchBar = ({elements, setFiltered, searchTerm, setSearchTerm, fieldName}) => {
     useEffect(() => {
            if (elements) {
                if (searchTerm !== '') {
                    const filtered = elements.filter((element) =>
                      element[fieldName]?.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    setFiltered(filtered);
                } else {
                    setFiltered(elements);
                  }   
            }
           
          }, [elements, searchTerm, fieldName, setFiltered]);
    return(
        <div className="search-container" data-testid="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input type="search" placeholder="Rechercher..." onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>
    )
}

SearchBar.propTypes = {
    elements: PropTypes.array,
    setFiltered: PropTypes.func,
    searchTerm: PropTypes.string,
    setSearchTerm: PropTypes.func,
    fieldName: PropTypes.string
}

export default SearchBar