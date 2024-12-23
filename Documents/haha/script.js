dotenv.config();// Load environment variables
import express from 'express';
import fetch from 'node-fetch'; // Optional if fetch is globally available
import dotenv from 'dotenv';
import cors from 'cors';
import NodeCache from 'node-cache';
////import fetch from 'node-fetch';
//const express = require('express');
//const fetch = require('node-fetch');
//const dotenv = require('dotenv');
//const cors=require('cors');//Import CORS middleware


//const NodeCache = require('node-cache');


const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });
 // Cache with 1 hour TTL (Time to Live)

app.use(express.static('public'));// Serve static files (like your frontend)
app.use(cors());  //Enable CORS for all routes

app.get('/weather', async (req, res) => {
    const { city, lat, lon } = req.query;

    const apiKey = process.env.API_KEY;  // Securely get your API key from .env file
    console.log('API Key:', apiKey);
   // Check if the API key is missing
   if (!apiKey) {
    console.error("API key is missing");
    return res.status(500).json({ error: 'API key not found in environment variables' });
}
    // Validate city or location parameters
    if (!city && (!lat || !lon)) {
        console.error("API key is miss");
        return res.status(400).json({ error: 'City name or location (latitude and longitude) is required' });
    }
    const cacheKey=city|| `${lat},${lon}`;
     // Cache by city or lat/lon

    // Check cache for the weather data
    const cachedData = myCache.get(cacheKey);
    
    if (cachedData) {
        // If the data is cached, return it immediately
        console.log('Returning cached data');
        return res.json(cachedData);
    }
    // Construct the API URL dynamically
    const url = city
        ? `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;


    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('OpenWeatherMap Response:', data);  // Log the response data

         // Check for successful API response
        if (data.cod === 200) {
            myCache.set(city, data);  // Cache the response data for future requests
            res.json(data);
        } else {
            res.status(404).json({ error: 'City not found' });
        }

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while fetching weather data' });
    }
});

