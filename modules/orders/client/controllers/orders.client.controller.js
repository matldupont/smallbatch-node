(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController);

  OrdersController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'OrdersService', 'CoursesService'];

  function OrdersController ($rootScope, $scope, $state, $cookies, OrdersService, CoursesService) {
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    //$scope.save = save;

    $scope.courses = CoursesService.query(function(data) {  });

    var currentOrderId = $cookies.get('currentOrderId');
    if (currentOrderId) {
      $scope.order = OrdersService.get({
        orderId: currentOrderId
      },function(order) {
        console.log(order);
      });
    } else {
      $scope.order = new OrdersService();
      $scope.order.total = 0;
    }

    $scope.cartIsEmpty = function(){
      return (!$scope.order.addons || $scope.order.addons.length == 0) && (!$scope.order.meals || $scope.order.meals.length == 0)
    };

    $scope.getCourseItems = function(id) {
      var match = $scope.courses.filter(function(course) {
        return course._id === id;
      });

      return match.length > 0 ? match[0].menuItems : [];
    };


    // Remove existing Order
    function remove() {
      if (confirm('Are you sure you want to clear this order?')) {
        $scope.order.$remove(function() {
          $scope.order = new OrdersService();
          $scope.order.total = 0;
        });
      }
    }

    $scope.removeFromCart = function(item) {
      if (confirm('Are you sure you want to remove this item from your order?')) {
        if (item.items) {
          $scope.order.meals = $scope.order.meals.filter(function(meal) {
            return meal._id !== item._id;
          });
        } else {
          $scope.order.addons = $scope.order.addons.filter(function (addon) {
            return addon._id !== item._id;
          });
        }
        $scope.order.total = $scope.order.total - (item.quantity * item.price);

        saveOrder();
      }
    };

    $scope.addToCart = function(item) {
      if (!item) { return; }

      if (item.courses) {
        if (!$scope.order.meals) { $scope.order.meals = []; }
        var meal = {
          id: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          items: []
        };

        angular.forEach(item.menuItems, function(menuItem) {
          if (menuItem.choice) {
            meal.items.push({
              id: menuItem.choice.id,
              name: menuItem.choice.name
            });
          }
        });
        meal.quantity = item.quantity;

        $scope.order.meals.push(meal);
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
      }

      $scope.order.total = $scope.order.total + (item.price * item.quantity);

      saveOrder();
    };

    function saveOrder() {
      if (!$scope.order) { return; }
      if ($scope.order._id) {
        $scope.order.$update(function(response) {
          $scope.newItem = null;
        },function(error) {
          console.error(error);
        });
      } else {
        $scope.order.$save(function (order) {
          $scope.newItem = null;
          $cookies.put('currentOrderId', order._id);
        }, function(error) {
          console.error(error);
        });
      }
    }

    // Save Order
    //function save(isValid) {
    //  if (!isValid) {
    //    $scope.$broadcast('show-errors-check-validity', 'vm.form.orderForm');
    //    return false;
    //  }
    //
    //  // TODO: move create/update logic to service
    //  if ($scope.order._id) {
    //    $scope.order.$update(successCallback, errorCallback);
    //  } else {
    //    $scope.order.$save(successCallback, errorCallback);
    //  }
    //
    //  function successCallback(res) {
    //    $state.go('orders.view', {
    //      orderId: res._id
    //    });
    //  }
    //
    //  function errorCallback(res) {
    //    $scope.error = res.data.message;
    //  }
    //}

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
          for (var i = 0; i < course.quantity; i++) {
            item.menuItems.push({
              name: course.name,
              id: course.id,
              ordinal: course.ordinal
            });
          }
        });
        item.quantity = 2;
      } else {
        item.quantity = 1;
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
