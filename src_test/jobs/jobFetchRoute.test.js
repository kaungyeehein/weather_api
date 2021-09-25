const app = require('../../src/app');
const mongoose = require('mongoose');
const supertest = require('supertest');

beforeEach((done) => {
    mongoose.connect("mongodb://localhost:27017/JestDB",
        { useNewUrlParser: true, useUnifiedTopology: true },
        () => done());
});

afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done());
    });
});

test('Should not GET any jobs (empty test)', async () => {
    await supertest(app)
        .get('/jobs/fetch')
        .expect(404)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(404);
            expect(res.body.error.message).toBe('Nothing to return');
        });
});

test('Should not POST a job without jobName', async () => {
    await supertest(app)
        .post('/jobs/fetch')
        .send({
            fetchEndpoint: 'endpoint1',
            collectionName: 'TestCollection1'
        })
        .expect(422)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(422);
            expect(res.body.error.message).toBe('JobFetch validation failed: jobName: Path `jobName` is required.');
        });
});

test('Should not POST a job without fetchEndpoint', async () => {
    await supertest(app)
        .post('/jobs/fetch')
        .send({
            jobName: 'Test Job 1',
            collectionName: 'TestCollection1'
        })
        .expect(422)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(422);
            expect(res.body.error.message).toBe('JobFetch validation failed: fetchEndpoint: Path `fetchEndpoint` is required.');
        });
});

test('Should not POST a job without collectionName', async () => {
    await supertest(app)
        .post('/jobs/fetch')
        .send({
            jobName: 'Test Job 1',
            fetchEndpoint: 'endpoint1'
        })
        .expect(422)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(422);
            expect(res.body.error.message).toBe('JobFetch validation failed: collectionName: Path `collectionName` is required.');
        });
});

test('Should POST a job and GET a job by id', async () => {
    let id;

    await supertest(app)
        .post('/jobs/fetch')
        .send({
            jobName: 'Test Job 1',
            fetchEndpoint: 'endpoint1',
            collectionName: 'TestCollection1'
        })
        .expect(201)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.jobName).toBe('Test Job 1');
            expect(res.body.data.fetchEndpoint).toBe('endpoint1');
            expect(res.body.data.collectionName).toBe('TestCollection1');
            id = res.body.data._id.toString();
        });

    await supertest(app)
        .get('/jobs/fetch/' + id)
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toBe(id);
            expect(res.body.data.jobName).toBe('Test Job 1');
            expect(res.body.data.fetchEndpoint).toBe('endpoint1');
            expect(res.body.data.collectionName).toBe('TestCollection1');
        });

    // Should be POST second job
    await supertest(app)
        .post('/jobs/fetch')
        .send({
            jobName: 'Test Job 2',
            fetchEndpoint: 'endpoint2',
            collectionName: 'TestCollection2'
        })
        .expect(201)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('_id');
            expect(res.body.data.jobName).toBe('Test Job 2');
            expect(res.body.data.fetchEndpoint).toBe('endpoint2');
            expect(res.body.data.collectionName).toBe('TestCollection2');
        });

    // Should be return array of jobs
    await supertest(app)
        .get('/jobs/fetch')
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toBe(2);
            expect(res.body.data[0]).toHaveProperty('_id');
            expect(res.body.data[0]).toHaveProperty('jobName');
            expect(res.body.data[0]).toHaveProperty('fetchEndpoint');
            expect(res.body.data[0]).toHaveProperty('collectionName');
        });

    // Should be update a job by id
    await supertest(app)
        .patch('/jobs/fetch/' + id)
        .send({
            jobName: 'Test Job 1 update',
            fetchEndpoint: 'endpoint1update',
            collectionName: 'TestCollection1update'
        })
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data._id).toBe(id);
            expect(res.body.data.jobName).toBe('Test Job 1 update');
            expect(res.body.data.fetchEndpoint).toBe('endpoint1update');
            expect(res.body.data.collectionName).toBe('TestCollection1update');
        });

    // Should be delete a job by id
    await supertest(app)
        .delete('/jobs/fetch/' + id)
        .expect(204)
        .then((res) => {
            expect(res.body.length).toBeUndefined();
        });

    // Should be return array of jobs
    await supertest(app)
        .get('/jobs/fetch')
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.length).toBe(1);
            expect(res.body.data[0]).toHaveProperty('_id');
            expect(res.body.data[0]).toHaveProperty('jobName');
            expect(res.body.data[0]).toHaveProperty('fetchEndpoint');
            expect(res.body.data[0]).toHaveProperty('collectionName');
        });

});

test('Should not POST a job (empty test)', async () => {
    await supertest(app)
        .post('/jobs/fetch')
        .send({
            _id: '6149e0fc6d3b09bb9fa447c9',
            jobName: 'Test Job 1',
            fetchEndpoint: 'endpoint1',
            collectionName: 'TestCollection1'
        })
        .expect(422)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(422);
            expect(res.body.error.message).toBe('Job ID should not include');
        });
});

test('Should not GET a job (empty test)', async () => {
    await supertest(app)
        .get('/jobs/fetch/6149e0fc6d3b09bb9fa447c9')
        .expect(404)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(404);
            expect(res.body.error.message).toBe('Job does not exist');
        });
});

test('Should not PATCH a job (empty test)', async () => {
    await supertest(app)
        .patch('/jobs/fetch/6149e0fc6d3b09bb9fa447c9')
        .send({
            jobName: 'Test Job 1 update',
            fetchEndpoint: 'endpoint1update',
            collectionName: 'TestCollection1update'
        })
        .expect(404)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(404);
            expect(res.body.error.message).toBe('Job does not exist');
        });
});

test('Should not DELETE a job (empty test)', async () => {
    await supertest(app)
        .delete('/jobs/fetch/6149e0fc6d3b09bb9fa447c9')
        .expect(404)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(404);
            expect(res.body.error.message).toBe('Job does not exist');
        });
});

test('Should not POST a job (invalid test)', async () => {
    await supertest(app)
        .post('/jobs/fetch')
        .send({
            _id: '6149e0fc6d3b09bb9fa447c9z',
            jobName: 'Test Job 1',
            fetchEndpoint: 'endpoint1',
            collectionName: 'TestCollection1'
        })
        .expect(422)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(422);
            expect(res.body.error.message).toBe('Job ID should not include');
        });
});

test('Should not GET a job (invalid test)', async () => {
    await supertest(app)
        .get('/jobs/fetch/6149e0fc6d3b09bb9fa447c9z')
        .expect(400)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(400);
            expect(res.body.error.message).toBe('Invalid Job ID');
        });
});

test('Should not PATCH a job (invalid test)', async () => {
    await supertest(app)
        .patch('/jobs/fetch/6149e0fc6d3b09bb9fa447c9z')
        .send({
            jobName: 'Test Job 1 update',
            fetchEndpoint: 'endpoint1update',
            collectionName: 'TestCollection1update'
        })
        .expect(400)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(400);
            expect(res.body.error.message).toBe('Invalid Job ID');
        });
});

test('Should not DELETE a job (invalid test)', async () => {
    await supertest(app)
        .delete('/jobs/fetch/6149e0fc6d3b09bb9fa447c9z')
        .expect(400)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(400);
            expect(res.body.error.message).toBe('Invalid Job ID');
        });
});