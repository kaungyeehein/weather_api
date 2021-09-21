const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const router = express.Router();

const JobFetch = require('../models/jobFetchModel');

// Get all jobs
router.get('/', async (req, res, next) => {
    try {
        const results = await JobFetch.find();
        res.send(results);
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

// Create a job
router.post('/', async (req, res, next) => {
    try {
        const jobFetch = new JobFetch(req.body);
        const result = await jobFetch.save();
        res.send(result);
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
        const jobFetch = await JobFetch.findById(id);
        if (!jobFetch) {
            throw createError(404, 'Job does not exist.');
        }
        res.send(jobFetch);
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job ID.'));
            return;
        }
        next(error);
    }
});

// Update a job by id
router.patch('/:id', async (req, res, next) => {
    const id = req.params.id;
    const updates = req.body;
    const options = { new: true };
    try {
        const jobFetch = await JobFetch.findByIdAndUpdate(id, updates, options);
        if (!jobFetch) {
            throw createError(404, 'Job does not exist.');
        }
        res.send(jobFetch);
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job ID.'));
            return;
        }
        next(error);
    }
});

// Delete a job by id
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const jobFetch = await JobFetch.findByIdAndDelete(id);
        if (!jobFetch) {
            throw createError(404, 'Job does not exist.');
        }
        res.send(jobFetch);
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job ID.'));
            return;
        }
        next(error);
    }
});

module.exports = router;