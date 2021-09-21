const express = require('express');
const router = express.Router();

router.use('/fetch', require('./routes/jobFetchRoute'));

module.exports = router;

// const CronJob = require('cron').CronJob;

// let date = new Date();
// date.setMinutes(date.getMinutes() + 2);
// const task = new CronJob('*/1 * * * * *', () => {
//     const d = new Date();
//     console.log('Specific date:', date, ', onTick at:', d);
// }, null, false, 'Asia/Yangon');

// router.get('/start', (req, res) => {
//     task.start();
//     console.log('System TZ next 5: ', task.nextDates());
//     res.json({
//         status: "Job Started"
//     });
// });

// router.get('/stop', (req, res) => {
//     task.stop();
//     const lastExecutionDate = task.lastDate();
//     res.json({
//         status: "Job Stopped",
//         lastExecutionDate
//     });
// });

// router.get('/check', (req, res) => {
//     console.log('Is job running? ', task.running);
//     res.json({
//         status: "Check Job",
//         isJobRunning: task.running
//     });
// });

// router.get('/info', (req, res) => {
//     console.log(task);
//     res.json({
//         status: "Job Info"
//     });
// });