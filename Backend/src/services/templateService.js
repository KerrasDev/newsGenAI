const Template = require('../models/Template');
const { AppError } = require('../middleware/errorHandler');

/**
 * Service layer for template-related operations
 */
class TemplateService {
  /**
   * Find templates with optional filters and pagination
   * @param {Object} filters - Query filters
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise} Paginated templates
   */
  async findAll(filters = {}, options = {}) {
    const defaultOptions = {
      page: 1,
      limit: 10,
      sort: { createdAt: -1 }
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return await Template.paginate(filters, mergedOptions);
    } catch (error) {
      throw new AppError('Error fetching templates', 500);
    }
  }

  /**
   * Find a template by ID
   * @param {string} id - Template ID
   * @returns {Promise} Template document
   */
  async findById(id) {
    try {
      const template = await Template.findById(id);
      
      if (!template) {
        throw new AppError('Template not found', 404);
      }
      
      return template;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid template ID', 400);
      }
      throw error;
    }
  }

  /**
   * Create a new template
   * @param {Object} templateData - Template creation data
   * @returns {Promise} Created template
   */
  async create(templateData) {
    try {
      const template = new Template(templateData);
      await template.validate();
      return await template.save();
    } catch (error) {
      throw new AppError('Error creating template', 400);
    }
  }

  /**
   * Update a template
   * @param {string} id - Template ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated template
   */
  async update(id, updateData) {
    try {
      const template = await Template.findByIdAndUpdate(
        id, 
        updateData, 
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!template) {
        throw new AppError('Template not found', 404);
      }

      return template;
    } catch (error) {
      throw new AppError('Error updating template', 400);
    }
  }

  /**
   * Delete a template
   * @param {string} id - Template ID
   * @returns {Promise} Deletion result
   */
  async delete(id) {
    try {
      const template = await Template.findByIdAndDelete(id);

      if (!template) {
        throw new AppError('Template not found', 404);
      }

      return { message: 'Template deleted successfully' };
    } catch (error) {
      throw new AppError('Error deleting template', 500);
    }
  }

  /**
   * Find public templates
   * @param {Object} options - Pagination options
   * @returns {Promise} Paginated public templates
   */
  async findPublicTemplates(options = {}) {
    try {
      return await Template.findPublicTemplates(options);
    } catch (error) {
      throw new AppError('Error fetching public templates', 500);
    }
  }
}

module.exports = new TemplateService();
