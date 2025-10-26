// src/AddStoryModal.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from './firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { desireTags } from './tags'; // Import your master tag list

// Simple modal styles
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 1100,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  modal: {
    background: 'white', padding: '20px', borderRadius: '8px',
    width: '90%', maxWidth: '450px',
  },
  input: { width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '15px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' },
  textarea: { width: '100%', minHeight: '100px', padding: '10px', boxSizing: 'border-box', marginBottom: '15px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' },
  select: { width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '15px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }
};

function AddStoryModal({ pinData, onClose }) {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [desireTag, setDesireTag] = useState(desireTags[0]); // Default to first tag
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) {
      alert("Please add a photo.");
      return;
    }
    
    setIsLoading(true);

    try {
      // 1. Upload Photo
      const photoName = `images/${uuidv4()}-${photo.name}`;
      const storageRef = ref(storage, photoName); 
      await uploadBytes(storageRef, photo);
      const downloadURL = await getDownloadURL(storageRef);

      // 2. Create the new story object
      const newStoryObject = {
        title: title,
        story: story,
        desireTag: desireTag,
        photoUrl: downloadURL
      };

      // 3. Check if this is a NEW pin or an EXISTING pin
      if (pinData.id) {
        // --- EXISTING PIN ---
        const docRef = doc(db, 'pins', pinData.id);
        await updateDoc(docRef, {
          stories: arrayUnion(newStoryObject),
          desireTags: arrayUnion(newStoryObject.desireTag)
        });

      } else {
        // --- NEW PIN ---
        const newPin = {
          location: pinData.location,
          locationName: pinData.locationName,
          stories: [newStoryObject],
          desireTags: [newStoryObject.desireTag]
        };
        await addDoc(collection(db, 'pins'), newPin);
      }

      setIsLoading(false);
      alert("Story added successfully!");
      onClose();
      // Force a page reload to get new data. This is the simplest
      // way in a hackathon to make sure the map updates.
      navigate(0); 

    } catch (error) {
      console.error("Error adding doc: ", error);
      alert("Error: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3>{pinData.id ? `Add story to: ${pinData.locationName}` : `Create new pin at: ${pinData.locationName}`}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={styles.input} required />
          <textarea placeholder="Your story..." value={story} onChange={(e) => setStory(e.g.target.value)} style={styles.textarea} required />
          
          <label htmlFor="desire-tag-select">Choose a desire tag:</label>
          <select 
            id="desire-tag-select" 
            value={desireTag} 
            onChange={(e) => setDesireTag(e.target.value)} 
            style={styles.select}
          >
            {desireTags.map(tag => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
          
          <input type="file" onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" style={styles.input} required />
          <button type="submit" disabled={isLoading} style={{width: '100%', padding: '10px', fontSize: '1.1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px'}}>
            {isLoading ? "Saving..." : "Submit Story"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStoryModal;