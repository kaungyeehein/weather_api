const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../src/app');
const JobFetch = require('../src/jobs/models/jobFetchModel');

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/JestDB1", { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('Validation Test', () => {

    test('Should not POST a job without jobName', async () => {
        const res = await supertest(app).post('/jobs/fetch').send({
            cronExpression: '* * * * *',
            fetchEndpoint: 'TestEndpoint1',
            collectionName: 'TestCollection1'
        });
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(422);
        expect(res.body.error.message).toBe('JobFetch validation failed: jobName: Path `jobName` is required.');
    });

    test('Should not POST a job without cronExpression', async () => {
        const res = await supertest(app).post('/jobs/fetch').send({
            jobName: 'TestJob1',
            fetchEndpoint: 'TestEndpoint1',
            collectionName: 'TestCollection1'
        });
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(422);
        expect(res.body.error.message).toBe('JobFetch validation failed: cronExpression: Path `cronExpression` is required.');
    });

    test('Should not POST a job without fetchEndpoint', async () => {
        const res = await supertest(app).post('/jobs/fetch').send({
            jobName: 'TestJob1',
            cronExpression: '* * * * *',
            collectionName: 'TestCollection1'
        });
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(422);
        expect(res.body.error.message).toBe('JobFetch validation failed: fetchEndpoint: Path `fetchEndpoint` is required.');
    });

    test('Should not POST a job without collectionName', async () => {
        const res = await supertest(app).post('/jobs/fetch').send({
            jobName: 'TestJob1',
            cronExpression: '* * * * *',
            fetchEndpoint: 'TestEndpoint1'
        });
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(422);
        expect(res.body.error.message).toBe('JobFetch validation failed: collectionName: Path `collectionName` is required.');
    });

    test('Should not POST a job with valid id', async () => {
        const res = await supertest(app).post('/jobs/fetch').send({
            _id: '111111111111111111111111',
            jobName: 'TestJob1',
            cronExpression: '* * * * *',
            fetchEndpoint: 'TestEndpoint1',
            collectionName: 'TestCollection1'
        });
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(422);
        expect(res.body.error.message).toBe('Job ID should not include');
    });

    test('Should not POST a job with invalid id', async () => {
        const res = await supertest(app).post('/jobs/fetch').send({
            _id: 'zzzzzzzzzzzzzzzzzzzzzzzz',
            jobName: 'TestJob1',
            cronExpression: '* * * * *',
            fetchEndpoint: 'TestEndpoint1',
            collectionName: 'TestCollection1'
        });
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(422);
        expect(res.body.error.message).toBe('Job ID should not include');
    });

    test('Should not GET a job', async () => {
        const res = await supertest(app).get('/jobs/fetch/zzzzzzzzzzzzzzzzzzzzzzzz');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(400);
        expect(res.body.error.message).toBe('Invalid Job ID');
    });

    test('Should not PATCH a job', async () => {
        const res = await supertest(app).patch('/jobs/fetch/zzzzzzzzzzzzzzzzzzzzzzzz').send({
            jobName: 'TestJob1Update',
            cronExpression: '*/2 * * * *',
            fetchEndpoint: 'TestEndpoint1Update',
            collectionName: 'TestCollection1Update'
        });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(400);
        expect(res.body.error.message).toBe('Invalid Job ID');
    });

    test('Should not PATCH a job with id', async () => {
        const res = await supertest(app).patch('/jobs/fetch/333333333333333333333333').send({
            _id: '999999999999999999999999'
        });
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(422);
        expect(res.body.error.message).toBe('Job ID should not include');
    });

    test('Should not DELETE a job', async () => {
        const res = await supertest(app).delete('/jobs/fetch/zzzzzzzzzzzzzzzzzzzzzzzz');
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(400);
        expect(res.body.error.message).toBe('Invalid Job ID');
    });

});

describe('Empty Test', () => {

    test('Should not GET any jobs', async () => {
        const res = await supertest(app).get('/jobs/fetch');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Nothing to return');
    });

    test('Should not GET a job', async () => {
        const res = await supertest(app).get('/jobs/fetch/999999999999999999999999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job does not exist');
    });

    test('Should not PATCH a job', async () => {
        const res = await supertest(app).patch('/jobs/fetch/999999999999999999999999').send({
            jobName: 'TestJob1Update',
            fetchEndpoint: 'TestEndpoint1Update',
            collectionName: 'TestCollection1Update'
        });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job does not exist');
    });

    test('Should not DELETE a job', async () => {
        const res = await supertest(app).delete('/jobs/fetch/999999999999999999999999');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Job does not exist');
    });

});

describe('Business Test', () => {

    beforeEach(async () => {
        await JobFetch.insertMany([
            { _id: '111111111111111111111111', cronExpression: '* * * * *', jobName: 'TestJob1', fetchEndpoint: 'TestEndpoint1', collectionName: 'TestCollection1' },
            { _id: '222222222222222222222222', cronExpression: '*/2 * * * *', jobName: 'TestJob2', fetchEndpoint: 'TestEndpoint2', collectionName: 'TestCollection2' },
            { _id: '333333333333333333333333', cronExpression: '*/4 * * * *', jobName: 'TestJob3', fetchEndpoint: 'TestEndpoint3', collectionName: 'TestCollection3', enable: false },
        ]);
    });

    afterEach(async () => {
        await JobFetch.deleteMany();
    });

    test('Should GET all jobs', async () => {
        const res = await supertest(app).get('/jobs/fetch/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.length).toBe(3);
        expect(res.body.data[0]._id).toBe('111111111111111111111111');
        expect(res.body.data[0].jobName).toBe('TestJob1');
        expect(res.body.data[0].cronExpression).toBe('* * * * *');
        expect(res.body.data[0].fetchEndpoint).toBe('TestEndpoint1');
        expect(res.body.data[0].collectionName).toBe('TestCollection1');
        expect(res.body.data[0].enable).toBe(true);
    });

    test('Should POST a job', async () => {
        const res = await supertest(app).post('/jobs/fetch').send({
            jobName: 'TestJob4',
            cronExpression: '*/8 * * * *',
            fetchEndpoint: 'TestEndpoint4',
            collectionName: 'TestCollection4'
        });
        expect(res.statusCode).toBe(201);
        expect(res.header).toHaveProperty('location');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('_id');
        expect(res.body.data.jobName).toBe('TestJob4');
        expect(res.body.data.cronExpression).toBe('*/8 * * * *');
        expect(res.body.data.fetchEndpoint).toBe('TestEndpoint4');
        expect(res.body.data.collectionName).toBe('TestCollection4');
        expect(res.body.data.enable).toBe(true);

        // Should be return array of jobs
        const res2 = await supertest(app).get('/jobs/fetch');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(4);
    });

    test('Should GET a job by id', async () => {
        const res = await supertest(app).get('/jobs/fetch/222222222222222222222222');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('222222222222222222222222');
        expect(res.body.data.jobName).toBe('TestJob2');
        expect(res.body.data.cronExpression).toBe('*/2 * * * *');
        expect(res.body.data.fetchEndpoint).toBe('TestEndpoint2');
        expect(res.body.data.collectionName).toBe('TestCollection2');
        expect(res.body.data.enable).toBe(true);
    });

    test('Should PATCH a job with jobName', async () => {
        const res = await supertest(app).patch('/jobs/fetch/333333333333333333333333').send({
            jobName: 'TestJob3Update'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('333333333333333333333333');
        expect(res.body.data.jobName).toBe('TestJob3Update');
        expect(res.body.data.cronExpression).toBe('*/4 * * * *');
        expect(res.body.data.fetchEndpoint).toBe('TestEndpoint3');
        expect(res.body.data.collectionName).toBe('TestCollection3');
        expect(res.body.data.enable).toBe(false);

        // Should be return array of jobs
        const res2 = await supertest(app).get('/jobs/fetch');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(3);
    });

    test('Should PATCH a job with cronExpression', async () => {
        const res = await supertest(app).patch('/jobs/fetch/333333333333333333333333').send({
            cronExpression: '* * * * * *'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('333333333333333333333333');
        expect(res.body.data.jobName).toBe('TestJob3');
        expect(res.body.data.cronExpression).toBe('* * * * * *');
        expect(res.body.data.fetchEndpoint).toBe('TestEndpoint3');
        expect(res.body.data.collectionName).toBe('TestCollection3');
        expect(res.body.data.enable).toBe(false);

        // Should be return array of jobs
        const res2 = await supertest(app).get('/jobs/fetch');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(3);
    });

    test('Should PATCH a job with fetchEndpoint', async () => {
        const res = await supertest(app).patch('/jobs/fetch/333333333333333333333333').send({
            fetchEndpoint: 'TestEndpoint3Update'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('333333333333333333333333');
        expect(res.body.data.jobName).toBe('TestJob3');
        expect(res.body.data.cronExpression).toBe('*/4 * * * *');
        expect(res.body.data.fetchEndpoint).toBe('TestEndpoint3Update');
        expect(res.body.data.collectionName).toBe('TestCollection3');
        expect(res.body.data.enable).toBe(false);

        // Should be return array of jobs
        const res2 = await supertest(app).get('/jobs/fetch');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(3);
    });

    test('Should PATCH a job with collectionName', async () => {
        const res = await supertest(app).patch('/jobs/fetch/333333333333333333333333').send({
            collectionName: 'TestCollection3Update'
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('333333333333333333333333');
        expect(res.body.data.jobName).toBe('TestJob3');
        expect(res.body.data.cronExpression).toBe('*/4 * * * *');
        expect(res.body.data.fetchEndpoint).toBe('TestEndpoint3');
        expect(res.body.data.collectionName).toBe('TestCollection3Update');
        expect(res.body.data.enable).toBe(false);

        // Should be return array of jobs
        const res2 = await supertest(app).get('/jobs/fetch');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(3);
    });

    test('Should PATCH a job with enable', async () => {
        const res = await supertest(app).patch('/jobs/fetch/333333333333333333333333').send({
            enable: true
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data._id).toBe('333333333333333333333333');
        expect(res.body.data.jobName).toBe('TestJob3');
        expect(res.body.data.cronExpression).toBe('*/4 * * * *');
        expect(res.body.data.fetchEndpoint).toBe('TestEndpoint3');
        expect(res.body.data.collectionName).toBe('TestCollection3');
        expect(res.body.data.enable).toBe(true);

        // Should be return array of jobs
        const res2 = await supertest(app).get('/jobs/fetch');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(3);
    });

    test('Should DELETE a job by id', async () => {
        const res = await supertest(app).delete('/jobs/fetch/222222222222222222222222');
        expect(res.statusCode).toBe(204);
        expect(res.body.length).toBeUndefined();

        // Should be return array of jobs
        const res2 = await supertest(app).get('/jobs/fetch');
        expect(res2.statusCode).toBe(200);
        expect(res2.body).toHaveProperty('data');
        expect(res2.body.data.length).toBe(2);
        expect(res2.body.data[0]._id).toBe('111111111111111111111111');
        expect(res2.body.data[1]._id).toBe('333333333333333333333333');
    });

});