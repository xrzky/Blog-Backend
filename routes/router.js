const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./../swagger');
const errorMiddleware = require('../middlewares/error-middleware');
const usersRoutes = require('./usersRoute');
const articlesRoutes = require('./articlesRoute');

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/users', usersRoutes);
router.use('/articles', articlesRoutes);

router.use((req, res, next) => {
    next({ name: 'PageNotFound' });
});

router.use(errorMiddleware);

module.exports = router;