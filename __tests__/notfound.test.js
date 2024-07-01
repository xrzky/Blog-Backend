const request = require('supertest');
const app = require('../app');

describe('wrong url endpoint', () => {
    test('wrong endpoint test', async () => {
        const { body } = await request(app)
         .get('/wrongendpoint')
         .expect(404);
        expect(body.message).toMatch(/Oopss.. Nothing Here/i)
    });
});