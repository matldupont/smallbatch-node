'use strict';

/**
 * Module dependencies
 */
var mealsPolicy = require('../policies/meals.server.policy'),
  meals = require('../controllers/meals.server.controller');

module.exports = function(app) {
  // Meals Routes
  app.route('/api/meals').all(mealsPolicy.isAllowed)
    .get(meals.list)
    .post(meals.create);

  app.route('/api/meals/:mealId').all(mealsPolicy.isAllowed)
    .get(meals.read)
    .put(meals.update)
    .delete(meals.delete);

  // Finish by binding the Meal middleware
  app.param('mealId', meals.mealByID);
};
