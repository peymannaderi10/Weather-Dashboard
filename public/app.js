document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const locationInput = document.getElementById('location-input');
  const searchBtn = document.getElementById('search-btn');
  const weatherContainer = document.getElementById('weather-container');
  const locationEl = document.getElementById('location');
  const currentWeatherDetails = document.getElementById('current-weather-details');
  const weatherDetails = document.getElementById('weather-details');
  const errorContainer = document.getElementById('error-container');

  // Weather background images based on weather codes
  const weatherBackgrounds = {
    sunny: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    cloudy: 'https://images.unsplash.com/photo-1505245208761-ba872912fac0',
    rainy: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721',
    snowy: 'https://images.unsplash.com/photo-1446034295857-c39f8844fad4', 
    stormy: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721',
    foggy: 'https://images.unsplash.com/photo-1446034295857-c39f8844fad4'       
  };
  
// Function to determine background image based on weather code
function getWeatherBackground(weatherCode) {
  if (weatherCode <= 113) return weatherBackgrounds.sunny;
  if (weatherCode <= 143) return weatherBackgrounds.foggy;
  if (weatherCode <= 176) return weatherBackgrounds.cloudy;
  if (weatherCode <= 248) return weatherBackgrounds.cloudy;
  if (weatherCode <= 318) return weatherBackgrounds.rainy;
  if (weatherCode <= 350) return weatherBackgrounds.rainy;
  if (weatherCode <= 377) return weatherBackgrounds.snowy;
  return weatherBackgrounds.stormy;
}

// Function to get weather data with better error handling
async function getWeatherData(location) {
  try {
    showLoadingIndicator();
    hideErrorMessage();
    
    const response = await fetch(`/api/weather/${location}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch weather data');
    }
    
    // Check if data has the expected structure
    if (!data.location || !data.current) {
      throw new Error('Invalid response format from weather API');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage(error.message);
    return null;
  } finally {
    hideLoadingIndicator();
  }
}

// Function to get forecast data with better error handling
async function getForecastData(location, days = 7) {
  try {
    const response = await fetch(`/api/forecast/${location}?days=${days}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch forecast data');
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    // Don't show alert for forecast errors, just log them
    return null;
  }
}

// Function to update the UI with weather data
function updateWeatherUI(data) {
  if (!data) return;
  
  // Show the weather container
  weatherContainer.style.display = 'block';
  
  // Update location
  locationEl.textContent = `${data.location.name}, ${data.location.country}`;
  
  // Set weather background
  const currentWeatherCard = document.querySelector('.current-weather');
  if (currentWeatherCard) {
    currentWeatherCard.style.backgroundImage = `url(${getWeatherBackground(data.current.weather_code)})`;
  }
  
  // Check if weather_icons array exists and has at least one item
  const weatherIcon = data.current.weather_icons && data.current.weather_icons.length > 0 
    ? data.current.weather_icons[0] 
    : '';
    
  // Check if weather_descriptions array exists and has at least one item  
  const weatherDesc = data.current.weather_descriptions && data.current.weather_descriptions.length > 0 
    ? data.current.weather_descriptions[0] 
    : 'Weather information unavailable';
  
  // Update current weather details with additional checks
  currentWeatherDetails.innerHTML = `
    <div class="d-flex align-items-center mb-3">
      ${weatherIcon ? `<img src="${weatherIcon}" class="weather-icon me-3" alt="${weatherDesc}">` : ''}
      <div>
        <span class="temp-large">${data.current.temperature || 'N/A'}°C</span>
        <p>${weatherDesc}</p>
      </div>
    </div>
    <p>
      <i class="bi bi-calendar-date"></i> ${data.location.localtime || 'Time unavailable'}
    </p>
  `;

  // Update weather details with null checks
  weatherDetails.innerHTML = `
    <div class="weather-details-item">
      <span>Feels Like</span>
      <span>${data.current.feelslike || 'N/A'}°C</span>
    </div>
    <div class="weather-details-item">
      <span>Humidity</span>
      <span>${data.current.humidity || 'N/A'}%</span>
    </div>
    <div class="weather-details-item">
      <span>Wind</span>
      <span>${data.current.wind_speed || 'N/A'} km/h ${data.current.wind_dir || ''}</span>
    </div>
    <div class="weather-details-item">
      <span>Pressure</span>
      <span>${data.current.pressure || 'N/A'} mb</span>
    </div>
    <div class="weather-details-item">
      <span>Visibility</span>
      <span>${data.current.visibility || 'N/A'} km</span>
    </div>
    <div class="weather-details-item">
      <span>UV Index</span>
      <span>${data.current.uv_index || 'N/A'}</span>
    </div>
  `;
}

// Function to update forecast UI (placeholder - implement based on API response)
function updateForecastUI(data) {
  // Implementation depends on the structure of the forecast API response
  console.log('Forecast data:', data);
  // TODO: Implement forecast UI update
}

// Helper functions for loading and error states
function showLoadingIndicator() {
  // Create and show loading spinner if it doesn't exist
  if (!document.getElementById('loading-spinner')) {
    const spinner = document.createElement('div');
    spinner.id = 'loading-spinner';
    spinner.className = 'spinner-border text-primary';
    spinner.setAttribute('role', 'status');
    spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
    
    const container = document.createElement('div');
    container.id = 'loading-container';
    container.className = 'text-center my-3';
    container.appendChild(spinner);
    
    weatherContainer.parentNode.insertBefore(container, weatherContainer);
  } else {
    document.getElementById('loading-container').style.display = 'block';
  }
}

function hideLoadingIndicator() {
  const loadingContainer = document.getElementById('loading-container');
  if (loadingContainer) {
    loadingContainer.style.display = 'none';
  }
}

function showErrorMessage(message) {
  // Create error container if it doesn't exist
  if (!errorContainer) {
    const errContainer = document.createElement('div');
    errContainer.id = 'error-container';
    errContainer.className = 'alert alert-danger my-3';
    weatherContainer.parentNode.insertBefore(errContainer, weatherContainer);
    errorContainer = errContainer;
  }
  
  errorContainer.textContent = `Error: ${message}`;
  errorContainer.style.display = 'block';
  weatherContainer.style.display = 'none';
}

function hideErrorMessage() {
  if (errorContainer) {
    errorContainer.style.display = 'none';
  }
}

// Function to handle search
async function handleSearch() {
  const location = locationInput.value.trim();
  if (!location) {
    showErrorMessage('Please enter a location');
    return;
  }
  
  const weatherData = await getWeatherData(location);
  if (weatherData) {
    updateWeatherUI(weatherData);
    
    // Get forecast data
    const forecastData = await getForecastData(location);
    if (forecastData) {
      updateForecastUI(forecastData);
    }
  }
}

// Check if the input is coordinates
function isCoordinates(input) {
  // Simple regex for lat,long format
  const coordRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
  return coordRegex.test(input);
}

// Event listeners
searchBtn.addEventListener('click', handleSearch);
locationInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Add initialization to check for initial UI elements
function initializeUI() {
  // Create error container if it doesn't exist
  if (!errorContainer) {
    const errContainer = document.createElement('div');
    errContainer.id = 'error-container';
    errContainer.className = 'alert alert-danger my-3';
    errContainer.style.display = 'none';
    weatherContainer.parentNode.insertBefore(errContainer, weatherContainer);
    errorContainer = errContainer;
  }
}

// Call initialization
initializeUI();
});