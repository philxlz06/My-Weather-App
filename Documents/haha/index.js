
document.getElementById('searchBtn').addEventListener('click',getWeather);
document.getElementById('useLocationBtn').addEventListener('click',useMyLocation);
document.getElementById('clearHistoryBtn').addEventListener('click', clearSearchHistory); 
// Add clear history listener

function getWeather(){
    const city =document.getElementById('cityInput').value;
    const weatherDetails=document.getElementById('weatherDetails');

    

// city.trim() removes spaces
// !city.trim() checks for an empty string
// !city.trim() is true if input is empty // stops function (return)
// !city.trim() is false if input is valid // fetches data
    if (!city.trim()) {
        alert('Please enter a city name');
        return;}

    const url = `http://localhost:3000/weather?city=${city}`;

    //const url=`/weather?city=${city}`;
    //const url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric`;


    
    fetch(url)
    .then(response => {
        // Log the full response for better debugging
        console.log('Response:', response);
        
        // Check if response is OK (status 200)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return response.json();
    })
    

    .then(data=>{
        if (data.cod===200){
            displayWeather(data);
            //update search history
            addToSearchHistory(city);
    }
        else {
            weatherDetails.innerHTML = `<p style="color:red;">
            Error:${" Something went wrong .Try again."|| data.message}</p>`;
            return; }
               
        
       
    })
    .catch(error => {
        console.error('Error:', error);
        weatherDetails.innerHTML = `<p style="color:red;">An unexpected error occurred: ${error.message}. Please try again later.</p>`;
    });
    
}
function useMyLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url =`/weather?lat=${lat}&lon=${lon}`;
          
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.cod === 200) {
                        displayWeather(data);
                    } else {
                        weatherDetails.innerHTML = `<p style="color:red;">Error: Unable to fetch weather data for your location.</p>`;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    weatherDetails.innerHTML = `<p style="color:red;">An unexpected error occurred. Please try again later.</p>`;
                });
        }
        , () => {alert('Geolocation permission denied or failed.');
        });
    }
     else {
        alert('Geolocation is not supported by this browser.');
    }
}




function displayWeather(data){
    const weatherDetails=document.getElementById('weatherDetails');
    const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherDetails.innerHTML=`
    <h2>${data.name},${data.sys.country}</h2>
    <p>Temperature: ${data.main.temp}C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed : ${data.wind.speed}m/s</p>
    <img src="${iconUrl}"  alt="${data.weather[0].description} icon"> `
}

function addToSearchHistory(city){
    // To save the city to search history in localStorage
    let searchHistory=JSON.parse(localStorage.getItem('searchHistory'))||[];

    //prevent duplicates
    // Add the city to history, if it's not already in the list
    if (!searchHistory.includes(city)){
        searchHistory.push(city);
        // Save updated history back to localStorage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));

        //update the UI
        updateSearchHistory();
    }

}

function updateSearchHistory() {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const searchHistoryContainer = document.getElementById('searchHistory');
    const heading =document.querySelector('#searchHistoryContainer h2');//select heading

    // Clear the current list
    searchHistoryContainer.innerHTML = '';

    //changing color dynamically
    if(searchHistory.length===0){
        heading.style.color='#ff0000';
    } else if(searchHistory.length<5){
        heading.style.color='#168b44';
    }else{
        heading.style.color='#6baee9';
    }
    
    searchHistory.forEach((city,index) => {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        if (index==searchHistory.length - 1){
            listItem.classList.add('recent-item');
        }else{
            listItem.classList.add('old-item');
        }

        searchHistoryContainer.appendChild(listItem);
    });
}
// Function to clear the search history
function clearSearchHistory() {
    localStorage.removeItem('searchHistory');
    updateSearchHistory();  // Update the UI to reflect the cleared history
}


// Initialize the search history on page load
updateSearchHistory();
