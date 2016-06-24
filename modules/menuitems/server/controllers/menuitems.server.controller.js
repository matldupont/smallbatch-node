'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  MenuItem = mongoose.model('MenuItem'),
  Course = mongoose.model('Course'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a MenuItem
 */
exports.create = function(req, res) {
  var menuItem = new MenuItem(req.body);
  menuItem.user = req.user;
  Course.findById(req.body.course.id).exec(function(err, course) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      menuItem.course = { id: course._id, name: course.name };
      menuItem.save(function(err2) {
        if (err2) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          course.menuItems.push({ id: menuItem._id, name: menuItem.name, description: menuItem.description, price: menuItem.price });
          course.save();
          res.jsonp(menuItem);
        }
      });
    }
  });
};

/**
 * Show the current MenuItem
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var menuItem = req.menuItem ? req.menuItem.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  menuItem.isCurrentUserOwner = req.user && menuItem.user && menuItem.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(menuItem);
};

/**
 * Update a MenuItem
 */
exports.update = function(req, res) {
  var menuItem = req.menuItem ;

  menuItem = _.extend(menuItem , req.body);

  // Remove menuitem reference in courses
  Course.update(
      { 'menuItems.id': menuItem._id },
      { $pull: { 'menuItems':  { 'id': menuItem._id } } },
      { multi: true },
      function(err2, courses) {
        if (err2) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err2)
          });
        } else {
          Course.findById(req.body.course.id).exec(function(err, course) {
            if (err) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              menuItem.course = { id: course._id, name: course.name };
              menuItem.save(function(err2) {
                if (err2) {
                  return res.status(400).send({
                    message: errorHandler.getErrorMessage(err2)
                  });
                } else {
                  course.menuItems.push({ id: menuItem._id, name: menuItem.name, description: menuItem.description, price: menuItem.price });
                  course.save();
                  res.jsonp(menuItem);
                }
              });
            }
          });
        }
      }
  );
};

/**
 * Delete an MenuItem
 */
exports.delete = function(req, res) {
  var menuItem = req.menuItem ;

  menuItem.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      Course.update(
          { 'menuItems.id': menuItem._id },
          { $pull: { 'menuItems':  { 'id': menuItem._id } } },
          { multi: true },
          function(err2, courses) {
            if (err2) {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err2)
              });
            } else {
              res.jsonp(menuItem);
            }
          }
      );

    }
  });
};

/**
 * List of MenuItems
 */
exports.list = function(req, res) { 
  MenuItem.find().sort('-created').populate('user', 'displayName').exec(function(err, menuItems) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(menuItems);
    }
  });
};

/**
 * MenuItem middleware
 */
exports.menuItemByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'MenuItem is invalid'
    });
  }

  MenuItem.findById(id).populate('user', 'displayName').exec(function (err, menuItem) {
    if (err) {
      return next(err);
    } else if (!menuItem) {
      return res.status(404).send({
        message: 'No MenuItem with that identifier has been found'
      });
    }
    req.menuItem = menuItem;
    next();
  });
};
