const express = require('express');
const router = express.Router();
const NewsController = require('../controllers/newsController');
const createRateLimiter = require('../middleware/rateLimiter');

// Apply rate limiting to all routes in this file
router.use(createRateLimiter());

// GET news with optional category and pagination
router.get('/', NewsController.getNews);

// POST create a new news article
router.post('/', NewsController.createNews);

module.exports = router;
