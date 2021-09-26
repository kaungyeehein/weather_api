const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../src/app');
const JobFetch = require('../src/jobs/models/jobFetchModel');

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/JestDB2", { useNewUrlParser: true, useUnifiedTopology: true });
    return;
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    return;
});

describe('Validation Test', () => {

    test('Should not START a job', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start/zzzzzzzzzzzzzzzzzzzzzzzz');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(400);
        expect(res.body.error.message).toBe('Invalid Job Id');
    });

    test('Should not STOP a job', async () => {
        const res = await supertest(app).get('/jobs/fetchService/stop/zzzzzzzzzzzzzzzzzzzzzzzz');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(400);
        expect(res.body.error.message).toBe('Invalid Job Id');
    });

});

describe('Empty Test', () => {

    test('Should not START any jobs', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Nothing to run');
    });

    test('Should not START a job', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start/999999999999999999999999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job does not exist');
    });

    test('Should not STOP any jobs', async () => {
        const res = await supertest(app).get('/jobs/fetchService/stop');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Nothing to stop');
    });

    test('Should not STOP a job', async () => {
        const res = await supertest(app).get('/jobs/fetchService/stop/999999999999999999999999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job does not exist');
    });

    test('Should not GET any info of jobs', async () => {
        const res = await supertest(app).get('/jobs/fetchService/info');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job is nothing');
    });

});

describe('Business Test', () => {

    beforeEach(async () => {
        await JobFetch.insertMany([
            { _id: '111111111111111111111111', cronExpression: '* * * * *', jobName: 'TestJob1', fetchEndpoint: 'TestEndpoint1', collectionName: 'TestCollection1', enable: true },
            { _id: '222222222222222222222222', cronExpression: '*/2 * * * *', jobName: 'TestJob2', fetchEndpoint: 'TestEndpoint2', collectionName: 'TestCollection2', enable: true },
            { _id: '333333333333333333333333', cronExpression: '*/4 * * * *', jobName: 'TestJob3', fetchEndpoint: 'TestEndpoint3', collectionName: 'TestCollection3', enable: true },
            { _id: '444444444444444444444444', cronExpression: '*/8 * * * *', jobName: 'TestJob4', fetchEndpoint: 'TestEndpoint4', collectionName: 'TestCollection4', enable: false },
        ]);
    });

    afterEach(async () => {
        await supertest(app).get('/jobs/fetchService/stop');
        await JobFetch.deleteMany();
    });

    test('Should START all jobs and STOP all jobs', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toBe(3);
        expect(res.body.data[0]._id).toBe('111111111111111111111111');
        expect(res.body.data[0].isRunning).toBe(true);
        expect(res.body.data[0]).toHaveProperty('nextDate');
        expect(res.body.data[1]._id).toBe('222222222222222222222222');
        expect(res.body.data[1].isRunning).toBe(true);
        expect(res.body.data[1]).toHaveProperty('nextDate');
        expect(res.body.data[2]._id).toBe('333333333333333333333333');
        expect(res.body.data[2].isRunning).toBe(true);
        expect(res.body.data[2]).toHaveProperty('nextDate');

        const res2 = await supertest(app).get('/jobs/fetchService/info');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(3);
        expect(res2.body.data[0].isRunning).toBe(true);
        expect(res2.body.data[1].isRunning).toBe(true);
        expect(res2.body.data[2].isRunning).toBe(true);

        const res3 = await supertest(app).get('/jobs/fetchService/stop');
        expect(res3.statusCode).toBe(200);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.length).toBe(3);
        expect(res3.body.data[0].isRunning).toBe(false);
        expect(res3.body.data[1].isRunning).toBe(false);
        expect(res3.body.data[2].isRunning).toBe(false);

        const res4 = await supertest(app).get('/jobs/fetchService/info');
        expect(res4.statusCode).toBe(404);
        expect(res4.body).toHaveProperty('error');
        expect(res4.body.error.status).toBe(404);
        expect(res4.body.error.message).toBe('Job is nothing');
    });

    test('Should START a job and STOP a job', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start/222222222222222222222222');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('222222222222222222222222');
        expect(res.body.data.isRunning).toBe(true);
        expect(res.body.data).toHaveProperty('nextDate');

        const res2 = await supertest(app).get('/jobs/fetchService/info');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(1);
        expect(res2.body.data[0]._id).toBe('222222222222222222222222');
        expect(res2.body.data[0].isRunning).toBe(true);
        expect(res2.body.data[0]).toHaveProperty('nextDate');

        const res3 = await supertest(app).get('/jobs/fetchService/stop/222222222222222222222222');
        expect(res3.statusCode).toBe(200);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data._id).toBe('222222222222222222222222');
        expect(res3.body.data.isRunning).toBe(false);
        expect(res3.body.data).toHaveProperty('nextDate');

        const res4 = await supertest(app).get('/jobs/fetchService/info');
        expect(res4.statusCode).toBe(404);
        expect(res4.body).toHaveProperty('error');
        expect(res4.body.error.status).toBe(404);
        expect(res4.body.error.message).toBe('Job is nothing');
    });

    test('Should START all jobs and STOP a job', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toBe(3);
        expect(res.body.data[0]._id).toBe('111111111111111111111111');
        expect(res.body.data[0].isRunning).toBe(true);
        expect(res.body.data[0]).toHaveProperty('nextDate');
        expect(res.body.data[1]._id).toBe('222222222222222222222222');
        expect(res.body.data[1].isRunning).toBe(true);
        expect(res.body.data[1]).toHaveProperty('nextDate');
        expect(res.body.data[2]._id).toBe('333333333333333333333333');
        expect(res.body.data[2].isRunning).toBe(true);
        expect(res.body.data[2]).toHaveProperty('nextDate');

        const res2 = await supertest(app).get('/jobs/fetchService/info');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(3);
        expect(res2.body.data[0].isRunning).toBe(true);
        expect(res2.body.data[1].isRunning).toBe(true);
        expect(res2.body.data[2].isRunning).toBe(true);

        const res3 = await supertest(app).get('/jobs/fetchService/stop/333333333333333333333333');
        expect(res3.statusCode).toBe(200);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data._id).toBe('333333333333333333333333');
        expect(res3.body.data.isRunning).toBe(false);
        expect(res3.body.data).toHaveProperty('nextDate');

        const res4 = await supertest(app).get('/jobs/fetchService/info');
        expect(res4.statusCode).toBe(200);
        expect(res4.body).toHaveProperty('data');
        expect(res4.body.data.length).toBe(2);
        expect(res4.body.data[0].isRunning).toBe(true);
        expect(res4.body.data[0]._id).toBe('111111111111111111111111');
        expect(res4.body.data[1].isRunning).toBe(true);
        expect(res4.body.data[1]._id).toBe('222222222222222222222222');
    });

    test('Should START a job and STOP all jobs', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start/111111111111111111111111');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('111111111111111111111111');
        expect(res.body.data.isRunning).toBe(true);
        expect(res.body.data).toHaveProperty('nextDate');

        const res2 = await supertest(app).get('/jobs/fetchService/info');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(1);
        expect(res2.body.data[0]._id).toBe('111111111111111111111111');
        expect(res2.body.data[0].isRunning).toBe(true);
        expect(res2.body.data[0]).toHaveProperty('nextDate');

        const res3 = await supertest(app).get('/jobs/fetchService/stop');
        expect(res3.statusCode).toBe(200);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data.length).toBe(1);
        expect(res3.body.data[0]._id).toBe('111111111111111111111111');
        expect(res3.body.data[0].isRunning).toBe(false);
        expect(res3.body.data[0]).toHaveProperty('nextDate');

        const res4 = await supertest(app).get('/jobs/fetchService/info');
        expect(res4.statusCode).toBe(404);
        expect(res4.body).toHaveProperty('error');
        expect(res4.body.error.status).toBe(404);
        expect(res4.body.error.message).toBe('Job is nothing');
    });

    test('Should not STOP a job', async () => {
        const res = await supertest(app).get('/jobs/fetchService/stop/333333333333333333333333');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job is not running');
    });

    test('Should START a job twice', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start/333333333333333333333333');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('333333333333333333333333');
        expect(res.body.data.isRunning).toBe(true);
        expect(res.body.data).toHaveProperty('nextDate');

        const res2 = await supertest(app).get('/jobs/fetchService/info');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(1);
        expect(res2.body.data[0]._id).toBe('333333333333333333333333');
        expect(res2.body.data[0].isRunning).toBe(true);
        expect(res2.body.data[0]).toHaveProperty('nextDate');

        const res3 = await supertest(app).get('/jobs/fetchService/start/333333333333333333333333');
        expect(res3.statusCode).toBe(200);
        expect(res3.body).toHaveProperty('data');
        expect(res3.body.data._id).toBe('333333333333333333333333');
        expect(res3.body.data.isRunning).toBe(true);
        expect(res3.body.data).toHaveProperty('nextDate');

        const res4 = await supertest(app).get('/jobs/fetchService/info');
        expect(res4.statusCode).toBe(200);
        expect(res4.body).toHaveProperty('data');
        expect(res4.body.data.length).toBe(1);
        expect(res4.body.data[0]._id).toBe('333333333333333333333333');
        expect(res4.body.data[0].isRunning).toBe(true);
        expect(res4.body.data[0]).toHaveProperty('nextDate');
    });

    test('Should not START a job (disable)', async () => {
        const res = await supertest(app).get('/jobs/fetchService/start/444444444444444444444444');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job is not enable');
    });

});