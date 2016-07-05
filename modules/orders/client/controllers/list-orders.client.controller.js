(function () {
  'use strict';

  angular
    .module('orders')
    .controller('OrdersListController', OrdersListController);

  OrdersListController.$inject = ['$scope', 'OrdersService'];

  function OrdersListController($scope, OrdersService) {
    $scope.showCompleted = false;
    $scope.toggleCompletedOrders = function() {
        $scope.showCompleted = !$scope.showCompleted;
    };
    $scope.orders = OrdersService.query(function(orders) {
    });

    $scope.getOrders = function() {
        if ($scope.showCompleted) {
          return $scope.orders;
        } else {
          return $scope.orders.filter(function(order) {
            return !order.filled;
          });

        }
    };
  }
})();
