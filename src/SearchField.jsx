// src/SearchField.jsx

import { useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';

// --- UPDATED ---
// We now accept 'mode' as a prop
function SearchField({ mapRef, allPins, mode, onPinSelect }) {
  const [autocomplete, setAutocomplete] = useState(null);

  const onLoad = (ac) => {
    setAutocomplete(ac);
  };

  // --- THIS FUNCTION CONTAINS THE NEW LOGIC ---
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      // Check if we have geometry data
      if (!place.geometry || !place.geometry.location) {
        console.log("No geometry for this place");
        return;
      }

      // Get all the data we need
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const locationName = place.name;

      // Pan the map to the new location
      mapRef.current?.panTo({ lat, lng });
      mapRef.current?.setZoom(15);

      // Check if a pin *already exists* at this exact location
      const existingPin = allPins.find(
        (pin) => pin.location.lat === lat && pin.location.lng === lng
      );

      // --- THIS IS THE NEW LOGIC ---
      if (mode === 'find') {
        // In 'find' mode, we only care about *existing* pins
        if (existingPin) {
          onPinSelect(existingPin); // This calls setSelectedPin
        } else {
          onPinSelect(null); // Clear any previously selected pin
          alert("No stories found for this location.");
        }
      } 
      else if (mode === 'add') {
        // In 'add' mode, we check for an existing pin or create a new one
        if (existingPin) {
          onPinSelect(existingPin); // This calls setFormPinData (for existing pin)
        } else {
          // This calls setFormPinData (for a *new* pin)
          onPinSelect({
            location: { lat, lng },
            locationName: locationName,
            stories: [],
            desireTags: []
          });
        }
      }
      // --- END OF NEW LOGIC ---

    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      fields={["geometry", "name"]} // Ask Google for only this data
    >
      <input
        type="text"
        placeholder="Search for a location..."
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}
      />
    </Autocomplete>
  );
}

export default SearchField;