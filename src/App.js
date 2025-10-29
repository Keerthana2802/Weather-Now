import React, { useState } from "react";
import "./App.css";
import WeatherForm from "./components/WeatherForm";
import WeatherDisplay from "./components/WeatherDisplay";
import mascot from "./assets/mascot.png"; 

export default function App() {
  const [city, setCity] = useState("");
  const [coords, setCoords] = useState(null); 
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const weatherDescriptions = {
    0: "Clear sky ☀️",
    1: "Mainly clear 🌤️",
    2: "Partly cloudy ⛅",
    3: "Overcast ☁️",
    45: "Fog 🌫️",
    48: "Rime fog 🌫️",
    51: "Light drizzle 🌦️",
    53: "Moderate drizzle 🌦️",
    55: "Dense drizzle 🌧️",
    61: "Slight rain 🌦️",
    63: "Moderate rain 🌧️",
    65: "Heavy rain 🌧️",
    71: "Slight snow ❄️",
    73: "Moderate snow ❄️",
    75: "Heavy snow ❄️",
    95: "Thunderstorm ⛈️",
    96: "Thunderstorm + hail ⛈️🌩️",
    99: "Thunderstorm + heavy hail ⛈️🌩️",
  };

  const getWeather = async (e) => {
    e.preventDefault();
    setError("");
    setWeather(null);

    if (!city || city.trim().length < 2) {
      setError("Please enter a valid city name.");
      return;
    }

    setLoading(true);

    try {
      let lat, lon;

      if (coords) {
        lat = coords.lat;
        lon = coords.lon;
      } else {

        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?city=${city}&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.length) {
          setError("City not found! Please try again.");
          setLoading(false);
          return;
        }

        const { display_name } = geoData[0];
        lat = geoData[0].lat;
        lon = geoData[0].lon;

        const normalizedCity = city.trim().toLowerCase();
        const normalizedDisplay = display_name.trim().toLowerCase();

        if (
          !normalizedDisplay.startsWith(normalizedCity) &&
          !normalizedDisplay.includes(`, ${normalizedCity}`)
        ) {
          setError("Couldn't find that city. Try entering a full name.");
          setLoading(false);
          return;
        }
      }

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        temp: weatherData.current_weather.temperature,
        wind: weatherData.current_weather.windspeed,
        code: weatherData.current_weather.weathercode,
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <div className="left">
        <img src={mascot} alt="Weather mascot" className="mascot" />
      </div>

      <div className="right">
        <h1>Weather Now</h1>

        <WeatherForm
          city={city}
          setCity={setCity}
          getWeather={getWeather}
          setCoords={setCoords}
        />

        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <p>Fetching weather data...</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {weather && (
          <WeatherDisplay
            city={city}
            weather={weather}
            description={weatherDescriptions[weather.code] || "Unknown"}
          />
        )}
      </div>
    </div>
  );
}
