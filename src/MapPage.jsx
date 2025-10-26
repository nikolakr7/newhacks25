// src/MapPage.jsx

import { useState, useRef } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import SearchField from './SearchField';
import FilterUI from './FilterUI';
import PinSidebar from './PinSidebar';
import AddStoryModal from './AddStoryModal';

// --- REMOVED THE customPinIcon import ---

const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};
const mapCenter = { lat: 43.6532, lng: -79.3832 };
const mapOptions = {
  styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
  disableDefaultUI: true,
  zoomControl: true,
};

function MapPage() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const { allPins, mode } = useLoaderData();
  const navigate = useNavigate();

  const [filterTag, setFilterTag] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);
  const [formPinData, setFormPinData] = useState(null);
  
  const mapRef = useRef(null);
  const onMapLoad = (map) => { mapRef.current = map; };

  const filteredPins = allPins.filter(pin => {
    if (mode === 'add') return true;
    if (filterTag === 'all') return true;
    return pin.desireTags?.includes(filterTag);
  });
  
  if (loadError) return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Error loading maps</Box>;
  if (!isLoaded) return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      
      {/* --- Column 1: UI Sidebar --- */}
      <Box sx={{ width: 380, p: 2, bgcolor: 'background.paper', boxShadow: 3, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
        
        <Button 
          onClick={() => navigate('/')}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2, alignSelf: 'flex-start' }}
        >
          Back to Home
        </Button>
        
        <Typography variant="h5" component="h1" fontWeight="bold">
          {mode === 'find' ? 'Find Experiences' : 'Add Your Story'}
        </Typography>
        
        {mode === 'find' && (
          <>
            <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>Search for a location:</Typography>
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
        
        {mode === 'add' && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>Search for a location to add your story:</Typography>
            <SearchField
              mapRef={mapRef}
              allPins={allPins}
              mode={mode}
              onPinSelect={setFormPinData}
            />
          </Box>
        )}

        {mode === 'find' && selectedPin && (
          <PinSidebar 
            pin={selectedPin} 
            onClose={() => setSelectedPin(null)} 
            filterTag={filterTag}
          />
        )}
      </Box>

      {/* --- Column 2: The Map --- */}
      <Box sx={{ flexGrow: 1 }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={13}
          options={mapOptions}
          onLoad={onMapLoad}
        >
          {filteredPins.map(pin => (
            <Marker
              key={pin.id}
              position={pin.location}
              // --- REMOVED the 'icon' prop from here ---
              onClick={() => {
                if (mode === 'find') {
                  setSelectedPin(pin);
                  mapRef.current?.panTo(pin.location);
                }
                if (mode === 'add') {
                  setFormPinData(pin);
                }
              }}
            />
          ))}
        </GoogleMap>
      </Box>

      {/* --- Modal --- */}
      {formPinData && (
        <AddStoryModal 
          pinData={formPinData} 
          onClose={() => setFormPinData(null)}
        />
      )}
    </Box>
  );
}

export default MapPage;