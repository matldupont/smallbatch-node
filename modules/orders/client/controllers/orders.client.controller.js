(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'OrdersService'];

  function OrdersController ($rootScope, $scope, $state, $cookies, OrdersService) {
    console.log("ORDERS!");
    //$scope.order = orders;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;



    var currentOrderId = $cookies.get('currentOrderId');
    if (currentOrderId) {
      $scope.order = OrdersService.get({
        orderId: currentOrderId
      });
      console.log($scope.order);
    } else {
      $scope.order = new OrdersService();
      $scope.order.total = 0;
    }

    // Remove existing Order
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        $scope.order.$remove($state.go('orders.list'));
      }
    }

    $scope.addToCart = function(item) {
      if (!item) { return; }

      if (item.courses) {
        //$scope.order.meals
      } else {
        if (!$scope.order.addons) { $scope.order.addons = []; }

        var addonIndex = -1;

        var addonMatch = $scope.order.addons.filter(function(addon, index) {
          if (addon.id === item._id) {
            addonIndex = index;
            return true;
          }
          return false;
        });

        if (addonMatch.length > 0) {
          $scope.order.addons[addonIndex].quantity = $scope.order.addons[addonIndex].quantity + item.quantity;
        } else {
          var newAddon = {
            id: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          };
          $scope.order.addons.push(newAddon);
        }

        $scope.order.total = $scope.order.total + (item.price * item.quantity);

      }

      $scope.order.orderNumber = "TestNumber";

      if ($scope.order._id) {
        $scope.order.$update(function(response) {
          $scope.newItem = null;
        },function(error) {
          console.error(error);
        });
      } else {
        $scope.order.$save(function (order) { console.log(order)
          $scope.newItem = null;
          $cookies.put('currentOrderId', order._id)
        });
      }
    };

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

    function loadItem(item) {
      if (item.courses) {
        // load meal
        item.menuItems = [];
        angular.forEach(item.courses, function(course) {
          console.log(course);
          for (var i = 0; i < course.quantity; i++) {
            item.menuItems.push({
              name: course.name,
              id: course.id
            })
          }
        });
      }
      return item;
    }

    var popupListener = $rootScope.$on('cart-popup', function(event, item) {
      item.quantity = 1;
      $scope.newItem = loadItem(item);
    });

    $scope.$on('destroy', popupListener);
  }
})();
