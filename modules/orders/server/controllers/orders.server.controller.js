'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Orders = mongoose.model('Orders'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Order
 */
exports.create = function(req, res) {
  console.log("create");
  var order = new Orders(req.body);
  order.user = req.user;

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
  console.log('read');
  // convert mongoose document to JSON
  var order = req.order ? req.order.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  order.isCurrentUserOwner = req.user && order.user && order.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(order);
};

/**
 * Update a Order
 */
exports.update = function(req, res) {console.log("update?");
  var order = req.order ;

  order = _.extend(order , req.body);

  order.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * Delete an Order
 */
exports.delete = function(req, res) {
  var order = req.order ;

  order.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(order);
    }
  });
};

/**
 * List of Orders
 */
exports.list = function(req, res) {
  console.log("list");
  Orders.find().sort('-created').populate('user', 'displayName').exec(function(err, orders) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(orders);
    }
  });
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) {
  console.log("by id");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Order is invalid'
    });
  }

  Orders.findById(id).populate('user', 'displayName').exec(function (err, order) {
    if (err) {
      return next(err);
    } else if (!order) {
      return res.status(404).send({
        message: 'No Order with that identifier has been found'
      });
    }
    req.order = order;
    next();
  });
};


exports.processOrder = function(req, res) {
  Orders.findById(req.params.orderId).exec(function (err, order) {
    console.log("ASDFASDFASDFASDFASDFASDFASDFA");
    console.log(process.env.STRIPE_SK);
    var stripe = require("stripe")(process.env.STRIPE_SK);
    var stripeToken = req.body.stripeToken;
    var charge = stripe.charges.create({
      amount: Math.round((order.total + order.totalTax + order.processingFee) * 100), // amount in cents, again
      currency: "cad",
      source: stripeToken.id,
      description: "Order #" + order._id
    }, function(err, charge) {
      console.error(err);
      console.log(charge);
      if (err && err.type === 'StripeCardError') {
        res.jsonp({processed: false});
      } else {
        res.jsonp({processed: true, charge: charge, token: stripeToken});
      }
    });
  });
// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form


};
