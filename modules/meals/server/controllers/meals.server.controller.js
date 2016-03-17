'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Meal = mongoose.model('Meal'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Meal
 */
exports.create = function(req, res) {
  var meal = new Meal(req.body);
  meal.user = req.user;

  meal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meal);
    }
  });
};

/**
 * Show the current Meal
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var meal = req.meal ? req.meal.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  meal.isCurrentUserOwner = req.user && meal.user && meal.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(meal);
};

/**
 * Update a Meal
 */
exports.update = function(req, res) {
  var meal = req.meal ;

  meal = _.extend(meal , req.body);

  meal.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meal);
    }
  });
};

/**
 * Delete an Meal
 */
exports.delete = function(req, res) {
  var meal = req.meal ;

  meal.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meal);
    }
  });
};

/**
 * List of Meals
 */
exports.list = function(req, res) { 
  Meal.find().sort('-created').populate('user', 'displayName').exec(function(err, meals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(meals);
    }
  });
};

/**
 * Meal middleware
 */
exports.mealByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Meal is invalid'
    });
  }

  Meal.findById(id).populate('user', 'displayName').exec(function (err, meal) {
    if (err) {
      return next(err);
    } else if (!meal) {
      return res.status(404).send({
        message: 'No Meal with that identifier has been found'
      });
    }
    req.meal = meal;
    next();
  });
};
