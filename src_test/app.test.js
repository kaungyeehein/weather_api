const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../src/app');

beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/JestDB", { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe('App Test', () => {

    test('Home Route Test', async () => {
        const res = await supertest(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.status).toBe(200);
        expect(res.body.data.message).toBe('Weather Service API');
    });

    test('Empty Route Test', async () => {
        const res = await supertest(app).get('/xyz');
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
        expect(res.body.error.status).toBe(404);
        expect(res.body.error.message).toBe('Not found');
    });

});