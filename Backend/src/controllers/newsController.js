const NewsService = require('../services/newsService');

class NewsController {
  async getNews(req, res) {
    try {
      const { category, page, limit } = req.query;
      const news = await NewsService.getNews(category, page, limit);
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async createNews(req, res) {
    try {
      const newsData = req.body;
      const newNews = await NewsService.createNews(newsData);
      res.status(201).json(newNews);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new NewsController();
