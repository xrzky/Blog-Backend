const UsersController = require('./../controllers/usersController');

const router = require('express').Router();

router.post('/login', UsersController.signIn);
router.post('/register', UsersController.signUp);

module.exports = router;

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
 *      - Users
 *     summary: Registers a new user
 *     description: User registration endpoint.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     tags:
 *      - Users
 *     summary: Logs in a user
 *     description: User login endpoint.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid input
 */