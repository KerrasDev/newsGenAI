const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['technology', 'politics', 'sports', 'entertainment', 'business', 'health'],
    required: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Create text index for search functionality
NewsSchema.index({ title: 'text', description: 'text', content: 'text' });

module.exports = mongoose.model('News', NewsSchema);
