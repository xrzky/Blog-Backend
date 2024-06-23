const articlesController = require('./../controllers/articlesController');
const authMiddleware = require('./../middlewares/auth-middleware');

const router = require('express').Router();

router.get('/', authMiddleware, articlesController.getAllArticle);
router.get('/:id',authMiddleware, articlesController.getArticleById);
router.post('/',authMiddleware, articlesController.createArticle);
router.put('/:id',authMiddleware, articlesController.updateArticle);
router.delete('/:id',authMiddleware, articlesController.removeArticle);

module.exports = router;