const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const router = express.Router();

const JobFetch = require('../models/jobFetchModel');

// Get all jobs
router.get('/', async (req, res, next) => {
    try {
        const jobs = await JobFetch.find();
        if (!jobs.length) {
            throw createError(404, 'Nothing to return');
        }
        res.json({
            'data': jobs
        });
    } catch (error) {
        // console.log(error.message);
        next(error);
    }
});

// Create a job
router.post('/', async (req, res, next) => {
    try {
        if (req.body._id) {
            throw createError(422, 'Job ID should not include');
        }
        const jobFetch = new JobFetch(req.body);
        const job = await jobFetch.save();
        const fulllUrl = req.protocol + '://' + req.get('host') + req.originalUrl + '/';
        res.location(fulllUrl + job._id).status(201);
        res.json({
            'data': job
        });
    } catch (error) {
        // console.log(error);
        if (error.name && error.name === 'ValidationError') {
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
        const job = await JobFetch.findById(id);
        if (!job) {
            throw createError(404, 'Job does not exist');
        }
        res.json({
            'data': job
        });
    } catch (error) {
        // console.log(error.message);
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
        if (req.body._id) {
            throw createError(422, 'Job ID should not include');
        }
        const job = await JobFetch.findByIdAndUpdate(id, update, options);
        if (!job) {
            throw createError(404, 'Job does not exist');
        }
        res.json({
            'data': job
        });
    } catch (error) {
        // console.log(error.message);
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
        const job = await JobFetch.findByIdAndDelete(id);
        if (!job) {
            throw createError(404, 'Job does not exist');
        }
        res.status(204).end();
    } catch (error) {
        // console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job ID'));
            return;
        }
        next(error);
    }
});

module.exports = router;