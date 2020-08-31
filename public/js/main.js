// DOM elements
const weatherSearchForm = document.querySelector('.weather-search-form');
const weatherSearchInput = document.querySelector('.location');
const city = document.querySelector('.name');
const country = document.querySelector('.country');
const latitude = document.querySelector('.lat');
const longitude = document.querySelector('.lon');
const weather = document.querySelector('.weather');
const weatherDesc = document.querySelector('.weather-desc');
const temp = document.querySelector('.temp');
const pressure = document.querySelector('.pressure');
const humidity = document.querySelector('.humidity');
const results = document.querySelector('.roller');
const locationInfo = document.querySelector('.location-info');


// Update page after getting data
function updatePage(data) {
  city.innerText = "Location: " + data.name;
  country.innerText = "Country: " + data.sys.country;
  latitude.innerText = "Latitude: " + data.coord.lat;
  longitude.innerText = "Longitude: " + data.coord.lon;
  weather.innerText = "Weather Type: " + data.weather[0].main;
  weatherDesc.innerText = "Weather Description: " + data.weather[0].description;
  temp.innerText = "Temperature: " + data.main.temp;
  pressure.innerText = "Pressure: " + data.main.pressure;
  humidity.innerText = "Humidity: " + data.main.humidity;
}

// Get search Input value from the form and send it to the server
weatherSearchForm.addEventListener('submit',e => {
  e.preventDefault();
  // displaying nothing on first load
  locationInfo.style.color = 'transparent';
  results.classList.add('lds-roller');
  const inputValue = weatherSearchInput.value;
  const location = {"location": inputValue};
  console.log(inputValue);
  console.log(location);
  // Sending the location to the server
  fetch('./post_location', { method: 'POST', body: JSON.stringify(location) })
    .then(res => res.json())
    .then(() => {

      const get_location_data = () => {
        fetch('./get_location_data')
          .then(res => res.json())
          .then(data => {
            console.log(data)
            if(data.message === 'waiting') {
              return setTimeout(() => get_location_data(), 3000)
            }

            // These are for the transition effects
            locationInfo.style.color = '#fff';
            locationInfo.style.boxShadow = '0 8px 6px -6px #115962';
            locationInfo.style.background = '#020a0b';
            locationInfo.style.background = 'linear-gradient(45deg, #020a0b 0%, #041719 120%)';
            results.classList.remove('lds-roller');
            updatePage(data);
          });
      }

      get_location_data()
});

});

// var locationPicker = new locationPicker('map', {
//   setCurrentPosition: true, // You can omit this, defaults to true
// }, {
//   zoom: 15 // You can set any google map options here, zoom defaults to 15
// });

