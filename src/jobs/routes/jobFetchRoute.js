const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const router = express.Router();

const model = require('../models/jobFetchModel');

// Get all jobs
router.get('/', async (req, res, next) => {
    try {
        const result = await model.find();
        if (!result.length) {
            throw createError(404, 'Nothing to return');
        }
        res.json({
            'data': result
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

// Create a job
router.post('/', async (req, res, next) => {
    try {
        const job = new model(req.body);
        const result = await job.save();
        const fulllUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
        res.location(fulllUrl + result._id).status(201);
        res.json({
            'data': result
        });
    } catch (error) {
        console.log(error.message);
        if (error.name === 'ValidationError') {
            next(createError(422, error.message));
            return;
        }
        next(error);
    }
});

// Get a job by id
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await model.findById(id);
        if (!result) {
            throw createError(404, 'Job does not exist');
        }
        res.json({
            'data': result
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job ID'));
            return;
        }
        next(error);
    }
});

// Update a job by id
router.patch('/:id', async (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    const options = { new: true };
    try {
        const result = await model.findByIdAndUpdate(id, update, options);
        if (!result) {
            throw createError(404, 'Job does not exist');
        }
        res.json({
            'data': result
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job ID'));
            return;
        }
        next(error);
    }
});

// Delete a job by id
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const result = await model.findByIdAndDelete(id);
        if (!result) {
            throw createError(404, 'Job does not exist');
        }
        res.status(204).end();
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job ID'));
            return;
        }
        next(error);
    }
});

module.exports = router;