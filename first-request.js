require('dotenv').config();


// You'll need node-fetch for Node.js versions before 18
// If you're on Node.js 18+, you can use the native fetch API instead
const fetch = require('node-fetch');
// Replace this with your actual API key from Weatherstack
const accessKey = process.env.WEATHERSTACK_API_KEY;
const query = 'New York';
// Make the API request
fetch(`https://api.weatherstack.com/current?access_key=${accessKey}&query=${query}`)
  .then(response => response.json())
  .then(data => {
    // Print the JSON
    console.log('Weather data:');
    console.log(JSON.stringify(data, null, 2));  
  })
  .catch(error => console.error('Error:', error));
  