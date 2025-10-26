// src/MapPage.jsx
import { useState, useRef } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker, InfoWindowF } from '@react-google-maps/api';
import SearchField from './SearchField';
import FilterUI from './FilterUI';
import PinSidebar from './PinSidebar';
import AddStoryModal from './AddStoryModal';

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};
const mapCenter = {
  lat: 43.6532,
  lng: -79.3832,
};
const mapOptions = {
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

function MapPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const { allPins, mode } = useLoaderData();
  const [filterTag, setFilterTag] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);
  const [formPinData, setFormPinData] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate(); // Your useNavigate hook is preserved

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  const filteredPins = allPins.filter((pin) => {
    if (mode === 'add') return true;
    if (filterTag === 'all') return true;
    return pin.desireTags?.includes(filterTag);
  });

  if (loadError) return 'Error loading maps';
  if (!isLoaded) return 'Loading Maps...';

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '350px', height: '100vh', padding: '10px', background: '#fff', zIndex: 1000, boxShadow: '2px 0 5px rgba(0,0,0,0.1)', overflowY: 'auto' }}>
        
        {/* --- YOUR BUTTON IS PRESERVED --- */}
        <button 
          onClick={() => navigate('/')} // Navigate to the homepage on click
          style={{
            marginBottom: '15px',
            padding: '8px 12px',
            fontSize: '1rem',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '5px'
          }}
        >
          &larr; Back to Home
        </button>
        {/* --- END OF YOUR BUTTON --- */}
        
        <h1 style={{ fontSize: '1.5rem' }}>{mode === 'find' ? 'Find Experiences' : 'Add Your Story'}</h1>

        {/* --- THIS IS THE UPDATED 'find' MODE --- */}
        {mode === 'find' && (
          <>
            <p>Search for a location:</p>
            <SearchField
              mapRef={mapRef}
              allPins={allPins}
              mode={mode}
              onPinSelect={setSelectedPin}
            />
            <hr style={{margin: '20px 0'}} />
            <FilterUI setFilterTag={setFilterTag} />
          </>
        )}
        
        {/* --- THIS IS THE UPDATED 'add' MODE --- */}
        {mode === 'add' && (
          <>
            <p>Search for a location to add your story:</p>
            <SearchField
              mapRef={mapRef}
              allPins={allPins}
              mode={mode}
              onPinSelect={setFormPinData}
            />
          </>
        )}

        {mode === 'find' && selectedPin && (
          <PinSidebar pin={selectedPin} onClose={() => setSelectedPin(null)} />
        )}
      </div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={13}
        options={mapOptions}
        onLoad={onMapLoad}
      >
        {filteredPins.map((pin) => (
          <Marker
            key={pin.id}
            position={pin.location}
            onClick={() => {
              if (mode === 'find') {
                setSelectedPin(pin);
                mapRef.current?.panTo(pin.location);
              }
              if (mode === 'add') {
                setFormPinData(pin); // Passes full pin data
              }
            }}
          />
        ))}
      </GoogleMap>
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