const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

/**
 * Template schema definition
 */
const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [100, 'Template name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: {
      values: ['document', 'presentation', 'spreadsheet', 'design'],
      message: '{VALUE} is not a supported template type'
    },
    required: [true, 'Template type is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator information is required']
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
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
TemplateSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Add pagination plugin
TemplateSchema.plugin(mongoosePaginate);

// Virtual for formatted creation date
TemplateSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Middleware to update metadata before save
TemplateSchema.pre('save', function(next) {
  this.metadata.updatedAt = Date.now();
  next();
});

// Static method to find public templates
TemplateSchema.statics.findPublicTemplates = function(options = {}) {
  return this.paginate({ isPublic: true }, options);
};

// Compile and export the model
const Template = mongoose.model('Template', TemplateSchema);

module.exports = Template;
