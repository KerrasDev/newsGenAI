const ProjectService = require('../services/projectService');

/**
 * Controller for handling project-related operations
 */
class ProjectController {
  /**
   * Get all projects
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const projects = await ProjectService.findAll(filters, { page, limit });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching projects', 
        error: error.message 
      });
    }
  }

  /**
   * Create a new project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async create(req, res) {
    try {
      const projectData = req.body;
      const newProject = await ProjectService.create(projectData);
      res.status(201).json(newProject);
    } catch (error) {
      res.status(400).json({ 
        message: 'Error creating project', 
        error: error.message 
      });
    }
  }

  /**
   * Update an existing project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedProject = await ProjectService.update(id, updateData);
      res.json(updatedProject);
    } catch (error) {
      res.status(404).json({ 
        message: 'Project not found or update failed', 
        error: error.message 
      });
    }
  }

  /**
   * Delete a project
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await ProjectService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ 
        message: 'Project not found or deletion failed', 
        error: error.message 
      });
    }
  }
}

module.exports = new ProjectController();
