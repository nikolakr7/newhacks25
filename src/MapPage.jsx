

// src/MapPage.jsx

import { useState, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';

// --- Components ---
import SearchField from './SearchField';
import FilterUI from './FilterUI';
import PinSidebar from './PinSidebar';
import AddStoryModal from './AddStoryModal';

// --- Map Styles ---
const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};
const mapCenter = {
  lat: 43.6532,
  lng: -79.3832,
};
// This hides Google's default business POIs (Points of Interest)
const mapOptions = {
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

function MapPage() {
  // 1. Load the Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"], // Load the "places" library for Autocomplete
  });

  // 2. Get data from the loader (see main.jsx)
  const { allPins, mode } = useLoaderData();

  // 3. State
  const [filterTag, setFilterTag] =useState('all');
  const [selectedPin, setSelectedPin] = useState(null); // Pin user clicks to *view*
  const [formPinData, setFormPinData] = useState(null); // Pin data for the *add* modal
  
  // Ref to hold the map object
  const mapRef = useRef(null);
  const onMapLoad = (map) => {
    mapRef.current = map; // Save the map instance
  };

  // 4. Client-side Filtering (for 'find' mode)
  const filteredPins = allPins.filter(pin => {
    if (mode === 'add') return true;
    if (filterTag === 'all') return true;
    return pin.desireTags.includes(filterTag);
  });
  
  // --- Render logic ---
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps...";

  return (
    <div style={{ display: 'flex' }}>
      
      {/* --- Column 1: UI Sidebar --- */}
      <div style={{ width: '350px', height: '100vh', padding: '10px', background: '#fff', zIndex: 1000, boxShadow: '2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        
        <h1 style={{ fontSize: '1.5rem' }}>{mode === 'find' ? 'Find Experiences' : 'Add Your Story'}</h1>
        
        {mode === 'find' && (
          <FilterUI setFilterTag={setFilterTag} />
        )}
        
        {mode === 'add' && (
          <>
            <p>Search for a location to add your story:</p>
            <SearchField
              mapRef={mapRef}
              allPins={allPins}
              onPinSelect={setFormPinData}
            />
          </>
        )}

        {/* This is the "scrollable box UI" */}
        {mode === 'find' && selectedPin && (
          <PinSidebar pin={selectedPin} onClose={() => setSelectedPin(null)} />
        )}
      </div>

      {/* --- Column 2: The Map --- */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={13}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {/* Render all the pins */}
        {filteredPins.map(pin => (
          <Marker
            key={pin.id}
            position={pin.location} // Google Maps uses {lat, lng} objects
            onClick={() => {
              if (mode === 'find') {
                setSelectedPin(pin);
                mapRef.current?.panTo(pin.location); // Move map to pin
              }
              if (mode === 'add') {
                setFormPinData(pin); // Open modal for existing pin
              }
            }}
          />
        ))}
      </GoogleMap>

      {/* --- Modal (renders on top of everything) --- */}
      {formPinData && (
        <AddStoryModal 
          pinData={formPinData} 
          onClose={() => setFormPinData(null)}
        />
      )}
    </div>
  );
}

export default MapPage;
