'use strict';

/**
 * Module dependencies
 */
var menuItemsPolicy = require('../policies/menuitems.server.policy'),
  menuItems = require('../controllers/menuitems.server.controller');

module.exports = function(app) {
  // MenuItems Routes
  app.route('/api/menuitems').all(menuItemsPolicy.isAllowed)
    .get(menuItems.list)
    .post(menuItems.create);

  app.route('/api/menuitems/:menuItemId').all(menuItemsPolicy.isAllowed)
    .get(menuItems.read)
    .put(menuItems.update)
    .delete(menuItems.delete);

  // Finish by binding the MenuItem middleware
  app.param('menuItemId', menuItems.menuItemByID);
};
