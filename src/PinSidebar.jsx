// src/PinSidebar.jsx

import { Box, Typography, Card, CardContent, CardMedia, Chip, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function PinSidebar({ pin, onClose, filterTag }) {
  const sortedStories = [...pin.stories].sort((a, b) => {
    if (filterTag === 'all') return 0;
    const aMatches = a.desireTag === filterTag;
    const bMatches = b.desireTag === filterTag;
    if (aMatches && !bMatches) return -1;
    if (!aMatches && bMatches) return 1;
    return 0;
  });

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, pr: 1 }}>
        <Typography variant="h6" component="h2" fontWeight="bold">
          {pin.locationName || 'Selected Location'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ overflowY: 'auto', flexGrow: 1, pr: 1 }}>
        {sortedStories.map((story, index) => (
          <Card key={index} sx={{ mb: 2, boxShadow: 2 }}>
            <CardMedia
              component="img"
              height="140"
              image={story.photoUrl}
              alt={story.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {story.title}
              </Typography>
              
              {/* Only render the Chip if the tag exists */}
              {story.desireTag && (
                <Chip 
                  // --- THIS IS THE CORRECTED LINE ---
                  label={story.desireTag?.replace('_', ' ')} 
                  color="primary" 
                  size="small"
                  sx={{ mb: 1 }}
                />
              )}

              <Typography variant="body2" color="text.secondary">
                {story.story}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {pin.stories.length === 0 && <Typography sx={{ p: 2, color: 'text.secondary' }}>No stories here yet!</Typography>}
      </Box>
    </Box>
  );
}

export default PinSidebar;