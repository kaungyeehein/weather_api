const express = require('express');
const createError = require('http-errors');

const app = express();

// HTTP request body parser for JSON and URLencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home Route
app.all('/', (req, res) => {
    res.json({
        data: {
            'status': 200,
            'message': 'Weather Service API'
        }
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
    res.json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });

    // if (err.status) {
    //     res.status(err.status);
    //     res.json({
    //         error: {
    //             status: err.status,
    //             message: err.message
    //         }
    //     });
    //     return;
    // }
    // res.status(500);
    // res.json({
    //     error: {
    //         status: 500,
    //         message: 'An unknown error occurred'
    //     }
    // });
});

// For Testing
module.exports = app;