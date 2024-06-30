const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models/index');
const { queryInterface } = sequelize;
const { v4: uuidv4 } = require('uuid');
const { hash } = require('./../helpers/hash');
const { verify } = require("../helpers/jwt");

const user = {
  id: uuidv4(),
  fullname: 'Luki Rizki',
  email: 'lukirizki@gmail.com',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const userTest = {
  fullname: 'Rizki',
  email: 'rizki@gmail.com',
  password: 'password',
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  const hashedUser = { ...user };
  hashedUser.password = hash(hashedUser.password);
  await queryInterface.bulkInsert("Users", [hashedUser]);
});

afterAll(async () => {
  await sequelize.close();
});

/* Register Test */
describe("POST /users/register", () => {
  test("should return HTTP code 201 when register success", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, email: userTest.email, password: userTest.password })
      .expect(201);
    expect(body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(body.fullname).toEqual("Rizki");
    expect(body.email).toEqual("rizki@gmail.com");
  });

  test("should return HTTP code 400 when register without fullname", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ email: userTest.email, password: userTest.password })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['name cannot be omitted']))
  });

  test("should return HTTP code 400 when register with empty string fullname", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: '', email: userTest.email, password: userTest.password })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['name cannot be an empty string']))
  });

  test("should return HTTP code 400 when register without email", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, password: userTest.password })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['email cannot be omitted']))
  });

  test("should return HTTP code 400 when register with empty string email", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, email: '', password: userTest.password })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['email cannot be an empty string']))
  });

  test("should return HTTP code 400 when register without email format", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, email: 'wrongformatemail', password: userTest.password })
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['email must be an accurate email format']))
  });

  test("should return HTTP code 400 when register with already existed email", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, email: user.email, password: userTest.password })
      .expect(400);
    expect(body.message).toMatch(/Email already registered/i)
  });

  test("should return HTTP code 400 when register without password", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, email: user.email})
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['password cannot be omitted']))
  });

  test("should return HTTP code 400 when register with empty string password", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, email: user.email, password: ''})
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['password cannot be an empty string']))
  });
  
  test("should return HTTP code 400 when register with under 6 character", async () => {
    const { body } = await request(app)
      .post("/users/register")
      .send({ fullname: userTest.fullname, email: user.email, password: '123'})
      .expect(400);
    expect(body.message).toEqual(expect.arrayContaining(['password must be 6-10 character']))
  });
});


/* Login Test */
describe("POST /users/login", () => {
    test("should return HTTP code 200 when login success", async () => {
        const { body } = await request(app)
         .post("/users/login")
         .send({ email: user.email, password: user.password})
         .expect(200);
        expect(body).toEqual({ token: expect.any(String) });
        const claim = verify(body.token);
        expect(claim).toEqual({ id: user.id, email: user.email, iat: expect.any(Number) });
    });

    test("should return HTTP code 401 when login without email", async () => {
        const { body } = await request(app)
         .post("/users/login")
         .send({ password: user.password })
         .expect(401);
        expect(body.message).toMatch(/Email or Password is Wrong/i);
    });

    test("should return HTTP code 401 when login with empty string email", async () => {
        const { body } = await request(app)
         .post("/users/login")
         .send({ email: '', password: user.password })
         .expect(401);
        expect(body.message).toMatch(/Email or Password is Wrong/i);
    });

    test("should return HTTP code 401 when login with wrong email", async () => {
        const { body } = await request(app)
         .post("/users/login")
         .send({ email: 'wrong@mail.com', password: user.password })
         .expect(401);
        expect(body.message).toMatch(/Email or Password is Wrong/i);
    });

    test("should return HTTP code 401 when login without password", async () => {
        const { body } = await request(app)
         .post("/users/login")
         .send({ email: user.email })
         .expect(401);
        expect(body.message).toMatch(/Email or Password is Wrong/i);
    });

    test("should return HTTP code 401 when login with empty string password", async () => {
        const { body } = await request(app)
         .post("/users/login")
         .send({ email: user.email, password: '' })
         .expect(401);
        expect(body.message).toMatch(/Email or Password is Wrong/i);
    });

    test("should return HTTP code 401 when login with wrong password", async () => {
        const { body } = await request(app)
         .post("/users/login")
         .send({ email: user.email, password: 'wrongpassword' })
         .expect(401);
        expect(body.message).toMatch(/Email or Password is Wrong/i);
    });
});