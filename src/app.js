const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const morgan = require('morgan');

const app = express();

// Middleware
// HTTP request logger
app.use(morgan('common'));
// HTTP request body parser for JSON and URLencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.all('/', (req, res) => {
    res.json({
        'name': 'Weather Service API',
        'status': 'running'
    });
});
// API Route
app.use('/api', require('./api'));
// Jobs Route
app.use('/jobs', require('./jobs'));

// Default 404 error for other routes
app.use((req, res, next) => {
    next(createError(404, 'Not found'));
});

// Default error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server is listening at port ' + PORT);
});

// dbName: 'WeatherAPI'
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongodb: connected...');
}).catch(err => {
    console.log('Mongodb: ' + err.message);
});