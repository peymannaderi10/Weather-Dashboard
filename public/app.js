document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const locationInput = document.getElementById('location-input');
    const searchBtn = document.getElementById('search-btn');
    const weatherContainer = document.getElementById('weather-container');
    const locationEl = document.getElementById('location');
    const currentWeatherDetails = document.getElementById('current-weather-details');
    const weatherDetails = document.getElementById('weather-details');
    const forecastContainer = document.getElementById('forecast-container');

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

  // Function to get weather data
  async function getWeatherData(location) {
    try {
      const response = await fetch(`/api/weather/${location}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch weather data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
      return null;
    }
  }
  
  // Function to get forecast data
  async function getForecastData(location, days = 7) {
    try {
      const response = await fetch(`/api/forecast/${location}?days=${days}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch forecast data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
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
    currentWeatherCard.style.backgroundImage = `url(${getWeatherBackground(data.current.weather_code)})`;
    
    // Update current weather details
    currentWeatherDetails.innerHTML = `
      <div class="d-flex align-items-center mb-3">
        <img src="${data.current.weather_icons[0]}" class="weather-icon me-3" alt="${data.current.weather_descriptions[0]}">
        <div>
          <span class="temp-large">${data.current.temperature}°C</span>
          <p>${data.current.weather_descriptions[0]}</p>
        </div>
      </div>
      <p>
        <i class="bi bi-calendar-date"></i> ${data.location.localtime}
      </p>
    `;

    // Update weather details
    weatherDetails.innerHTML = `
      <div class="weather-details-item">
        <span>Feels Like</span>
        <span>${data.current.feelslike}°C</span>
      </div>
      <div class="weather-details-item">
        <span>Humidity</span>
        <span>${data.current.humidity}%</span>
      </div>
      <div class="weather-details-item">
        <span>Wind</span>
        <span>${data.current.wind_speed} km/h ${data.current.wind_dir}</span>
      </div>
      <div class="weather-details-item">
        <span>Pressure</span>
        <span>${data.current.pressure} mb</span>
      </div>
      <div class="weather-details-item">
        <span>Visibility</span>
        <span>${data.current.visibility} km</span>
      </div>
      <div class="weather-details-item">
        <span>UV Index</span>
        <span>${data.current.uv_index}</span>
      </div>
    `;
  }
  // Function to update the forecast UI
  function updateForecastUI(data) {
    if (!data || !data.forecast) {
      forecastContainer.innerHTML = '<p>Forecast data not available</p>';
      return;
    }
    
    let forecastHTML = '';
    const forecastDays = Object.keys(data.forecast);
    
    forecastDays.forEach(day => {
      const forecast = data.forecast[day];
      forecastHTML += `
        <div class="col-md-2 forecast-day">
          <p>${new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</p>
          <img src="${forecast.weather_icons[0]}" alt="${forecast.weather_descriptions[0]}" class="weather-icon">
          <p>${forecast.avgtemp}°C</p>
          <p>${forecast.weather_descriptions[0]}</p>
        </div>
      `;
    });
    
    forecastContainer.innerHTML = forecastHTML;
  }

  // Function to handle search
  async function handleSearch() {
    const location = locationInput.value.trim();
    if (!location) {
      alert('Please enter a location');
      return;
    }
    
    const weatherData = await getWeatherData(location);
    if (weatherData) {
      updateWeatherUI(weatherData);
      
      // Get forecast data
      const forecastData = await getForecastData(location);
      if (forecastData) {
        updateForecastUI(forecastData);
        createTemperatureChart(forecastData);
      }
    }
  }


  // Event listeners
  searchBtn.addEventListener('click', handleSearch);
  locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });
});

// Function to create a temperature chart
function createTemperatureChart(data) {
    // If there's an existing chart, destroy it
    if (window.tempChart) {
      window.tempChart.destroy();
    }
    
    // Check if forecast data is available
    if (!data || !data.forecast) return;
    
    // Prepare data for the chart
    const forecastDays = Object.keys(data.forecast);
    const labels = forecastDays.map(day => 
      new Date(day).toLocaleDateString('en-US', { weekday: 'short' })
    );
    
    const tempData = forecastDays.map(day => data.forecast[day].avgtemp);
    
    // Create a chart
    const ctx = document.getElementById('temp-chart').getContext('2d');
    window.tempChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperature (°C)',
          data: tempData,
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }