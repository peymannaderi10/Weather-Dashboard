document.addEventListener('DOMContentLoaded', ()=>{

  //DOM ELEMENTS
  const locationInput = document.getElementById('location-input');
  const searchBtn = document.getElementById('search-btn');
  const weatherContainer= document.getElementById('weather-container');
  const locationEl = document.getElementById('location');
  const currentWeatherDetails = document.getElementById('current-weather-details');
  const weatherDetails = document.getElementById('weather-details');
  
  
  const weatherBackgrounds = {
      sunny: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
      cloudy: 'https://images.unsplash.com/photo-1505245208761-ba872912fac0',
      rainy: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721',
      snowy: 'https://images.unsplash.com/photo-1446034295857-c39f8844fad4',
      stormy: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721',
      foggy: 'https://images.unsplash.com/photo-1446034295857-c39f8844fad4' 
  };
  
  function getWeatherBackground(weathCode){
      if(weathCode<=113) return weatherBackgrounds.sunny;
      if(weathCode<=143) return weatherBackgrounds.foggy;
      if(weathCode<=176) return weatherBackgrounds.cloudy;
      if(weathCode<=248) return weatherBackgrounds.cloudy;
      if(weathCode<=318) return weatherBackgrounds.rainy;
      if(weathCode<=350) return weatherBackgrounds.rainy;
      if(weathCode<=377) return weatherBackgrounds.snowy;
      return weatherBackgrounds.stormy;
  }
  
  async function getWeatherData(location){
      try {
          const response = await fetch(`/api/weather/${location}`);
          if(!response.ok){
              const errorData = await response.json();
              throw new Error(errorData.error);
          }
          return await response.json();
      } catch (error) {
          console.error('Error:', error);
          alert(`error: ${error.message}`);
          return null;
      }
  }
  
  function updateWeatherUI(data){
      if(!data) return;
  
      weatherContainer.style.display='block';
  
      locationEl.textContent = `${data.location.name}, ${data.location.country}`;
  
      const currentWeatherCard = document.querySelector('.current-weather');
      currentWeatherCard.style.backgroundImage = `url(${getWeatherBackground(data.current.weather_code)})`;
  
      currentWeatherDetails.innerHTML =`
  
      <div class = "d-flex align-items-center mb-3">
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
              <span>Visiblity</span>
              <span>${data.current.visibility} km</span>
          </div>
          <div class="weather-details-item">
              <span>UV Index</span>
              <span>${data.current.uv_index}</span>
          </div>
      `;  
  }
  
  async function handleSearch(){
      const location = locationInput.value.trim();
      if(!location){
          alert('please enter a location');
          return;
      }
      const weatherData = await getWeatherData(location);
  
      if(weatherData){
          updateWeatherUI(weatherData);
      }
  }
  
  searchBtn.addEventListener('click', handleSearch);
  locationInput.addEventListener('keypress',(e)=>{
      if(e.key === 'Enter'){
          handleSearch();
      }
  });
  });