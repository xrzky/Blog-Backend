const request = require('supertest');
const app = require('./../app');
const { sequelize } = require('./../models/index');
const { queryInterface } = sequelize;
const { v4: uuidv4} = require('uuid');
const { sign } = require('../helpers/jwt');
const { hash } = require('../helpers/hash');

const user = {
    id: uuidv4(),
    fullname: 'Luki Rizki',
    email: 'lukirizki@gmail.com',
    password: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
};

const userToken = sign({ id: user.id, email: user.email });
const userNotExistsToken = sign({ id: '53e2ede0-7d81-45c5-94a5-873887715c90', email: 'notexists@gmail.com'})

const defaultArticle = {
    title: 'Default Article',
    description: 'Default Article Description',
    image_url: 'https://picsum.photos/20/20',
    createdAt: new Date(),
    updatedAt: new Date()
};

const createArticle = {
    title: 'Buat Artikel Baru',
    description: 'Ini description artikel baru',
    image_url: 'https://picsum.photos/200/200'
};

const updateArticle = {
    title: 'Update Artikel 1',
    description: 'Ini description update artikel 1',
    image_url: 'https://picsum.photos/500/500'
};

beforeAll(async () => {
    await queryInterface.bulkDelete('Articles', null, {
        truncate: true,
        restartIdentity: true,
        cascade: true
    });
    await queryInterface.bulkDelete('Users', null, {
        truncate: true,
        restartIdentity: true,
        cascade: true
    })
    const hashedUser = { ...user  };
    hashedUser.password = hash(hashedUser.password);
    await queryInterface.bulkInsert('Users', [hashedUser]);
    await queryInterface.bulkInsert('Articles', [defaultArticle]);
});

afterAll(async () => {
    await sequelize.close();
})

/* GET ALL ARTICLES */
describe('GET /articles', () => {
    test('should return HTTP status code 200', async () => {
        const { body } = await request(app)
            .get('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200)
        expect(body.length).toBe(1);
        expect(body[0]).toEqual({
            id: expect.any(Number),
            title: defaultArticle.title,
            description: defaultArticle.description,
            image_url: defaultArticle.image_url,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });
    });

    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
            .get('/articles')
            .expect(401)
        expect(body.message).toMatch(/No Authorization/i);
    });

    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
            .get('/articles')
            .set('Authorization', 'Bearer ')
            .expect(401)
        expect(body.message).toMatch(/invalid token/i);
    });

    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
            .get('/articles')
            .set('Authorization', 'Bearer wrong.token.input')
            .expect(401)
        expect(body.message).toMatch(/invalid token/i);
    });

    test('should return HTTP status code 400 when user does not exist', async () => {
        const { body } = await request(app)
            .get('/articles')
            .set('Authorization', `Bearer ${userNotExistsToken}`)
            .expect(401)
        expect(body.message).toMatch(/unauthorized/i);
    });
});

/* POST Articles */
describe('POST /articles', () => {
    test('should return HTTP code 200 when create articles success', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: createArticle.title,
                description: createArticle.description,
                image_url: createArticle.image_url
            })
            .expect(201);
        expect(body).toEqual({
            id: 2,
            title: createArticle.title,
            description: createArticle.description,
            image_url: createArticle.image_url,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });
    });
    test('should return HTTP code 400 when create articles without title', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                description: createArticle.description,
                image_url: createArticle.image_url
            })
            .expect(400);
        expect(body.message).toEqual(expect.arrayContaining(['Title cannot be omitted']));
    });
    test('should return HTTP code 400 when create articles with empty string title', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: '',
                description: createArticle.description,
                image_url: createArticle.image_url
            })
            .expect(400);
        expect(body.message).toEqual(expect.arrayContaining(['Title cannot be an empty string']));
    });
    test('should return HTTP code 400 when create articles without description', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: createArticle.title,
                image_url: createArticle.image_url
            })
            .expect(400);
        expect(body.message).toEqual(expect.arrayContaining(['Description cannot be omitted']));
    });
    test('should return HTTP code 400 when create articles with empty string description', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: createArticle.title,
                description: '',
                image_url: createArticle.image_url
            })
            .expect(400);
        expect(body.message).toEqual(expect.arrayContaining(['Description cannot be an empty string']));
    });
    test('should return HTTP code 400 when create articles without image_url', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: createArticle.title,
                description: createArticle.description
            })
            .expect(400);
        expect(body.message).toEqual(expect.arrayContaining(['Image URL cannot be omitted']));
    });
    test('should return HTTP code 400 when create articles with empty string image_url', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: createArticle.title,
                description: createArticle.description,
                image_url: ''
            })
            .expect(400);
        expect(body.message).toEqual(expect.arrayContaining(['Image URL cannot be an empty string']));
    });
    test('should return HTTP code 400 when create articles with wrong image_url', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: createArticle.title,
                description: createArticle.description,
                image_url: 'wrongformatimage'
            })
            .expect(400);
        expect(body.message).toEqual(expect.arrayContaining(['Wrong URL format']));
    });
    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
            .post('/articles')
            .expect(401);
        expect(body.message).toMatch(/No Authorization/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer `)
            .expect(401);
        expect(body.message).toMatch(/Invalid Token/i);
    });
    test('should return HTTP status code 401 when token wrong', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer wrong.token.input `)
            .expect(401);
        expect(body.message).toMatch(/Invalid Token/i);
    });
    test('should return HTTP status code 401 when user does not exists', async () => {
        const { body } = await request(app)
            .post('/articles')
            .set('Authorization', `Bearer ${userNotExistsToken}`)
            .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
});

/* GET Article By Id */
describe('GET /articles/:id', () => {
    test('should return HTTP status code 200 when find article by id success', async () => {
        const { body } = await request(app)
            .get('/articles/1')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);
        expect(body).toEqual({
            id: 1,
            title: defaultArticle.title,
            description: defaultArticle.description,
            image_url: defaultArticle.image_url,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });
    });
    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
            .get('/articles/1')
            .expect(401);
        expect(body.message).toMatch(/No Authorization/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
            .get('/articles/1')
            .set('Authorization', `Bearer `)
            .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when token wrong input', async () => {
        const { body } = await request(app)
            .get('/articles/1')
            .set('Authorization', `Bearer wrong.token.input`)
            .expect(401);
        expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when user does not exists', async () => {
        const { body } = await request(app)
            .get('/articles/1')
            .set('Authorization', `Bearer ${userNotExistsToken}`)
            .expect(401);
        expect(body.message).toMatch(/unauthorized/i);
    });
    test('should return HTTP status code 401 when article or data not found', async () => {
        const { body } = await request(app)
            .get('/articles/99')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(404);
        expect(body.message).toMatch(/data not found/i);
    });
});

/* Update Article By Id */
describe('PUT /articles/:id', () => {
    test('should return HTTP status code 200 when article updated successfully', async () => {
        const { body } = await request(app)
            .put('/articles/1')
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                title: updateArticle.title,
                description: updateArticle.description,
                image_url: updateArticle.image_url
            })
            .expect(200);
        expect(body).toEqual({
            id: 1,
            title: updateArticle.title,
            description: updateArticle.description,
            image_url: updateArticle.image_url,
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        });
    });
    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
            .put('/articles/1')
            .expect(401);
        expect(body.message).toMatch(/No authorization/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
            .put('/articles/1')
            .set('Authorization', `Bearer `)
            .expect(401);
        expect(body.message).toMatch(/Invalid Token/i);
    });
    test('should return HTTP status code 401 when token wrong input', async () => {
        const { body } = await request(app)
            .put('/articles/1')
            .set('Authorization', `Bearer wrong.input.token`)
            .expect(401);
        expect(body.message).toMatch(/Invalid Token/i);
    });
    test('should return HTTP status code 401 when user does not exists', async () => {
        const { body } = await request(app)
            .put('/articles/1')
            .set('Authorization', `Bearer ${userNotExistsToken}`)
            .expect(401);
        expect(body.message).toMatch(/Unauthorized/i);
    });
    test('should return HTTP status code 404 when article or data not found', async () => {
        const { body } = await request(app)
            .put('/articles/99')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(404);
        expect(body.message).toMatch(/cannot update because data article not found/i);
    });
});

/* Delete Article By Id */
describe('DELETE /articles/:id', () => {
    test('should return HTTP status code 200 when delete article successfully', async () => {
        const { body } = await request(app)
        .delete('/articles/1')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);
    expect(body.message).toMatch(/This articles has been successfully deleted/i)
    });
    test('should return HTTP status code 401 when no authorization', async () => {
        const { body } = await request(app)
        .delete('/articles/1')
        .expect(401);
    expect(body.message).toMatch(/No Authorization/i);
    });
    test('should return HTTP status code 401 when no token provided', async () => {
        const { body } = await request(app)
        .delete('/articles/1')
        .set('Authorization', `Bearer `)
        .expect(401);
    expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when token wrong input', async () => {
        const { body } = await request(app)
        .delete('/articles/1')
        .set('Authorization', `Bearer wrong.input.token`)
        .expect(401);
    expect(body.message).toMatch(/invalid token/i);
    });
    test('should return HTTP status code 401 when user does not exist', async () => {
        const { body } = await request(app)
        .delete('/articles/1')
        .set('Authorization', `Bearer ${userNotExistsToken}`)
        .expect(401);
    expect(body.message).toMatch(/unauthorized/i);
    });
    test('should return HTTP status code 401 when data article not found', async () => {
        const { body } = await request(app)
        .delete('/articles/99')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(404);
    expect(body.message).toMatch(/Cannot delete because data not found/i);
    });
});