const { Article } = require('./../models/index');

class articlesController {
    static async createArticle(req, res, next) {
        const { title, description, image_url } = req.body;
        const data = { title, description, image_url };
        try {
            const articles = await Article.create(data);
            if(!articles) throw { name: 'SequelizeValidationError' };
            res.status(201).json({
                id: articles.id,
                title: articles.title,
                description: articles.description,
                image_url: articles.image_url,
                createdAt: articles.createdAt,
                updatedAt: articles.updatedAt
            })
        } catch (error) {
            next(error);
        }
    }
    static async getAllArticle(req, res, next) {
        try {
            const articles = await Article.findAll();
            if (!articles.length === 0) throw { name: 'DataNotFound' };
            const data = articles.map(articles => ({
                id: articles.id,
                title: articles.title,
                description: articles.description,
                image_url: articles.image_url,
                createdAt: articles.createdAt,
                updatedAt: articles.updatedAt
            }))
            res.status(200).json(data)
        } catch (error) {
            next(error);
        }
    }

    static async getArticleById(req, res, next){
        const { id } = req.params;
        try {
            const articles = await Article.findByPk(id);
            if (!articles) throw { name: 'DataNotFound' };
            res.status(200).json({
                id: articles.id,
                title: articles.title,
                description: articles.description,
                image_url: articles.image_url,
                createdAt: articles.createdAt,
                updatedAt: articles.updatedAt
            })
        } catch (error) {
            next(error);
        }
    }

    static async updateArticle(req, res, next) {
        const { id } = req.params;
        const { title, description, image_url } = req.body;
        const data = { title, description, image_url };
        try {
            const [affectedRows, updatedArticles] = await Article.update(data, { where: { id }, returning: true });
            if(affectedRows === 0 || !updatedArticles.length) throw ({ name: 'cantUpdateArticle' });
            const article = updatedArticles[0]
            if(!article) throw ({ name: 'SequelizeValidationError' });
            res.status(200).json({
                id: article.id,
                title: article.title,
                description: article.description,
                image_url: article.image_url,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt
            })
        } catch (error) {
            next(error);
        }
    }

    static async removeArticle(req, res, next) {
        const { id } = req.params;
        try {
            const articles = await Article.destroy({ where: { id } });
            if(!articles) throw { name: 'ErrNotFound' };
            res.status(200).json({ message: 'This articles has been successfully deleted' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = articlesController;