const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHERSTACK_API_KEY;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get weather data for a location
app.get('/api/weather/:location', async (req, res) => {
    const location = req.params.location;
    
    try {
      const response = await fetch(
        `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(location)}`
      );
      const data = await response.json();
      
      if (data.error) {
        return res.status(400).json({ error: data.error.info });
      }
      
      return res.json(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
  
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
