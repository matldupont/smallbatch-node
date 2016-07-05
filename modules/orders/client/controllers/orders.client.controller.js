(function () {
  'use strict';

  // Orders controller
  angular
    .module('orders')
    .controller('OrdersController', OrdersController)
      .config(function(StripeCheckoutProvider) {
        StripeCheckoutProvider.defaults({
          key: "pk_live_AKendb5wZhAguw2bTkeXBmrV"
        });
        //window.Stripe.setPublishableKey('pk_test_InlAsQrc8SCJqufg8KA4MV2z');
      }).run(function($log, StripeCheckout) {
        // You can set defaults here, too.
        StripeCheckout.defaults({
          opened: function() {
            // $log.debug("Stripe Checkout opened");
          },
          closed: function() {
            // $log.debug("Stripe Checkout closed");
          }
        });
      });

  OrdersController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'OrdersService', 'CoursesService','StripeCheckout'];

  function OrdersController ($rootScope, $scope, $state, $cookies, OrdersService, CoursesService, StripeCheckout) {
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;

      $scope.processingFee = 1.13;
    //$scope.save = save;
    //$scope.stripeCallback = stripeCallback;

    $scope.courses = CoursesService.query(function(data) {  });


    function refreshOrder() {
        if ($state.params && $state.params.orderId) {
            $scope.order = OrdersService.get({
                orderId: $state.params.orderId
            }, function(order) {
                console.log(order);
            });
            return;
        }
        var currentOrderId = $cookies.get('currentOrderId');
        if (currentOrderId) {
            $scope.order = OrdersService.get({
                orderId: currentOrderId
            },function(order) {
                //$scope.order = order;
            }, function(err) {
                //console.error(err);
                $cookies.remove('currentOrderId');
                newOrder();
            });
        } else {
            newOrder();
            $scope.closeSummary();
        }
    }





      $scope.getOrderItemCount = function() {
          var count = 0;
          if (!$scope.order) { return count; }
          if ($scope.order.meals) {
              count = $scope.order.meals.length;
          }

          if ($scope.order.addons) {
              count += $scope.order.addons.length;
          }

          return count;
      };

    $scope.cartIsEmpty = function(){
      return !$scope.order || ((!$scope.order.addons || $scope.order.addons.length === 0) && (!$scope.order.meals || $scope.order.meals.length === 0));
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
          newOrder();
            $scope.closeSummary();
            $rootScope.$emit('cart-order-refresh');
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
        $scope.order.totalTax = Math.round($scope.order.total * 0.13, 2);

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

        var itemsToValidate = item.menuItems.length;

        angular.forEach(item.menuItems, function(menuItem) {
          if (menuItem.choice) {
            if (menuItem.choice.id) {
                itemsToValidate--;
            }
            meal.items.push({
              id: menuItem.choice.id,
              name: menuItem.choice.name
            });
          }
        });
        meal.quantity = item.quantity;

          if (itemsToValidate !== 0) {
              $scope.hasMealItemWarning = true;
              return;
          } else {
              $scope.hasMealItemWarning = false;
          }

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
      $scope.order.totalTax = Math.round($scope.order.total * 0.13, 2);

      saveOrder(function() {
          $rootScope.$emit('cart-order-refresh');
      });
    };

      $scope.unsetNotified = function() {
          if (!$scope.order) { return; }
          if (confirm('Didn\'t really Notify the customer?')) {
              $scope.order.notified = false;
              $scope.order.notifiedDate = null;

              saveOrder();
          }
      };

      $scope.setNotified = function() {
          if (!$scope.order) { return; }
          if (confirm('Notified the customer?')) {
              $scope.order.notified = true;
              $scope.order.notifiedDate = Date.now();

              saveOrder();
          }
      };

      $scope.unsetCompleted = function() {
          if (!$scope.order) { return; }
          if (confirm('Didn\'t really Complete this order?')) {
              $scope.order.filled = false;
              $scope.order.filledDate = null;

              saveOrder();
          }
      };

      $scope.setCompleted = function() {
          if (!$scope.order) { return; }
          if (!$scope.order.notified) {
              alert("You haven't notified the customer!  How could this be completed?!");
              return;
          }
          if (confirm('Completed this order?')) {
              $scope.order.filled = true;
              $scope.order.filledDate = Date.now();

              saveOrder();
          }
      };

      $scope.deleteOrder = function() {
          if (!$scope.order) { return; }
          if (confirm('Are you ABSOLUTELY SURE you want to delete this order???')) {
              remove();
          }
      };

    function saveOrder(callback) {
      if (!$scope.order) { return; }
      if ($scope.order._id) {
        $scope.order.$update(function(response) {
          $scope.newItem = null;
          if (callback) {
            callback();
          }

        },function(error) {
          console.error(error);
        });
      } else {
        $scope.order.$save(function (order) {
          $scope.newItem = null;
          $cookies.put('currentOrderId', order._id);
            $scope.order = OrdersService.currentOrder;
          if (callback) {
            callback();
          }
        }, function(error) {
          console.error(error);
        });
      }
    }

    function newOrder() {
      $scope.order = new OrdersService.Order();
      $scope.order.total = 0;
      $scope.order.totalTax = 0;
        $scope.order.processingFee = $scope.processingFee;


    }

    $scope.closeOrder  = function() {
        $scope.closeSummary();
      newOrder();
        $rootScope.$emit('cart-order-refresh');
    };

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

    /**** STRIPE CHECKOUT ****/

    //function stripeCallback(token) {
    //  if (result.error) {
    //    window.alert('it failed! error: ' + result.error.message);
    //  } else {
    //    console.log("????");
    //    //window.alert('success! token: ' + result.id);
    //    OrdersService.processOrder($scope.order, result.id).then(function(result) {
    //      console.log("processed!");
    //      console.log(result);
    //    });
    //  }
    //}

    var handler = StripeCheckout.configure({
      name: "SmallBatch",
      token: function(token, args) {
        OrdersService.processOrder($scope.order, token).then(function(result) {
          if (result.processed) {
            $scope.order.paid = result.charge.paid;
            $scope.order.email = result.charge.source.name;
            $scope.order.stripeToken = result.token.id;
              $scope.order.orderNumber = result.orderNumber;
            saveOrder(function() {
              $cookies.remove("currentOrderId");
            });
          }
        });
        //$log.debug("Got stripe token: " + token.id);
      }
    });

    $scope.doCheckout = function(order) {
        if (!order.name || order.name.length === 0 || !order.phone || order.phone < 1000000000 || order.phone > 9999999999) {
            $scope.hasOrderInfoWarning = true;
            return;
        } else {
            $scope.hasOrderInfoWarning = false;
        }
      var options = {
        //description: "Order #" + order._id,
        amount: (order.total + order.totalTax + order.processingFee) * 100,

      };
      // The default handler API is enhanced by having open()
      // return a promise. This promise can be used in lieu of or
      // in addition to the token callback (or you can just ignore
      // it if you like the default API).
      //
      // The rejection callback doesn't work in IE6-7.
      handler.open(options)
          .then(function(result) {
          },function() {
            //alert("Stripe Checkout closed without making a sale :(");
          });
    };

      $scope.closeSummary = function() {
        OrdersService.showSummary = false;
      };

      $scope.showSummary = function() {
        OrdersService.showSummary = true;
      };

      $scope.getShowSummary = function() {
        return OrdersService.showSummary;
      };

    /*****************************/

    var popupListener = $rootScope.$on('cart-popup', function(event, item) {
      item.quantity = 1;
      $scope.newItem = loadItem(item);
    });

    $scope.$on('destroy', popupListener);

      var summaryListener = $rootScope.$on('cart-summary-popup', function(event) {
          OrdersService.showSummary = !OrdersService.showSummary;
      });

      $scope.$on('destroy', summaryListener);

      var orderListener = $rootScope.$on('cart-order-refresh', function(event) {
          refreshOrder();
      });

      $scope.$on('destroy', orderListener);

      refreshOrder();
  }
})();
