const router = require('express').Router();
const errorMiddleware = require('../middlewares/error-middleware');
const usersRoutes = require('./usersRoute');
const articlesRoutes = require('./articlesRoute');

router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);

router.use((req, res, next) => {
    next({ name: 'PageNotFound '});
})

router.use(errorMiddleware);

module.exports = router;