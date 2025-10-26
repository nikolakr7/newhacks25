// src/PinSidebar.jsx

function PinSidebar({ pin, onClose, filterTag }) { // <-- 1. Accept filterTag prop

  // --- 2. Create a sorted list of stories ---
  // We sort a *copy* of the stories array
  const sortedStories = [...pin.stories].sort((a, b) => {
    // If the filter is 'all', don't change the order
    if (filterTag === 'all') {
      return 0;
    }
    
    const aMatches = a.desireTag === filterTag;
    const bMatches = b.desireTag === filterTag;

    if (aMatches && !bMatches) {
      return -1; // 'a' (which matches) comes before 'b' (which doesn't)
    } else if (!aMatches && bMatches) {
      return 1; // 'b' (which matches) comes before 'a' (which doesn't)
    }
    
    return 0; // Keep the original order for stories that are both matches or both non-matches
  });
  // --- End of new code ---

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
      
      {/* --- 3. Loop over the new sortedStories array --- */}
      {sortedStories.map((story, index) => (
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

      {/* This check remains the same, it just checks if the pin is empty */}
      {pin.stories.length === 0 && <p style={{padding: '15px'}}>No stories here yet!</p>}
    </div>
  );
}

export default PinSidebar;