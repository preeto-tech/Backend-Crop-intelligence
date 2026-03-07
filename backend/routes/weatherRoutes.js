const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/weather?city=Delhi or ?lat=21.14&lon=79.08
router.get('/', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({
        message: "City name or coordinates (lat, lon) are required"
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "Weather API key is not configured on the server"
      });
    }

    // Using OpenWeatherMap API
    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${apiKey}`;
    }

    const response = await axios.get(url);
    const data = response.data;

    // Structured response for frontend
    res.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      icon: data.weather[0].icon,
      visibility: data.visibility / 1000, // in km
      feels_like: Math.round(data.main.feels_like),
      temp_min: Math.round(data.main.temp_min),
      temp_max: Math.round(data.main.temp_max),
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    });

  } catch (error) {
    console.error("Weather API Error:", error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({
        message: "City not found. Please check the spelling."
      });
    }

    res.status(500).json({
      message: "Failed to fetch weather data",
      error: error.message
    });
  }
});

module.exports = router;