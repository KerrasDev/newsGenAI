const News = require('../models/News');

class NewsService {
  async getNews(category, page = 1, limit = 10) {
    const query = category ? { category } : {};
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { publishedAt: -1 }
    };

    try {
      const news = await News.paginate(query, options);
      return news;
    } catch (error) {
      throw new Error('Error fetching news: ' + error.message);
    }
  }

  async createNews(newsData) {
    try {
      const news = new News(newsData);
      await news.save();
      return news;
    } catch (error) {
      throw new Error('Error creating news: ' + error.message);
    }
  }
}

module.exports = new NewsService();
