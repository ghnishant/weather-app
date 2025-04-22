const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // Added PORT configuration

let recentSearches = [];

// Middleware
app.use(express.static('public'));

// Routes
app.get('/weather', async (req, res) => {
  const city = req.query.city;

  if (!city) return res.json({ error: "City name is required" });

  const API_KEY = process.env.API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;

  try {
    const response = await axios.get(url);
    const weather = response.data;

    const cityName = weather.name;
    if (!recentSearches.includes(cityName)) {
      recentSearches.unshift(cityName);
      if (recentSearches.length > 5) recentSearches.pop();
    }

    res.json({
      name: weather.name,
      country: weather.sys.country,
      temp: weather.main.temp,
      humidity: weather.main.humidity,
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      recent: recentSearches
    });
  } catch (error) {
    res.json({ error: "City not found or API error" });
  }
});

// Start server with PORT configuration
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});