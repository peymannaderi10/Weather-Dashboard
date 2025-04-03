const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.WEATHERSTACK_API_KEY;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON responses safely
async function safeFetch(url) {
  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200) + '...');
      throw new Error('API returned a non-JSON response');
    }
  } catch (error) {
    throw error;
  }
}

// Endpoint to get weather data for a location
app.get('/api/weather/:location', async (req, res) => {
    const location = req.params.location;
    
    try {
      // Use HTTPS instead of HTTP
      const data = await safeFetch(
        `https://api.weatherstack.com/current?access_key=${API_KEY}&query=${encodeURIComponent(location)}`
      );
      
      if (data.error) {
        return res.status(400).json({ error: data.error.info });
      }
      
      return res.json(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return res.status(500).json({ error: 'Failed to fetch weather data: ' + error.message });
    }
});

// Add the missing forecast endpoint
app.get('/api/forecast/:location', async (req, res) => {
    const location = req.params.location;
    const days = req.query.days || 7;
    
    try {
      // Note: Weatherstack may require a paid plan for forecast data
      const data = await safeFetch(
        `https://api.weatherstack.com/forecast?access_key=${API_KEY}&query=${encodeURIComponent(location)}&forecast_days=${days}`
      );
      
      if (data.error) {
        return res.status(400).json({ error: data.error.info });
      }
      
      return res.json(data);
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      return res.status(500).json({ error: 'Failed to fetch forecast data: ' + error.message });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
  
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});