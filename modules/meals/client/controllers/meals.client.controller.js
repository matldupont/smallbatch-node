(function () {
  'use strict';

  // Meals controller
  angular
    .module('meals')
    .controller('MealsController', MealsController);

  MealsController.$inject = ['$scope', '$state', 'Authentication', 'mealResolve', 'CoursesService'];

  function MealsController ($scope, $state, Authentication, meal, CoursesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.meal = meal;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.addCourse = addCourse;
    vm.removeCourse = removeCourse;
    vm.newCourseQuantity = 1;

    if (!vm.meal._id) {
      vm.meal.enabled = true;
    }

    vm.courses = CoursesService.query();

    function addCourse() {
      if (!vm.newCourseObj) { return; }
      if (!vm.newCourseQuantity || vm.newCourseQuantity < 1) { return; }

      if (!vm.meal.courses) { vm.meal.courses = []; }

      vm.meal.courses.push({ id: vm.newCourseObj._id, name: vm.newCourseObj.name, quantity: vm.newCourseQuantity });

      vm.newCourseObj = null;
      vm.newCourseQuantity = 1;
    }

    function removeCourse(index) {
      vm.meal.courses.splice(index, 1);
    }

    // Remove existing Meal
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.meal.$remove($state.go('admin.meals.list'));
      }
    }

    // Save Meal
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mealForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.meal._id) {
        vm.meal.$update(successCallback, errorCallback);
      } else {
        vm.meal.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.meals.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function(role) {
        return role === 'admin';
      });

      vm.isAdmin = match.length > 0;
    }
  }
})();
