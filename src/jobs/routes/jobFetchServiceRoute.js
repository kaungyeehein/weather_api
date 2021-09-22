const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const router = express.Router();

const JobFetch = require('../models/jobFetchModel');
const worker = require('../workers/jobFetchWorker');

// Start all jobs
router.get('/start', async (req, res, next) => {
    try {
        const jobs = await JobFetch.find();
        if (!jobs.length) {
            throw createError(404, 'Nothing to run');
        }
        // Call Job Worker
        const results = worker.start(jobs);
        res.json({
            'data': results
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

// Start a job by id
router.get('/start/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const job = await JobFetch.findById(id);
        if (!job) {
            throw createError(404, 'Job does not exist');
        }
        // Call Job Worker
        const result = worker.startById(job);
        res.json({
            'data': result
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job Id'));
            return;
        }
        next(error);
    }
});

// Stop all jobs
router.get('/stop', async (req, res, next) => {
    try {
        // Call Job Worker
        const results = worker.stop();
        if (!results.length) {
            throw createError(404, 'Job is not running');
        }
        res.json({
            'data': results
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

// Stop a job by id
router.get('/stop/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const job = await JobFetch.findById(id);
        if (!job) {
            throw createError(404, 'Job does not exist');
        }
        // Call Job Worker
        const result = worker.stopById(job);
        if (!result) {
            throw createError(404, 'Job is not running');
        }
        res.json({
            'data': result
        });
    } catch (error) {
        console.log(error.message);
        if (error instanceof mongoose.CastError) {
            next(createError(400, 'Invalid Job Id'));
            return;
        }
        next(error);
    }
});

// Get all jobs information
router.get('/info', async (req, res, next) => {
    try {
        // Call Job Worker
        const results = worker.info();
        if (!results.length) {
            throw createError(404, 'Job is nothing');
        }
        res.json({
            'data': results
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

module.exports = router;