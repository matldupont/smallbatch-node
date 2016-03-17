'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meal Schema
 */
var MealSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Meal name',
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
  courses: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
      },
      name: String,
      quantity: Number
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

mongoose.model('Meal', MealSchema);
