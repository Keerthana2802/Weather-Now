import React, { useState, useEffect } from "react";

export default function WeatherForm({ city, setCity, getWeather, setCoords }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (city.length > 2) fetchSuggestions(city);
      else setSuggestions([]);
    }, 400);
    return () => clearTimeout(delay);
  }, [city]);

  const fetchSuggestions = async (query) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${query}&format=json&limit=5`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSelect = (suggestion) => {
 
    const displayName = suggestion.display_name;
    setCity(displayName);
    setCoords({ lat: suggestion.lat, lon: suggestion.lon });

    setSuggestions([]);
    setShowSuggestions(false);

    setTimeout(() => {
      document.getElementById("weather-form-btn").click();
    }, 100);
  };

  return (
    <form onSubmit={getWeather} className="weather-form">
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => city.length > 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        <button id="weather-form-btn" type="submit">
          Get Weather
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((s, index) => (
            <li key={index} onClick={() => handleSelect(s)}>
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
