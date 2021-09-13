const express = require('express');
const morgan = require('morgan');

const app = express();

// Middleware
// HTTP request logger
app.use(morgan('common'));
// HTTP request body parser for JSON and URLencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Route
app.use('/api', require('./api'));

module.exports = app;