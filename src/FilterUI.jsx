// src/FilterUI.jsx

import { desireTags } from './tags';
import { Autocomplete, TextField } from '@mui/material';

const filterOptions = ["all", ...desireTags];

// Format tags for display in the dropdown
const formattedOptions = filterOptions.map(tag => ({
  label: tag.charAt(0).toUpperCase() + tag.slice(1).replace('_', ' '),
  value: tag
}));

function FilterUI({ setFilterTag }) {
  const handleFilterChange = (event, newValue) => {
    // newValue will be null if cleared, or an object {label, value} if selected
    setFilterTag(newValue ? newValue.value : 'all');
  };

  return (
    <Autocomplete
      options={formattedOptions}
      getOptionLabel={(option) => option.label}
      onChange={handleFilterChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Filter by desire"
          variant="outlined"
        />
      )}
      sx={{ mt: 1 }}
    />
  );
}

export default FilterUI;