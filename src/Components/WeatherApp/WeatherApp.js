import React, { useState } from "react";
import WeatherInfo from "./WeatherInfo";
import App_ID from "../lib/appid";
import "../../Styles/Weather.css";

const callApiUrl = query =>
  `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${App_ID}&units=metric`;

const cityRegx = /[a-z,A-Z]/;

const validateCity = city => cityRegx.test(city);

function WeatherApp() {
  const [serchQuery, setSerchQuery] = useState("");
  const [weatherData, setWeatherData] = useState({
    temp: undefined,
    maxTemp: undefined,
    minTemp: undefined,
    country: undefined,
    city: undefined,
    desc: undefined,
    speed: undefined,
    deg: undefined,
    icon: undefined
  });
  const [isValidCity, setIsValidCity] = useState(true);
  function updateSerchQuery(event) {
    setSerchQuery(event.target.value);
    setIsValidCity(
      event.target.value === "" || validateCity(event.target.value)
    );
  }
  async function getWeather() {
    if (!isValidCity || serchQuery === "") {
      setIsValidCity(false);
      return;
    }

    const response = await fetch(callApiUrl(serchQuery));
    if (!response.ok) {
      return;
    }

    const { main, sys, name, weather, wind } = await response.json();
    setWeatherData({
      temp: main.temp,
      maxTemp: main.temp_max,
      minTemp: main.temp_min,
      country: sys.country,
      city: name,
      desc: weather[0].main,
      speed: wind.speed,
      deg: wind.deg,
      icon: weather[0].icon
    });
  }

  return (
    <section className="weather-container">
      <header className="weather-header">
        <h2>Weather Info</h2>
        <div>
          <input
            placeholder="City"
            className="serch-input"
            onChange={updateSerchQuery}
            type="text"
          />
          <button
            onClick={getWeather}
            type="button"
            className="btn btn-outline-warning"
          >
            Get Weather
          </button>
        </div>
      </header>
      <p className="error">{isValidCity ? "" : "Invalid City Name"}</p>
      <section className="weather-info">
        {weatherData.temp ? (
          <WeatherInfo data={weatherData} />
        ) : (
          <p>
            No Weather to Display
            <i className="far fa-sun" />
          </p>
        )}
      </section>
    </section>
  );
}

export default WeatherApp;
