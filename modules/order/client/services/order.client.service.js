(function () {
  'use strict';

  angular
      .module('order')
      .service('OrderService', OrderService);

  OrderService.$inject = ['$cookies', '$resource', '$http'];

  function OrderService($cookies, $resource, $http) {
    var Orders = $resource('/api/order/:orderId', { orderId:'@id' }, {
      'update': { method:'PUT' }
    });
    var currentOrder = null;
    function initOrder() {
      if ($cookies.get('currentOrder')) {
        currentOrder = Orders.get({ orderId: $cookies.get('currentOrder') }, function(order) {
        },function(error) {
          currentOrder = { meals: [], menuItems: [] };
        });
      } else {
        currentOrder = { meals: [], menuItems: [] };
      }
      return currentOrder;
    }

    function clearOrder() {
      currentOrder = null;
      $cookies.remove('currentOrder');
    }

    function addMealToOrder(meal) {
      if (!currentOrder) {
        initOrder();
      }
      currentOrder.meals.push(meal);

      currentOrder.total = getOrderTotal();

      var order = null;
      if (currentOrder._id) {
        Orders.get({ orderId: currentOrder._id }, function(order) {
          currentOrder = Orders.update({ orderId: currentOrder._id }, currentOrder, function(order) {
            //console.log("UPDATED")
            //console.log(order)
          });
        }, function(error) {
          $cookies.remove('currentOrder');
          order = new Orders(currentOrder);
          order.$save(function (result, error) {
            currentOrder = result;
            $cookies.put('currentOrder', currentOrder._id);
          });
        });
      } else {
        order = new Orders(currentOrder);
        order.$save(function (result, error) {
          currentOrder = result;
          $cookies.put('currentOrder', currentOrder._id);
        });
      }
    }

    function addMenuItemToOrder(menuItem) {
      if (!currentOrder) {
        initOrder();
      }
    }

    function getOrderTotal(){
      var total = 0;
      if (!currentOrder) { return total;}

      if (currentOrder.meals && currentOrder.meals.length > 0) {
        angular.forEach(currentOrder.meals, function(meal) {
          if (meal.quantity && meal.price) {
            total += meal.quantity * meal.price;
          }
        });
      }

      if (currentOrder.menuItems && currentOrder.menuItems.length > 0) {
        angular.forEach(currentOrder.menuItems, function(menuItem) {
          if (menuItem.quantity && menuItem.price) {
            total += menuItem.quantity * menuItem.price;
          }
        });
      }

      return total;
    }

    function processOrder(stripeToken) {
      console.log(currentOrder)
      $http.post('/api/order/process/' + currentOrder._id, { stripeToken : stripeToken }).then(function(result) {
        console.log("processed!!");
        console.log(result);
      });
    }

    if (!currentOrder) {
      initOrder();
    }

    return {
      currentOrder: currentOrder,
      initOrder: initOrder,
      clearOrder: clearOrder,
      addMealToOrder: addMealToOrder,
      addMenuItemToOrder: addMenuItemToOrder,
      processOrder: processOrder
    };
  }
})();
