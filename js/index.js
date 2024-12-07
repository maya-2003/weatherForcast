function searchCityWeather() {
    var city = document.getElementById("search").value;
    var key = "eb2c4f0568084f53b17222628240512"; 
    var api = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${encodeURIComponent(city)}&days=3`;

    var httpReq = new XMLHttpRequest();
    httpReq.open("get", api);
    httpReq.responseType = "json";
    httpReq.send();

    httpReq.addEventListener("load", function () {
        if (httpReq.status === 200) {
            var data = httpReq.response;
            updateForecastTable(data);
        } else {
            console.error("Error fetching data:", httpReq.statusText);
        }
    });

    httpReq.addEventListener("error", function () {
        console.error("Network error occurred");
    });
}

function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position),
                (error) => reject(error)
            );
        } else {
            reject(new Error("Error in Geolocation"));
        }
    });
}

function getCityData(lat, lon) {
    var apiKey = "eb2c4f0568084f53b17222628240512";
    var apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=3`;
    var httpReq = new XMLHttpRequest();
    httpReq.open("GET", apiUrl, true);
    httpReq.responseType = "json";
    httpReq.send();

    httpReq.addEventListener("load", function () {
        if (httpReq.status === 200) {
            var data = httpReq.response;
            updateForecastTable(data);
        } else {
            console.error("Error fetching data:", httpReq.statusText);
        }
    });

    httpReq.addEventListener("error", function () {
        console.error("Network error occurred");
    });
}

function updateForecastTable(data) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"];
    var today = data.current;
    var todayData = data.forecast.forecastday[0];
    var date = new Date(todayData.date);
    var day = date.getDate();
    var month = months[date.getMonth()];
    document.getElementById("dayToday").innerText = days[new Date(todayData.date).getDay()];
    document.getElementById("dateToday").innerText = `${day}${month}`;
    document.getElementById("location").innerText = data.location.name;
    document.getElementById("degreeTemp").innerHTML = `${today.temp_c}<sup>o</sup>C`;
    document.getElementById("weatherIcon").src = `https:${today.condition.icon}`;
    document.getElementById("weatherIcon").alt = today.condition.text;
    document.getElementById("weatherStatus").innerText = today.condition.text;
    document.getElementById("rainChance").innerHTML = `<img src="images/icon-umberella.png" alt="">${todayData.day.daily_chance_of_rain}%`;
    document.getElementById("windSpeed").innerHTML = `<img src="images/icon-wind.png" alt="">${today.wind_kph} km/h`;
    document.getElementById("windDirection").innerHTML = `<img src="images/icon-compass.png" alt="">${today.wind_dir}`;
    const tommorowData = data.forecast.forecastday[1];
    document.getElementById("dayTomorrow").innerText = days[new Date(tommorowData.date).getDay()];
    document.getElementById("iconTomorrow").src = `https:${tommorowData.day.condition.icon}`;
    document.getElementById("iconTomorrow").alt = tommorowData.day.condition.text;
    document.getElementById("maxTempTomorrow").innerHTML = `${tommorowData.day.maxtemp_c}<sup>o</sup>C`;
    document.getElementById("minTempTomorrow").innerHTML = `${tommorowData.day.mintemp_c}<sup>o</sup>C`;
    document.getElementById("statusTomorrow").innerText = tommorowData.day.condition.text;
    const dayAfterTommorowData = data.forecast.forecastday[2];
    document.getElementById("dayAfterTomorrow").innerText = days[new Date(dayAfterTommorowData.date).getDay()];
    document.getElementById("iconDayAfterTomorrow").src = `https:${dayAfterTommorowData.day.condition.icon}`;
    document.getElementById("iconDayAfterTomorrow").alt = dayAfterTommorowData.day.condition.text;
    document.getElementById("maxTempDayAfterTomorrow").innerHTML = `${dayAfterTommorowData.day.maxtemp_c}<sup>o</sup>C`;
    document.getElementById("minTempDayAfterTomorrow").innerHTML = `${dayAfterTommorowData.day.mintemp_c}<sup>o</sup>C`;
    document.getElementById("statusDayAfterTomorrow").innerText = dayAfterTommorowData.day.condition.text;
}

async function findLocation() {
    try {
        var position = await getLocation();
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        getCityData(lat, lon);
    } catch (error) {
        console.error("Error finding location");
    }
}

document.addEventListener("DOMContentLoaded", findLocation);
document.getElementById("submitCity").addEventListener("click", searchCityWeather);
