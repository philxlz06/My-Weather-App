document.getElementById('searchBtn').addEventListener('click',getWeather);

function getWeather(){
    const city =document.getElementById('cityInput').value;
    const apiKey='';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
    .then(response=> response.json())
    .then(data=>{
        if (data.cod===200){
            displayWeather(data);}
        else{
            alert('City not found');
        }
    })
    .catch(error=> console.log('error',error));
}

function displayWeather(data){
    const weatherDetails=document.getElementById('weatherDetails');
    weatherDetails.innerHTML=`
    <h2>${data.name},${data.sys.country}</h2>
    <p>Temperature: ${data.main.temp}C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed : ${data.wind.speed}m/s</p>`;
}
