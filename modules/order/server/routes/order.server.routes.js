'use strict';

/**
 * Module dependencies
 */
var orderPolicy = require('../policies/order.server.policy.js'),
    order = require('../controllers/order.server.controller.js');

module.exports = function(app) {
  // Order Routes
  app.route('/api/order').all(orderPolicy.isAllowed)
    .get(order.list)
    .post(order.create);

  app.route('/api/order/:orderId').all(orderPolicy.isAllowed)
    .get(order.read)
    .put(order.update)
    .delete(order.delete);

  app.route('/api/order/process/:orderId').post(order.processOrder);

  // Finish by binding the Order middleware
  app.param('orderId', order.orderByID);
};
