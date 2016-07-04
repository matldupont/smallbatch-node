'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Order Schema
 */
var OrdersSchema = new Schema({
  orderNumber: {
    type: String,
    default: '',
    trim: true
  },
  meals: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Meal'
      },
      name: String,
      items: [
        {
          id: {
            type: Schema.Types.ObjectId,
            ref: 'MenuItem'
          },
          name: String
        }
      ],
      price: Number,
      quantity: Number
    }
  ],
  addons: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem'
      },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  name: String,
  email: String,
  phone: Number,
  total: {
    type: Number,
    default: 0
  },
  totalTax: {
    type: Number,
    default: 0
  },
  processingFee: {
    type: Number,
    default: 0
  },
  paid: {
    type: Boolean,
    default: false
  },
  filled: {
    type: Boolean,
    default: false
  },
  stripeToken: String,
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Orders', OrdersSchema);
