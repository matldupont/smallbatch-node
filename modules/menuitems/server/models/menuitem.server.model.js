'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * MenuItem Schema
 */
var MenuItemSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill MenuItem name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  course: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    name: String
  },
  price: {
    type: Number,
    default: 0
  },
  enabled: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('MenuItem', MenuItemSchema);
