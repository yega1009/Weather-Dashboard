var apiKey = "10b49d2406d4cabc310ecd5ccbb9da7f";
var cityName = document.getElementById("city-name");
var searchBtn = document.getElementById("search-btn");
var searchHistory = document.getElementById("search-history");
var currentWeather = document.getElementById("current-weather");
var futureWeather = document.getElementById("future-weather");

searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var city = cityName.value;
    if (city) {
        getWeather(city);
    }
});

function getWeather(city) {
    var currentApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    var futureApi = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

    fetch(currentApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                displayCurrentWeather(data);
                fetch(futureApi).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            displayFutureWeather(data);
                            addCityToHistory(city);
                        });
                    } else {
                        alert('Failed to fetch future weather data' + response.statusText);
                    }
                });
            });
        } else {
            alert('Failed to fetch current weather data' + response.statusText);
        }
    }).catch(function (error) {
        alert('Error during fetch');
    });
};

function displayCurrentWeather(data) {
    var currentDate = new Date();
    var date = currentDate.toLocaleDateString();
    var headerText = "<h2>" + data.name + " (" + date + ")</h2>";

    var iconCode = data.weather[0].icon;
    var weatherDescription = data.weather[0].description;
    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
    var weatherIcon = '<img src="' + iconURL + '" alt="' + weatherDescription + '">';

    var temperatureText = "<p>Temp: " + data.main.temp + "°K</p>";
    var windSpeedText = "<p>Wind: " + data.wind.speed + " m/s</p>";
    var humidityText = "<p>Humidity: " + data.main.humidity + "%</p>";

    currentWeather.innerHTML = headerText + weatherIcon + temperatureText + humidityText + windSpeedText;
}

function displayFutureWeather(data) {
    
}

function addCityToHistory(city) {
    
}