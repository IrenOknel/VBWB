import React, { useState, useEffect } from "react";
import axios from "axios";
import "./weatherForecast.css";
import NavBar from "./NavBar";
import Footer from "./Footer";
import WeatherRecommendation from "./WeatherRecommendation";
import weatherDescriptions from "./weatherConditionDescriptions";

import calendarIcon from "../assets/calendaricon.png";
import precipitationIcon from "../assets/precipitationicon.png";
import humidityIcon from "../assets/humidity.png";
import windIcon from "../assets/windicon.png";

const WeatherForecast = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("celsius");

  // Function to handle form submission
  const onSubmit = (event) => {
    event.preventDefault();
    const searchField = document.querySelector("#search-field");
    const city = searchField.value.trim();
    if (city) {
      getTemperatureByCity(city);
    }
  };

  // Function to fetch weather data by city name
  const getTemperatureByCity = (city) => {
    const apiKey = "c992ae743db9ca92d9553bba574fc8a2";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    // Fetch current weather
    axios
      .get(apiUrl)
      .then((response) => {
        setCurrentWeather(response.data);
      })
      .catch((error) => {
        console.error("Error fetching weather data for city:", error);
        alert("City not found!");
      });

    // Fetch forecast data
    axios
      .get(forecastUrl)
      .then((response) => {
        setForecast(response.data.list);
      })
      .catch((error) => {
        console.error("Error fetching forecast data for city:", error);
      });
  };

  useEffect(() => {
    // Initial weather fetch for default location
    const defaultCity = "Montreal"; // Default city
    getTemperatureByCity(defaultCity);
  }, []);

  const showFahrenheit = (e) => {
    e.preventDefault();
    setUnit("fahrenheit");
  };

  const showCelsius = (e) => {
    e.preventDefault();
    setUnit("celsius");
  };

  const convertToCelsiusOrFahrenheit = (temp) => {
    return unit === "celsius" ? temp : (temp * 9) / 5 + 32;
  };

  if (!currentWeather || forecast.length === 0) {
    return <div>Loading...</div>;
  }

  const { main, weather, wind, sys, name, dt } = currentWeather;
  const currentTemp = convertToCelsiusOrFahrenheit(main.temp);
  const currentCondition = weather[0].main;
  const currentDate = new Date(dt * 1000)
    .toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    })
    .replace(" at ", " | ");

  const weatherDescription =
    weatherDescriptions[currentCondition] || "Enjoy the weather!";

  const dailyForecast = [];
  for (let i = 0; i < forecast.length; i++) {
    const forecastDate = new Date(forecast[i].dt * 1000);
    if (forecastDate.getUTCHours() === 12) {
      dailyForecast.push(forecast[i]);
      if (dailyForecast.length === 7) break;
    }
  }

  return (
    <div className="weather-forecast">
      <NavBar />
      <div className="content">
        <div className="left-content">
          <WeatherRecommendation weather={currentWeather} />
        </div>

        <div className="center-content">
          {/* Search form */}
          <form onSubmit={onSubmit} className="search-form">
            <input
              type="text"
              id="search-field"
              placeholder="Search City"
              className="search-input"
            />
            <button type="submit" className="search-button">
              <img src={require("../assets/iconsearch.png")} alt="Search" />
            </button>
          </form>

          <h1>
            {name}, {sys.country}
          </h1>
          <div className="temperature-unit">
            <span className="temperature">{currentTemp.toFixed(1)}°</span>
            <span className="unit-toggle">
              {unit === "celsius" ? (
                <>
                  C |{" "}
                  <a href="/" onClick={showFahrenheit}>
                    F
                  </a>
                </>
              ) : (
                <>
                  <a href="/" onClick={showCelsius}>
                    C
                  </a>{" "}
                  | F
                </>
              )}
            </span>
          </div>
          <p className="current-condition">{currentCondition}</p>
          <p className="weather-description">{weatherDescription}</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather[0].icon}.png`}
            alt={currentCondition}
            className="weather-icon-large weather-icon-styled"
          />
        </div>

        <div className="right-content">
          <div className="weather-details">
            <div className="weather-detail-item">
              <img src={calendarIcon} alt="Date" className="weather-icon" />
              <p>{currentDate}</p>
            </div>
            <div className="weather-detail-item">
              <img
                src={precipitationIcon}
                alt="Precipitation"
                className="weather-icon"
              />
              <p>Precipitation: 0%</p>
            </div>
            <div className="weather-detail-item">
              <img src={humidityIcon} alt="Humidity" className="weather-icon" />
              <p>Humidity: {main.humidity}%</p>
            </div>
            <div className="weather-detail-item">
              <img src={windIcon} alt="Wind" className="weather-icon" />
              <p>Wind: {wind.speed} km/h</p>
            </div>
          </div>

          <div className="weekly-forecast">
            {dailyForecast.map((day, index) => (
              <div key={index} className="forecast-item">
                <p>
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "short"
                  })}
                </p>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt={day.weather[0].description}
                  className="forecast-icon"
                />
                <p className="forecast-temp">
                  {convertToCelsiusOrFahrenheit(day.main.temp_max).toFixed(1)}°{" "}
                  {unit === "celsius" ? "C" : "F"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WeatherForecast;
