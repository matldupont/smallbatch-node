//Orders service used to communicate Orders REST endpoints
(function () {
  'use strict';

  angular
    .module('orders')
    .factory('OrdersService', OrdersService);

  OrdersService.$inject = ['$resource', '$http'];

  function OrdersService($resource, $http) {
    var Orders = $resource('/api/orders/:orderId', { orderId:'@_id' }, {
      'update': { method:'PUT' }
    });

    return {
      get: Orders.get,
      Order: Orders,
      processOrder: function(order, stripeToken) {
        return $http.post('/api/orders/process/' + order._id, { stripeToken : stripeToken }).then(function(result) {
          return result.data;
        });
      }
    };

  }
})();
