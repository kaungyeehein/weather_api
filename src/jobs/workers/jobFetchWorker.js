const CronJob = require('cron').CronJob;

const taskList = [];

// Start all jobs
const start = async (jobs) => {
    jobs.forEach(job => {
        startById(job);
    });
};

// Start a job
const startById = async (job) => {
    if (taskList[job._id]) {
        taskList[job._id].start();
    } else {
        const task = new CronJob('* * * * *', () => {
            const date = new Date();
            console.log('onTick:', date, 'jobId:', job._id);
        }, null, true, 'Asia/Yangon');
        taskList[job._id] = task;
    }
};

// Stop all jobs
const stop = async () => {
    const keys = Object.keys(taskList);
    keys.forEach(key => {
        taskList[key].stop();
    });
};

// Stop a job
const stopById = async (job) => {
    taskList[job._id].stop();
};

// Get information of all jobs
const info = async () => {
    const info = [];
    const keys = Object.keys(taskList);
    keys.forEach(key => {
        info.push(key + ' Running ' + taskList[key].running);
    });
    console.log(info);
};

module.exports = {
    start,
    startById,
    stop,
    stopById,
    info
};