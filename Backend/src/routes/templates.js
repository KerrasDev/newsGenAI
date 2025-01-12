const express = require('express');
const router = express.Router();
const TemplateController = require('../controllers/templateController');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all routes
router.use(createRateLimiter());

/**
 * GET /templates
 * Retrieve a list of templates with optional filtering and pagination
 */
router.get('/', TemplateController.getAll);

/**
 * POST /templates
 * Create a new template
 */
router.post('/', TemplateController.create);

/**
 * GET /templates/:id
 * Retrieve a specific template by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const template = await TemplateController.getById(req, res);
  } catch (error) {
    res.status(404).json({ message: 'Template not found', error: error.message });
  }
});

/**
 * PUT /templates/:id
 * Update an existing template
 */
router.put('/:id', TemplateController.update);

/**
 * DELETE /templates/:id
 * Delete a template
 */
router.delete('/:id', TemplateController.delete);

module.exports = router;
