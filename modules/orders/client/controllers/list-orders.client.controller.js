(function () {
  'use strict';

  angular
    .module('orders')
    .controller('OrdersListController', OrdersListController);

  OrdersListController.$inject = ['$scope', 'OrdersService'];

  function OrdersListController($scope, OrdersService) {
    $scope.orders = OrdersService.query();
  }
})();
