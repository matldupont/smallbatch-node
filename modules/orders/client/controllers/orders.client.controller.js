(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$rootScope', '$scope', '$state', 'MealsService', 'CoursesService'];

  function OrdersController ($rootScope, $scope, $state, MealsService, CoursesService) {
    console.log("ORDERS!");
    //$scope.order = orders;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;


    // Remove existing Order
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        $scope.order.$remove($state.go('orders.list'));
      }
    }

    // Save Order
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.orderForm');
        return false;
      }

      // TODO: move create/update logic to service
      if ($scope.order._id) {
        $scope.order.$update(successCallback, errorCallback);
      } else {
        $scope.order.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('orders.view', {
          orderId: res._id
        });
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    }

    $scope.getItemPopupClass = function() {
      if (!$scope.newItem) { return; }

      if ($scope.newItem.courses) {
        return 'box-item';
      } else {
        return 'addon-item';
      }
    };

    var popupListener = $rootScope.$on('cart-popup', function(event, item) {
      console.log(item);
      $scope.newItem = item;
    });

    $scope.$on('destroy', popupListener);
  }
})();
