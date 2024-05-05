/* eslint-disable react/prop-types */
import { MdSearch } from "react-icons/md";

const Search = ({ handleSearchPlace }) => {
    return (
        <div className='search'>
            <MdSearch className="search-icons" size='1.3em'/>
            <input 
                onChange={(e) =>
                    handleSearchPlace(e.target.value)
                } 
                type="text" 
                placeholder="type to search..."
            />
        </div>
    )
}

export default Search
