// src/AddStoryModal.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage } from './firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { desireTags } from './tags';

import { Modal, Box, Typography, TextField, Select, MenuItem, Button, FormControl, InputLabel, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

function AddStoryModal({ pinData, onClose }) {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [desireTag, setDesireTag] = useState(desireTags[0]);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photo) { alert("Please add a photo."); return; }
    setIsLoading(true);

    try {
      const photoName = `images/${uuidv4()}-${photo.name}`;
      const storageRef = ref(storage, photoName); 
      await uploadBytes(storageRef, photo);
      const downloadURL = await getDownloadURL(storageRef);
      const newStoryObject = { title, story, desireTag, photoUrl: downloadURL };

      if (pinData.id) {
        const docRef = doc(db, 'pins', pinData.id);
        await updateDoc(docRef, { stories: arrayUnion(newStoryObject), desireTags: arrayUnion(newStoryObject.desireTag) });
      } else {
        const newPin = { location: pinData.location, locationName: pinData.locationName, stories: [newStoryObject], desireTags: [newStoryObject.desireTag] };
        await addDoc(collection(db, 'pins'), newPin);
      }

      setIsLoading(false);
      alert("Story added successfully!");
      onClose();
      navigate(0); 

    } catch (error) {
      console.error("Error adding doc: ", error);
      alert("Error: " + error.message);
      setIsLoading(false);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" component="h2">
          {pinData.id ? `Add story to: ${pinData.locationName}` : `Create pin at: ${pinData.locationName}`}
        </Typography>
        
        <TextField label="Title" variant="outlined" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
        
        <TextField label="Your story..." variant="outlined" multiline rows={4} value={story} onChange={(e) => setStory(e.target.value)} required fullWidth />
        
        <FormControl fullWidth>
          <InputLabel id="desire-tag-label">Desire Tag</InputLabel>
          <Select
            labelId="desire-tag-label"
            value={desireTag}
            label="Desire Tag"
            onChange={(e) => setDesireTag(e.target.value)}
          >
            {desireTags.map(tag => (
              <MenuItem key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1).replace('_', ' ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Button variant="outlined" component="label">
          Upload Photo
          <input type="file" hidden onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" required />
        </Button>
        {photo && <Typography variant="caption" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{photo.name}</Typography>}

        <Button type="submit" variant="contained" color="primary" disabled={isLoading} size="large">
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Submit Story"}
        </Button>
      </Box>
    </Modal>
  );
}

export default AddStoryModal;