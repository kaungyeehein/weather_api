const CronJob = require('cron').CronJob;

const taskList = [];

// Start all jobs
const start = (jobs) => {
    const results = [];
    jobs.forEach(job => {
        const result = startById(job);
        results.push(result);
    });
    return results;
};

// Start a job by id
const startById = (job) => {
    if (taskList[job._id]) {
        taskList[job._id].start();
    } else {
        const task = new CronJob(job.cronExpression, () => {
            const date = new Date();
            console.log('onTick:', date, 'jobId:', job._id.toString());
        }, null, true, 'Asia/Yangon');
        taskList[job._id] = task;
    }
    return status(job._id.toString(), taskList[job._id]);
};

// Stop all jobs
const stop = () => {
    const results = [];
    const keys = Object.keys(taskList);
    keys.forEach(key => {
        taskList[key].stop();
        results.push(status(key.toString(), taskList[key]));
        delete taskList[key];
    });
    return results;
};

// Stop a job by id
const stopById = (job) => {
    if (taskList[job._id]) {
        taskList[job._id].stop();
        const result = status(job._id.toString(), taskList[job._id]);
        delete taskList[job._id];
        return result;
    }
};

// Get information of all jobs
const info = () => {
    const results = [];
    const keys = Object.keys(taskList);
    keys.forEach(key => {
        results.push(status(key.toString(), taskList[key]));
    });
    return results;
};

// Get job status (private)
const status = (id, job) => {
    return {
        _id: id,
        lastDate: job.lastDate() || null,
        nextDate: job.nextDates(),
        isRunning: job.running
    };
};

module.exports = {
    start,
    startById,
    stop,
    stopById,
    info
};