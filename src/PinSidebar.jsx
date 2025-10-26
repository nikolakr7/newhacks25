// src/PinSidebar.jsx

function PinSidebar({ pin, onClose }) {
  return (
    <div style={{
      marginTop: '20px',
      height: 'calc(100vh - 200px)', // Fill remaining height
      overflowY: 'auto', // <-- The scrollable part
      border: '1px solid #ccc',
      borderRadius: '8px'
    }}>
      <button onClick={onClose} style={{float: 'right', border: 'none', background: 'transparent', fontSize: '1.5rem', cursor: 'pointer', padding: '10px'}}>&times;</button>
      <h2 style={{padding: '0 15px'}}>{pin.locationName || 'Selected Location'}</h2>
      
      {/* Loop over all stories for this pin */}
      {pin.stories.map((story, index) => (
        <div key={index} style={{
          borderBottom: '1px solid #eee',
          padding: '15px'
        }}>
          <h3 style={{marginTop: 0}}>{story.title}</h3>
          <span style={{
             background: '#eee', 
             padding: '3px 8px', 
             borderRadius: '10px', 
             fontSize: '0.9rem'
          }}>
            {story.desireTag}
          </span>
          <p>{story.story}</p>
          <img src={story.photoUrl} alt={story.title} style={{width: '100%', borderRadius: '5px'}} />
        </div>
      ))}
      {pin.stories.length === 0 && <p style={{padding: '15px'}}>No stories here yet!</p>}
    </div>
  );
}

export default PinSidebar;