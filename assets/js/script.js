// Define API key for OpenWeatherMap
var apiKey = "10b49d2406d4cabc310ecd5ccbb9da7f";
// Get HTML elements by their IDs
var cityName = document.getElementById("city-name");
var searchBtn = document.getElementById("search-btn");
var clearHistoryBtn = document.getElementById("clear-history");
var searchHistory = document.getElementById("search-history");
var currentWeather = document.getElementById("current-weather");
var futureWeather = document.getElementById("future-weather");

// Add a click event listener to the search button
searchBtn.addEventListener('click', function (event) {
    event.preventDefault();
    var city = cityName.value;
    if (city) {
        getWeather(city);
    }
});

// Add a click event listener to clear search history button
clearHistoryBtn.addEventListener('click', function () {
    localStorage.removeItem("cities");
    searchHistory.innerHTML = '';
});

// Fetch and display weather details for the given city
function getWeather(city) {
    if (!city) {
        return;
    }
    // API endpoints
    var currentApi = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    var futureApi = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;

    // Fetch current weather data
    fetch(currentApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayCurrentWeather(data);
                // Fetch future weather data
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

// Display current weather details
function displayCurrentWeather(data) {
    var currentDate = new Date();
    var date = currentDate.toLocaleDateString();

    // HTML strings for displaying current weather details
    var headerText = "<h2>" + data.name + " (" + date + ")</h2>";
    var iconCode = data.weather[0].icon;
    var weatherDescription = data.weather[0].description;
    var iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
    var weatherIcon = '<img src="' + iconURL + '" alt="' + weatherDescription + '">';
    var temperatureText = "<p>Temp: " + data.main.temp + "°K</p>";
    var windSpeedText = "<p>Wind: " + data.wind.speed + " m/s</p>";
    var humidityText = "<p>Humidity: " + data.main.humidity + "%</p>";

    currentWeather.innerHTML = headerText + weatherIcon + temperatureText + windSpeedText + humidityText;
    currentWeather.style.display = "block";
}

// Display 5-day forecast details
function displayFutureWeather(data) {
    var forecast = "";
    for (var i = 3; i < data.list.length; i += 8) {
        var day = data.list[i];
        var date = new Date(day.dt * 1000).toLocaleDateString();

        // HTML strings for displaying each day's forecast
        var headerText = "<h3>" + date + "</h3>";
        var weatherIcon = '<img src="https://openweathermap.org/img/w/' + day.weather[0].icon + '.png" alt="' + day.weather[0].description + '">';
        var temperatureText = "<p>Temp: " + day.main.temp + "°K</p>";
        var windSpeedText = "<p>Wind: " + day.wind.speed + " m/s</p>";
        var humidityText = "<p>Humidity: " + day.main.humidity + "%</p>";
        forecast += "<div>";
        forecast += headerText;
        forecast += weatherIcon;
        forecast += temperatureText;
        forecast += windSpeedText;
        forecast += humidityText;
        forecast += "</div>";
    }
    futureWeather.innerHTML = forecast;
    futureWeather.style.display = "flex";
}

// Add the city to the search history and store it in local storage
function addCityToHistory(city) {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    // Add city to local storage if it doesn't already exist in the history
    if (!cities.includes(city)) {
        cities.push(city);
        localStorage.setItem("cities", JSON.stringify(cities));
    }
    displaySearchHistory();
}

// Display search history from local storage
function displaySearchHistory() {
    var cities = JSON.parse(localStorage.getItem("cities")) || [];
    console.log(cities);
    searchHistory.innerHTML = '';
    // Loop through each city in the history
    for (var i = 0; i < cities.length; i++) {
        var cityName = cities[i];
        // Create a button for each city in history
        var cityBtn = document.createElement("button");
        cityBtn.textContent = cityName;
        // Attach a click event to each city button to fetch its weather when clicked
        cityBtn.addEventListener('click', function (event) {
            getWeather(event.target.textContent);
        })
        searchHistory.appendChild(cityBtn);
    }
}

displaySearchHistory()