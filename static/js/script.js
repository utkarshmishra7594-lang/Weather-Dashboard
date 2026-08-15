let chart;
const cityInput = document.getElementById("city");
const searchButton = document.getElementById("searchbtn");
const historyList = document.getElementById("history-list");
const clearHistory = document.getElementById("clear-history");
const locationButton = document.getElementById("locationbtn");
const homeButton = document.getElementById("homebtn");
const homeDisplay = document.getElementById("homeDisplay");
const rainAlert = document.getElementById("rainAlert");
const favoriteButton = document.getElementById("favoritebtn");
const favoriteList = document.getElementById("favoriteList");
const unitButton = document.getElementById("unitbtn");
let currentUnit = "C";

function convertTemperature(temp) {
    if (currentUnit === "F") {
        return Math.round((temp * 9 / 5) + 32) + "°F";
    }

    return Math.round(temp) + "°C";
}

unitButton.addEventListener("click", function () {

    if (currentUnit === "C") {
        currentUnit = "F";
    } else {
        currentUnit = "C";
    }

    searchButton.click();

});



function showForecast(data) {

    const forecastContainer = document.getElementById("forecast-container");

    forecastContainer.innerHTML = "";

    data.forecast.forEach(function(day) {

        let icon = "☀️";

        if (day.condition === "Clouds") icon = "☁️";
        else if (day.condition === "Rain") icon = "🌧️";
        else if (day.condition === "Thunderstorm") icon = "⛈️";
        else if (day.condition === "Snow") icon = "❄️";
        else if (day.condition === "Mist") icon = "🌫️";
        else if (day.condition === "Drizzle") icon = "🌦️";

        const date = new Date(day.date);

        const dayName = date.toLocaleDateString("en-US", {
            weekday: "short"
        });

        const dateNumber = date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short"
        });

        forecastContainer.innerHTML += `
            <div class="col-xl col-lg-4 col-md-6 col-sm-6 mb-4">

                <div class="forecast-card">

                    <div class="forecast-date">
                        <span>${dayName}</span>
                        <small>${dateNumber}</small>
                    </div>

                    <div class="forecast-icon">
                        ${icon}
                    </div>

                    <div class="forecast-temperature">
                        ${convertTemperature(day.temp)}
                    </div>

                    <div class="forecast-condition">
                        ${day.condition}
                    </div>

                </div>

            </div>
        `;
    });
}

function showHourlyForecast(hourly) {

    const container = document.getElementById("hourly-container");

    container.innerHTML = "";

    hourly.forEach(function(item) {

        let icon = "☀️";

        if (item.condition === "Clouds") {
            icon = "☁️";
        }
        else if (item.condition === "Rain") {
            icon = "🌧️";
        }
        else if (item.condition === "Thunderstorm") {
            icon = "⛈️";
        }
        else if (item.condition === "Snow") {
            icon = "❄️";
        }
        else if (item.condition === "Mist") {
            icon = "🌫️";
        }
        else if (item.condition === "Drizzle") {
            icon = "🌦️";
        }

        const date = new Date(item.time);

        const time = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });

        container.innerHTML += `
            <div class="hourly-card">

                <div class="hourly-time">
                    ${time}
                </div>

                <div class="hourly-icon">
                    ${icon}
                </div>

                <div class="hourly-temp">
                    ${convertTemperature(item.temp)}
                </div>

                <div class="hourly-condition">
                    ${item.condition}
                </div>

            </div>
        `;
    });
}

function drawChart(forecast) {

    const labels = [];
    const temps = [];

    forecast.forEach(function(day){

        labels.push(day.date.split(" ")[0]);
        temps.push(day.temp);

    });

    if(chart){
        chart.destroy();
    }

    const ctx = document.getElementById("tempChart");

    chart = new Chart(ctx,{
        type:"line",
        data:{
            labels:labels,
            datasets:[{
                label:"Temperature °C",
                data:temps,
                borderColor:"#0d6efd",
                backgroundColor:"rgba(13,110,253,.2)",
                fill:true,
                tension:.4
            }]
        },
        options:{
            responsive:true,
            maintainAspectRatio:false,

            plugins:{
                legend:{
                    display:true
                }
            },

            scales:{
                y:{
                    beginAtZero:false,
                    title:{
                        display:true,
                        text:"Temperature (°C)"
                    }
                },

                x:{
                    title:{
                        display:true,
                        text:"Day"
                    }
                }
            }
        }
    });

}

function showHomeCity(){

    const savedHomeCity = localStorage.getItem("homeCity");

    if(savedHomeCity){

        homeDisplay.innerHTML = `
        <div class="alert alert-warning d-inline-block">
            🏠 Home City: ${savedHomeCity}
        </div>
        `;

    }

}

function showRainAlert(forecast, city){

    rainAlert.innerHTML = "";
    const rainyConditions = ["Rain", "Thunderstorm", "Drizzle"];

    if(forecast.length > 1 && rainyConditions.includes(forecast[1].condition)){

        rainAlert.innerHTML = `
            <div class="alert alert-primary">
                ☔ Rain expected tomorrow in <b>${city}</b>.<br>
                Don't forget your umbrella!
            </div>
        `;

    }

}

function displayHistory() {

    historyList.innerHTML = "";

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.forEach(function(city){

        const li = document.createElement("li");

        li.className = "list-group-item";

        li.innerText = city;

        li.style.cursor = "pointer";

        li.addEventListener("click", function(){

            cityInput.value = city;

            searchButton.click();

        });

        historyList.appendChild(li);

    });

}

function displayFavorites() {

    favoriteList.innerHTML = "";

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favorites.forEach(function(city, index){

        const li = document.createElement("li");

        li.className = "list-group-item d-flex justify-content-between align-items-center";

        // City Name
        const cityName = document.createElement("span");

        cityName.innerText = "⭐ " + city;

        cityName.style.cursor = "pointer";

        cityName.addEventListener("click", function(){

            cityInput.value = city;
            searchButton.click();

        });

        // Delete Button
        const deleteButton = document.createElement("button");

        
        deleteButton.className = "btn btn-sm btn-outline-danger";

        deleteButton.innerText = "❌";

        deleteButton.addEventListener("click", function(){

            favorites.splice(index, 1);

            localStorage.setItem("favorites", JSON.stringify(favorites));

            displayFavorites();

        });

        li.appendChild(cityName);
        li.appendChild(deleteButton);

        favoriteList.appendChild(li);

    });

}

searchButton.addEventListener("click", function () {

    const city = cityInput.value;

    if (city.trim() === "") {
        alert("Please Enter City");
        return;
    }

    document.getElementById("city-name").innerText = "Loading...";
    document.getElementById("temperature").innerText = "...";
    document.getElementById("loader").classList.remove("d-none");
    fetch("/weather/" + city)
        .then(response => response.json())
        .then(data => {
            document.getElementById("loader").classList.add("d-none");
            
            if (data.error || data.cod == "404") {
                alert("City Not Found");
                return;
            }

            // Weather Icon
            let icon = "☀️";

            if (data.condition === "Clear") {
                icon = "☀️";
            }
            else if (data.condition === "Clouds") {
                icon = "☁️";
            }
            else if (data.condition === "Rain") {
                icon = "🌧️";
            }
            else if (data.condition === "Thunderstorm") {
                icon = "⛈️";
            }
            else if (data.condition === "Snow") {
                icon = "❄️";
            }
            else if (data.condition === "Mist") {
                icon = "🌫️";
            }

            document.getElementById("weather-icon").innerText = icon;
            // Change Background According to Weather

            if (data.condition === "Clear") {
                document.body.style.background =
                    "linear-gradient(135deg, #74ebd5, #ACB6E5)";
            }
            else if (data.condition === "Clouds") {
                document.body.style.background =
                    "linear-gradient(135deg, #bdc3c7, #2c3e50)";
            }
            else if (data.condition === "Rain") {
                document.body.style.background =
                    "linear-gradient(135deg, #485563, #29323c)";
            }
            else if (data.condition === "Thunderstorm") {
                document.body.style.background =
                    "linear-gradient(135deg, #232526, #414345)";
            }
            else if (data.condition === "Snow") {
                document.body.style.background =
                    "linear-gradient(135deg, #E6DADA, #274046)";
            }
            else {
                document.body.style.background =
                    "linear-gradient(135deg, #74ebd5, #ACB6E5)";
            }

            



            // Update Weather Data
            document.getElementById("city-name").innerText = data.city;
            // document.getElementById("temperature").innerText = data.temperature + "°C";
            document.getElementById("temperature").innerText =convertTemperature(data.temperature);
            document.getElementById("weather-condition").innerText = data.condition;
            // document.getElementById("feels-like").innerText = "Feels Like : " + data.feels_like + "°C";
            document.getElementById("feels-like").innerText ="Feels Like : " + convertTemperature(data.feels_like);
            // document.getElementById("min-max").innerText = "Min : " + data.min_temp + "°C | Max : " + data.max_temp + "°C";
            document.getElementById("min-max").innerText ="Min : " + convertTemperature(data.min_temp) +" | Max : " + convertTemperature(data.max_temp);

            document.getElementById("humidity").innerText = data.humidity + "%";
            document.getElementById("humidity-bar").style.width = data.humidity + "%";
            document.getElementById("wind").innerText = data.wind + " km/h";
            document.getElementById("wind-bar").style.width =Math.min((data.wind / 50) * 100, 100) + "%";
            document.getElementById("pressure").innerText = data.pressure + " hPa";
            document.getElementById("pressure-bar").style.width =Math.min(((data.pressure - 900) / 200) * 100, 100) + "%";
            document.getElementById("visibility").innerText = data.visibility + " km";
            document.getElementById("visibility-bar").style.width =Math.min((data.visibility / 10) * 100, 100) + "%";
          
            // console.log(data.forecast);
            showForecast(data);
            drawChart(data.forecast);
            showHourlyForecast(data.hourly);
            showRainAlert(data.forecast, data.city);

            // Search History
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerText = city;

            // Click History Item
            li.addEventListener("click", function () {
                cityInput.value = city;
                searchButton.click();
            });

            // historyList.prepend(li);
            let history = JSON.parse(localStorage.getItem("history")) || [];
            history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
            history.unshift(city);
            history = history.slice(0, 10);
            localStorage.setItem("history", JSON.stringify(history));
            displayHistory();




        })
        .catch(error => {
            document.getElementById("loader").classList.add("d-none");
            console.error(error);
            alert("Something went wrong!");
        });

});

// Enter Key Search
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});

clearHistory.addEventListener("click", function () {

    historyList.innerHTML = "";

    localStorage.removeItem("history");

});


function updateDateTime() {

    const now = new Date();

    document.getElementById("date-time").innerText =
        now.toLocaleString();

}

updateDateTime();

setInterval(updateDateTime, 1000);


window.onload = function () {

    displayHistory();
    const homeCity = localStorage.getItem("homeCity");

    if(homeCity){

        cityInput.value = homeCity;
        showHomeCity();
        setTimeout(()=>{
            searchButton.click();
        },500);

    }
    displayFavorites();
    

};

locationButton.addEventListener("click", function () {

    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function (position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetch("/weather/location/" + lat + "/" + lon)
                .then(response => response.json())
                .then(data => {

                    if (data.error) {
                        alert("Location not found");
                        return;
                    }

                    // Weather Icon
                    let icon = "☀️";

                    if (data.condition === "Clear") icon = "☀️";
                    else if (data.condition === "Clouds") icon = "☁️";
                    else if (data.condition === "Rain") icon = "🌧️";
                    else if (data.condition === "Thunderstorm") icon = "⛈️";
                    else if (data.condition === "Snow") icon = "❄️";
                    else if (data.condition === "Mist") icon = "🌫️";

                    document.getElementById("weather-icon").innerText = icon;

                    if (data.condition === "Clear") {
                        document.body.style.background =
                            "linear-gradient(135deg, #74ebd5, #ACB6E5)";
                    }
                    else if (data.condition === "Clouds") {
                        document.body.style.background =
                            "linear-gradient(135deg, #bdc3c7, #2c3e50)";
                    }
                    else if (data.condition === "Rain") {
                        document.body.style.background =
                            "linear-gradient(135deg, #485563, #29323c)";
                    }
                    else if (data.condition === "Thunderstorm") {
                        document.body.style.background =
                            "linear-gradient(135deg, #232526, #414345)";
                    }
                    else if (data.condition === "Snow") {
                        document.body.style.background =
                            "linear-gradient(135deg, #E6DADA, #274046)";
                    }
                    else {
                        document.body.style.background =
                            "linear-gradient(135deg, #74ebd5, #ACB6E5)";
                    }

                    document.getElementById("city-name").innerText = data.city;
                    document.getElementById("temperature").innerText = data.temperature + "°C";
                    document.getElementById("weather-condition").innerText = data.condition;
                    document.getElementById("feels-like").innerText ="Feels Like : " + data.feels_like + "°C";
                    document.getElementById("min-max").innerText ="Min : " + data.min_temp + "°C | Max : " + data.max_temp + "°C";
                    document.getElementById("humidity").innerText = data.humidity + "%";
                    document.getElementById("humidity-bar").style.width = data.humidity + "%";
                    document.getElementById("wind-bar").style.width = Math.min(data.wind * 5, 100) + "%";
                    document.getElementById("wind").innerText = data.wind + " km/h";
                    let windPercent = (data.wind / 50) * 100;
                    if (windPercent > 100) windPercent = 100;
                    document.getElementById("wind-bar").style.width =Math.min((data.wind / 50) * 100, 100) + "%";

                    document.getElementById("pressure").innerText = data.pressure + " hPa";
                    let pressurePercent =((data.pressure - 900) / 200) * 100;
                    document.getElementById("pressure-bar").style.width =((data.pressure - 900) / 200) * 100 + "%";
                    document.getElementById("visibility").innerText = data.visibility + " km";
                    document.getElementById("visibility").innerText =data.visibility + " km";
                    let visibilityPercent =(data.visibility / 10) * 100;
                    document.getElementById("visibility-bar").style.width =Math.min((data.visibility / 10) * 100, 100) + "%";
                    showForecast(data);
                    drawChart(data.forecast);
                    showRainAlert(data.forecast, data.city);


                });

        });

    } else {
        alert("Geolocation is not supported.");
    }

});

homeButton.addEventListener("click", function () {

    const city = cityInput.value;

    if(city.trim() === ""){
        alert("Search a city first.");
        return;
    }

    localStorage.setItem("homeCity", city);
    showHomeCity();

    alert(city + " is now your Home City.");

});

favoriteButton.addEventListener("click", function () {

    const city = document.getElementById("city-name").innerText;

    if (
        city === "" ||
        city === "Loading..." ||
        city === "City"
    ) {
        alert("Search a city first.");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(city)) {
        alert(city + " is already in Favorites.");
        return;
    }

    favorites.push(city);

    localStorage.setItem("favorites", JSON.stringify(favorites));

    displayFavorites();

    alert(city + " added to Favorites ⭐");

});

// =========================
// DARK / LIGHT MODE
// =========================

const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.innerText = "☀️";
}

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeToggle.innerText = "☀️";

        localStorage.setItem("theme", "dark");

    } else {

        themeToggle.innerText = "🌙";

        localStorage.setItem("theme", "light");
    }

});









