import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

/**
 * 🗺️ ClickableMap Component
 * Listens for map clicks and returns the coordinates.
 */
function ClickableMap({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng); // Pass coordinates to parent
    },
  });
  return null; // This component does not render anything visible
}

/**
 * 🌟 Main App Component
 * - Displays the map
 * - Lets users drop pins
 * - Lets users add short stories to each pin
 */
function App() {
  // All pins on the map
  const [markers, setMarkers] = useState([]);
  // Input text for the story
  const [inputStory, setInputStory] = useState("");

  /**
   * Called when the user clicks on the map
   * → Adds a new marker at the clicked position
   */
  const handleMapClick = (latlng) => {
    const newMarker = {
      position: [latlng.lat, latlng.lng],
      stories: [], // Each marker can hold multiple stories
    };
    setMarkers((prev) => [...prev, newMarker]);
  };

  /**
   * Adds a new story to a specific marker
   */
  const handleAddStory = (index) => {
    if (!inputStory.trim()) return; // Ignore empty input

    const updatedMarkers = [...markers];
    updatedMarkers[index].stories.push({
      text: inputStory,
      image: null, // Placeholder for a future image feature
    });

    setMarkers(updatedMarkers);
    setInputStory(""); // Clear input field
  };

  // Default map center (Toronto)
  const defaultCenter = [43.6532, -79.3832];

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Map background tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">Carto</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Listen for map clicks */}
        <ClickableMap onMapClick={handleMapClick} />

        {/* Render all markers */}
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position}>
            <Popup>
              <div style={{ maxWidth: "200px" }}>
                <h4>Stories for this place:</h4>

                {/* List existing stories */}
                <ul>
                  {marker.stories.length === 0 ? (
                    <li>No stories yet</li>
                  ) : (
                    marker.stories.map((story, sIdx) => (
                      <li key={sIdx}>{story.text}</li>
                    ))
                  )}
                </ul>

                {/* Input for adding a story */}
                <input
                  type="text"
                  placeholder="Add a new story..."
                  value={inputStory}
                  onChange={(e) => setInputStory(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: "5px",
                    marginBottom: "5px",
                    padding: "4px",
                  }}
                />
                <button
                  onClick={() => handleAddStory(idx)}
                  style={{
                    width: "100%",
                    padding: "5px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                  }}
                >
                  Add
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default App;
