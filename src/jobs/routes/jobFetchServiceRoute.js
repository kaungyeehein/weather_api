const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const router = express.Router();

const model = require('../models/jobFetchModel');
const worker = require('../workers/jobFetchWorker');

// Start all jobs
router.get('/start', async (req, res, next) => {
    try {
        const jobs = await model.find();
        if (!jobs.length) {
            throw createError(404, 'Nothing to run');
        }
        // Call Job Worker
        worker.start(jobs);
        res.send("All Jobs are started");
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

// Start a job by id
router.get('/start/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const job = await model.findById(id);
        if (!job) {
            throw createError(404, 'Job does not exist');
        }
        // Call Job Worker
        worker.startById(job);
        res.send("Job is started");
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
        worker.stop();
        res.send("All Jobs are stopped");
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

// Stop a job by id
router.get('/stop/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const job = await model.findById(id);
        if (!job) {
            throw createError(404, 'Job does not exist');
        }
        // Call Job Worker
        worker.stopById(job);
        res.send("Job is stopped");
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
        worker.info();
        res.send("All Jobs info are requested");
    } catch (error) {
        console.log(error.message);
        next(error);
    }
});

module.exports = router;