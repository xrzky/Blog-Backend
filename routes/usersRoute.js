const UsersController = require('./../controllers/usersController');

const router = require('express').Router();

router.post('/login', UsersController.signIn);
router.post('/register', UsersController.signUp);

module.exports = router;