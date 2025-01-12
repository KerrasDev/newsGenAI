const Project = require('../models/Project');
const { AppError } = require('../middleware/errorHandler');

/**
 * Service layer for project-related operations
 */
class ProjectService {
  /**
   * Find projects with optional filters and pagination
   * @param {Object} filters - Query filters
   * @param {Object} options - Pagination and sorting options
   * @returns {Promise} Paginated projects
   */
  async findAll(filters = {}, options = {}) {
    const defaultOptions = {
      page: 1,
      limit: 10,
      sort: { createdAt: -1 },
      populate: ['owner', 'team']
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return await Project.paginate(filters, mergedOptions);
    } catch (error) {
      throw new AppError('Error fetching projects', 500);
    }
  }

  /**
   * Find a project by ID
   * @param {string} id - Project ID
   * @returns {Promise} Project document
   */
  async findById(id) {
    try {
      const project = await Project.findById(id)
        .populate('owner')
        .populate('team')
        .populate('tasks.assignedTo');
      
      if (!project) {
        throw new AppError('Project not found', 404);
      }
      
      return project;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new AppError('Invalid project ID', 400);
      }
      throw error;
    }
  }

  /**
   * Create a new project
   * @param {Object} projectData - Project creation data
   * @returns {Promise} Created project
   */
  async create(projectData) {
    try {
      const project = new Project(projectData);
      await project.validate();
      return await project.save();
    } catch (error) {
      throw new AppError('Error creating project', 400);
    }
  }

  /**
   * Update a project
   * @param {string} id - Project ID
   * @param {Object} updateData - Update data
   * @returns {Promise} Updated project
   */
  async update(id, updateData) {
    try {
      const project = await Project.findByIdAndUpdate(
        id, 
        updateData, 
        { 
          new: true, 
          runValidators: true 
        }
      );

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      return project;
    } catch (error) {
      throw new AppError('Error updating project', 400);
    }
  }

  /**
   * Delete a project
   * @param {string} id - Project ID
   * @returns {Promise} Deletion result
   */
  async delete(id) {
    try {
      const project = await Project.findByIdAndDelete(id);

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      return { message: 'Project deleted successfully' };
    } catch (error) {
      throw new AppError('Error deleting project', 500);
    }
  }

  /**
   * Add a task to a project
   * @param {string} projectId - Project ID
   * @param {Object} taskData - Task data
   * @returns {Promise} Updated project with new task
   */
  async addTask(projectId, taskData) {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        throw new AppError('Project not found', 404);
      }

      project.tasks.push(taskData);
      await project.save();

      return project;
    } catch (error) {
      throw new AppError('Error adding task to project', 400);
    }
  }

  /**
   * Find active projects
   * @param {Object} options - Pagination options
   * @returns {Promise} Paginated active projects
   */
  async findActiveProjects(options = {}) {
    try {
      return await Project.findActiveProjects(options);
    } catch (error) {
      throw new AppError('Error fetching active projects', 500);
    }
  }
}

module.exports = new ProjectService();
