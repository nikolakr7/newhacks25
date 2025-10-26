// src/Home.jsx

import { Link } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';

function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#e8f0fe', // Using your softer background color
        gap: 3,
      }}
    >
      <Typography variant="h2" component="h1" fontWeight="bold" sx={{ color: '#1e3a8a' }}>
        StoryPin 🗺️
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '250px' }}>
        <Button
          component={Link} // Use Link component for routing
          to="/map/find"
          variant="contained" // Gives the solid background style
          size="large"
          fullWidth
        >
          Find Experiences
        </Button>
        
        <Button
          component={Link}
          to="/map/add"
          variant="contained"
          size="large"
          color="success" // A nice green color
          fullWidth
        >
          Add Your Story
        </Button>
      </Box>
    </Box>
  );
}

export default Home;