const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        version: 1.0,
        route: "admin"
    });
});

router.get('/update', async (req, res) => {
    const API_KEY = process.env.openweathermap_api_key;
    const data = await fetch('https://api.openweathermap.org/data/2.5/weather?id=1298824&appid=' + API_KEY);
    const json = await data.json();
    res.json(json);
});

module.exports = router;