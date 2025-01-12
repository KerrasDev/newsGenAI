const Joi = require('joi');

/**
 * Validation utility class for input validation
 */
class Validator {
  /**
   * Validate news data
   * @param {Object} data - News data to validate
   * @returns {Object} Validated data or throws validation error
   */
  static validateNews(data) {
    const schema = Joi.object({
      title: Joi.string()
        .required()
        .min(5)
        .max(200)
        .trim(),
      description: Joi.string()
        .required()
        .min(10)
        .max(500)
        .trim(),
      content: Joi.string()
        .required()
        .min(20)
        .trim(),
      author: Joi.string()
        .required()
        .trim(),
      category: Joi.string()
        .valid('technology', 'politics', 'sports', 'entertainment', 'business', 'health')
        .required(),
      imageUrl: Joi.string()
        .uri()
        .optional()
    });

    return this._validate(data, schema);
  }

  /**
   * Validate template data
   * @param {Object} data - Template data to validate
   * @returns {Object} Validated data or throws validation error
   */
  static validateTemplate(data) {
    const schema = Joi.object({
      name: Joi.string()
        .required()
        .min(3)
        .max(100)
        .trim(),
      description: Joi.string()
        .optional()
        .max(500)
        .trim(),
      type: Joi.string()
        .valid('document', 'presentation', 'spreadsheet', 'design')
        .required(),
      tags: Joi.array()
        .items(Joi.string().trim())
        .optional(),
      isPublic: Joi.boolean().optional(),
      createdBy: Joi.string().required()
    });

    return this._validate(data, schema);
  }

  /**
   * Validate project data
   * @param {Object} data - Project data to validate
   * @returns {Object} Validated data or throws validation error
   */
  static validateProject(data) {
    const schema = Joi.object({
      title: Joi.string()
        .required()
        .min(3)
        .max(100)
        .trim(),
      description: Joi.string()
        .optional()
        .max(500)
        .trim(),
      status: Joi.string()
        .valid('planning', 'in-progress', 'completed', 'on-hold')
        .optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date()
        .min(Joi.ref('startDate'))
        .optional(),
      owner: Joi.string().required(),
      team: Joi.array()
        .items(Joi.string())
        .optional(),
      tasks: Joi.array()
        .items(Joi.object({
          title: Joi.string().required(),
          description: Joi.string().optional(),
          status: Joi.string()
            .valid('todo', 'in-progress', 'done')
            .optional(),
          assignedTo: Joi.string().optional(),
          dueDate: Joi.date().optional()
        }))
        .optional(),
      tags: Joi.array()
        .items(Joi.string().trim())
        .optional()
    });

    return this._validate(data, schema);
  }

  /**
   * Generic validation method
   * @param {Object} data - Data to validate
   * @param {Joi.Schema} schema - Joi validation schema
   * @returns {Object} Validated data or throws validation error
   */
  static _validate(data, schema) {
    const { error, value } = schema.validate(data, {
      abortEarly: false, // Return all validation errors
      stripUnknown: true // Remove unknown keys
    });

    if (error) {
      const errorDetails = error.details.map(err => ({
        message: err.message,
        path: err.path
      }));

      throw new Error(JSON.stringify(errorDetails));
    }

    return value;
  }

  /**
   * Validate email
   * @param {string} email - Email to validate
   * @returns {boolean} Whether email is valid
   */
  static isValidEmail(email) {
    const emailSchema = Joi.string().email().required();
    const { error } = emailSchema.validate(email);
    return !error;
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {boolean} Whether password meets strength requirements
   */
  static isStrongPassword(password) {
    const passwordSchema = Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'));
    
    const { error } = passwordSchema.validate(password);
    return !error;
  }
}

module.exports = Validator;
