import React from "react";

export default function WeatherDisplay({ city, weather, description }) {
  return (
    <div className="card">
      <h2>{city.split(",")[0]}</h2>
      <p>Temperature: {weather.temp}°C🌡️ </p>
      <p>Wind Speed: {weather.wind} km/h💨 </p>
      <p>Weather: {description}</p>
    </div>
  );
}