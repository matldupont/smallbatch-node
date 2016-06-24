'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Course Schema
 */
var CourseSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Course name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  ordinal: {
    type: Number,
    default: 0
  },
  addon: {
    type: Boolean,
    default: false
  },
  menuItems: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem'
      },
      name: String,
      description: String,
      price: Number
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Course', CourseSchema);
