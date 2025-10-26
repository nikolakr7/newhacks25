// src/Home.jsx

import { Link } from 'react-router-dom';

// Simple inline styles for the buttons
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    gap: '2rem',
    background: '#e8f0fe', // softer background
  },
  title: {
    fontSize: '3.5rem', // slightly bigger
    fontFamily: 'Arial, sans-serif',
    color: '#1e3a8a', // subtle color for emphasis
  },
  link: {
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontFamily: 'Arial, sans-serif',
    color: 'white',
    background: '#3b82f6',
    padding: '1rem 2rem',
    borderRadius: '8px',
  }
};

function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>VibeMap</h1>
      
      <Link to="/map/find" style={styles.link}>
        Find Experiences
      </Link>
      
      <Link to="/map/add" style={styles.link}>
        Add Your Story
      </Link>
    </div>
  );
}

export default Home;
