const TemplateService = require('../services/templateService');

/**
 * Controller for handling template-related operations
 */
class TemplateController {
  /**
   * Get all templates
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const templates = await TemplateService.findAll(filters, { page, limit });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ 
        message: 'Error fetching templates', 
        error: error.message 
      });
    }
  }

  /**
   * Create a new template
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async create(req, res) {
    try {
      const templateData = req.body;
      const newTemplate = await TemplateService.create(templateData);
      res.status(201).json(newTemplate);
    } catch (error) {
      res.status(400).json({ 
        message: 'Error creating template', 
        error: error.message 
      });
    }
  }

  /**
   * Update an existing template
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedTemplate = await TemplateService.update(id, updateData);
      res.json(updatedTemplate);
    } catch (error) {
      res.status(404).json({ 
        message: 'Template not found or update failed', 
        error: error.message 
      });
    }
  }

  /**
   * Delete a template
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      await TemplateService.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ 
        message: 'Template not found or deletion failed', 
        error: error.message 
      });
    }
  }
}

module.exports = new TemplateController();
