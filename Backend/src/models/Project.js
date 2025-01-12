const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * Project schema definition
 */
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Project title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  status: {
    type: String,
    enum: {
      values: ['planning', 'in-progress', 'completed', 'on-hold'],
      message: '{VALUE} is not a valid project status'
    },
    default: 'planning'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Project owner is required']
  },
  team: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tasks: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo'
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: Date
  }],
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  // Enable timestamps for createdAt and updatedAt
  timestamps: true,
  
  // Add text index for search functionality
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

// Add text index for searching
ProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Add pagination plugin
ProjectSchema.plugin(mongoosePaginate);

// Virtual for project duration
ProjectSchema.virtual('duration').get(function() {
  if (this.startDate && this.endDate) {
    const duration = this.endDate.getTime() - this.startDate.getTime();
    return Math.ceil(duration / (1000 * 3600 * 24)); // Convert to days
  }
  return null;
});

// Middleware to update metadata before save
ProjectSchema.pre('save', function(next) {
  this.metadata.updatedAt = Date.now();
  
  // Validate end date
  if (this.endDate && this.endDate < this.startDate) {
    throw new Error('End date cannot be before start date');
  }
  
  next();
});

// Static method to find active projects
ProjectSchema.statics.findActiveProjects = function(options = {}) {
  return this.paginate({ 
    status: { $in: ['planning', 'in-progress'] } 
  }, options);
};

// Compile and export the model
const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
