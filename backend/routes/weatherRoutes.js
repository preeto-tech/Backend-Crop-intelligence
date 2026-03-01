const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/weather?city=Delhi
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({
        message: "City name is required"
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        message: "Weather API key is not configured on the server"
      });
    }

    // Using OpenWeatherMap API
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${apiKey}`
    );

    const data = response.data;

    // Structured response for frontend
    res.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather[0].main,
      icon: data.weather[0].icon
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