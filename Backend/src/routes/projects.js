const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/projectController');
const { createRateLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all routes
router.use(createRateLimiter());

/**
 * GET /projects
 * Retrieve a list of projects with optional filtering and pagination
 */
router.get('/', ProjectController.getAll);

/**
 * POST /projects
 * Create a new project
 */
router.post('/', ProjectController.create);

/**
 * GET /projects/:id
 * Retrieve a specific project by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const project = await ProjectController.getById(req, res);
  } catch (error) {
    res.status(404).json({ message: 'Project not found', error: error.message });
  }
});

/**
 * PUT /projects/:id
 * Update an existing project
 */
router.put('/:id', ProjectController.update);

/**
 * DELETE /projects/:id
 * Delete a project
 */
router.delete('/:id', ProjectController.delete);

/**
 * POST /projects/:id/tasks
 * Add a task to a project
 */
router.post('/:id/tasks', async (req, res) => {
  try {
    const task = await ProjectController.addTask(req, res);
  } catch (error) {
    res.status(400).json({ message: 'Error adding task', error: error.message });
  }
});

module.exports = router;
