(function () {
  'use strict';

  // Courses controller
  angular
      .module('order')
      .controller('OrderController', OrderController)
  .config(function() {
    window.Stripe.setPublishableKey('pk_test_InlAsQrc8SCJqufg8KA4MV2z');
  });
  OrderController.$inject = ['$scope', '$state', 'Authentication', 'OrderService', 'MealsService', 'MenuItemsService'];

  function OrderController ($scope, $state, Authentication, OrderService, MealsService, MenuItemsService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.order = OrderService.currentOrder;
    vm.mealOrder = {};
    vm.addToOrder = addToOrder;
    $scope.stripeCallback = stripeCallback;
    //vm.remove = remove;
    //vm.save = save;

    vm.menuItems = MenuItemsService.query();

    if ($state.params && $state.params.mealId) {
      MealsService.get({
        mealId: $state.params.mealId
      }, function(result) {
        vm.meal = result;
        loadMeal(vm.meal);
      });
    }

    function loadMeal(meal) {
      vm.mealOrder = {
        meal: meal,
        name: meal.name,
        quantity: 1,
        price: meal.price,
        description: meal.description,
        courses: []
      };

      angular.forEach(meal.courses, function(course) {
        for (var i = 0; i < course.quantity; i++) {
          vm.mealOrder.courses.push({
            course: course,
            courseName: course.name
          });
        }
      });

      //console.log(vm.mealOrder);
    }

    function addToOrder() {
      if ($state.params.mealId) {
        for (var i = 0; i < vm.mealOrder.courses.length; i++) {
          if (!vm.mealOrder.courses[i].menuItem || !vm.mealOrder.courses[i].menuItem._id) {
            return;
          }

          vm.mealOrder.courses[i].menuItem = vm.mealOrder.courses[i].menuItem;
          vm.mealOrder.courses[i].menuItemName = vm.mealOrder.courses[i].menuItem.name;
        }
        console.log('valid');
        console.log(vm.mealOrder);
        OrderService.addMealToOrder(vm.mealOrder);

        $state.go('order.view');
      }
    }

    function stripeCallback(code, result) {
      if (result.error) {
        window.alert('it failed! error: ' + result.error.message);
      } else {
        //window.alert('success! token: ' + result.id);
        OrderService.processOrder(result.id);
      }
    }

    //// Remove existing Course
    //function remove() {
    //  if (confirm('Are you sure you want to delete?')) {
    //    vm.course.$remove($state.go('courses.list'));
    //  }
    //}
    //
    //// Save Course
    //function save(isValid) {
    //  if (!isValid) {
    //    $scope.$broadcast('show-errors-check-validity', 'vm.form.courseForm');
    //    return false;
    //  }
    //
    //  // TODO: move create/update logic to service
    //  if (vm.course._id) {
    //    vm.course.$update(successCallback, errorCallback);
    //  } else {
    //    vm.course.$save(successCallback, errorCallback);
    //  }
    //
    //  function successCallback(res) {
    //    $state.go('courses.view', {
    //      courseId: res._id
    //    });
    //  }
    //
    //  function errorCallback(res) {
    //    vm.error = res.data.message;
    //  }
    //}

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function(role) {
        return role === 'admin';
      });

      vm.isAdmin = match.length > 0;
    }
  }
})();
