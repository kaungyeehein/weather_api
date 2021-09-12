const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
    const data = await fetch('https://api.openweathermap.org/data/2.5/weather?id=1298824&appid=' + process.env.openweathermap_api_key);
    const json = await data.json();
    res.json(json);
});

app.listen(3000, () => {
    console.log('Server is listening at port 3000...');
});