const articlesController = require('./../controllers/articlesController');
const authMiddleware = require('./../middlewares/auth-middleware');

const router = require('express').Router();

router.get('/', authMiddleware, articlesController.getAllArticle);
router.get('/:id',authMiddleware, articlesController.getArticleById);
router.post('/',authMiddleware, articlesController.createArticle);
router.put('/:id',authMiddleware, articlesController.updateArticle);
router.delete('/:id',authMiddleware, articlesController.removeArticle);

module.exports = router;

/**
 * @swagger
 * /articles:
 *  get:
 *   tags:
 *     - Articles
 *   summary: Get all data article
 *   description: Finds all data article
 *   security:
 *    - bearerAuth: []
 *   responses: 
 *    200:
 *     description: Successfully get all data article
 *    400:
 *     description: Unauthorized
 * 
 *  post:
 *   tags:
 *     - Articles
 *   summary: Create a new article
 *   description: Article created endpoint
 *   security:
 *    - bearerAuth: []
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties: 
 *        title:
 *         type: string
 *        description:
 *         type: string
 *        image_url:
 *         type: string
 *   responses:
 *    200:
 *     description: Article created successfully
 *    400:
 *     description: Unauthorized
 */

/**
 * @swagger
 * /articles/{id}:
 *  get:
 *   tags:
 *    - Articles
 *   summary: Get data article by id
 *   description: Finds data article with id
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *       minimum: 1
 *      description: The article ID
 *   responses:
 *    200:
 *     description: Successfully get data by id
 *    400:
 *     description: Unauthorized
 * 
 *  put:
 *   tags:
 *    - Articles
 *   summary: Update an existing article
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *       minimum: 1
 *      description: The article ID
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *        description:
 *         type: string
 *        image_url:
 *         type: string
 *   responses:
 *    200:
 *     description: Article updated successfully
 *    400:
 *     description: Unauthorized
 * 
 *  delete:
 *   tags:
 *    - Articles
 *   summary: Deleted the article by id
 *   security:
 *    - bearerAuth: []
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: integer
 *       minimum: 1
 *      description: The article ID
 *   responses:
 *    200:
 *     description: Article deleted successfully
 *    400:
 *     description: Unauthorized
 */