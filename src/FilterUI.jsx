// src/FilterUI.jsx

import { desireTags } from './tags'; // Import your tags

// Add "all" to the beginning of the list for filtering
const filterOptions = ["all", ...desireTags];

function FilterUI({ setFilterTag }) {

  const handleFilterChange = (e) => {
    // Check if the user's input is a valid tag.
    const value = e.target.value.toLowerCase();
    setFilterTag(filterOptions.includes(value) ? value : 'all');
  };

  return (
    <div>
      <label htmlFor="filter-input" style={{display: 'block', margin: '10px 0 5px'}}>Filter by desire:</label>
      
      <input 
        id="filter-input" 
        list="desire-tags-list"
        placeholder="Search or select a tag..."
        onChange={handleFilterChange} // Call function on change
        style={{width: '100%', padding: '10px', fontSize: '1rem', boxSizing: 'border-box', borderRadius: '5px', border: '1px solid #ccc'}}
      />
      
      <datalist id="desire-tags-list">
        {filterOptions.map(tag => (
          <option key={tag} value={tag}>
            {tag.charAt(0).toUpperCase() + tag.slice(1).replace('_', ' ')}
          </option>
        ))}
      </datalist>
    </div>
  );
}

export default FilterUI;