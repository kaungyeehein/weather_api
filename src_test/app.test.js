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

test('Home Route Test', async () => {
    await supertest(app)
        .get('/')
        .expect(200)
        .then((res) => {
            expect(res.body).toHaveProperty('data');
            expect(res.body.data.status).toBe(200);
            expect(res.body.data.message).toBe('Weather Service API');
        });
});

test('Empty Route Test', async () => {
    await supertest(app)
        .get('/xyz')
        .expect(404)
        .then((res) => {
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.status).toBe(404);
            expect(res.body.error.message).toBe('Not found');
        });
});