const apiKey = "68d3dd9768348be044c7a69307e5db6e";
        const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

        const searchBox = document.querySelector(".haed__wrapper-search input");
        const searchBtn = document.querySelector(".haed__wrapper-search button");
        const weatherIcon = document.querySelector(".weather__icon img");

        async function checkWeather(city) {
            const response = await fetch(apiUrl + city + '&appid=' + apiKey);
            const data = await response.json();

    
            document.getElementById("weatherInfo").classList.remove("hidden");

            document.querySelector(".city__name").innerHTML = data.name;
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

            if(data.weather[0].main == "Clouds"){
                weatherIcon.src = "img/cloudy.png";
            }
            else if(data.weather[0].main == "Mist"){
                weatherIcon.src = "img/mist.png";
            }
            else if(data.weather[0].main == "Snow"){
                weatherIcon.src = "img/snow.png";
            }
            else if(data.weather[0].main == "Clear"){
                weatherIcon.src = "img/sun.png";
            }
            else if(data.weather[0].main == "Rain"){
                weatherIcon.src = "img/cloudy (1).png";
            }
            else if(data.weather[0].main == "Thunderstorm"){
                weatherIcon.src = "img/storm.png";
            }
        };

        searchBtn.addEventListener("click", () => {
            if (searchBox.value.trim() !== "") {
                checkWeather(searchBox.value);
            }
        });