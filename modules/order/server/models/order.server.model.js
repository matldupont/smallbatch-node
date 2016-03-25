'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrderSchema = new Schema({
  //orderNumber: {
  //  type: String,
  //  default: '',
  //  required: 'Please fill Order name',
  //  trim: true
  //},
  total: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  meals: [
    {
      meal: {
        type: Schema.Types.ObjectId,
        ref: 'Meal'
      },
      name: String,
      price: Number,
      quantity: Number,
      courses: [
        {
          course: {
            type: Schema.Types.ObjectId,
            ref: 'Course'
          },
          courseName: String,
          menuItem: {
            type: Schema.Types.ObjectId,
            ref: 'MenuItem'
          },
          menuItemName: String
        }
      ]
    }
  ],
  menuItems: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem'
      },
      name: String,
      description: String
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

mongoose.model('Order', OrderSchema);
