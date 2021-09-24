const app = require('../src/app');
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

// Home Route Test
test('GET /', async () => {
    const result = {
        status: 200,
        message: 'Weather Service API'
    };

    await supertest(app).get('/')
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.status).toBe(result.status);
            expect(res.body.data.message).toBe(result.message);
        });
});

// Empty Route Test
test('GET /xyz', async () => {
    const error = {
        status: 404,
        message: 'Not found'
    };

    await supertest(app).get('/xyz')
        .expect(404)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(error.status);
            expect(res.body.error.message).toBe(error.message);
        });
});