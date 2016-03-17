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
    //vm.addingCourse = false;
    vm.newCourseQuantity = 1;

    if (!vm.meal._id) {
      vm.meal.enabled = true;
    }

    vm.courses = CoursesService.query();

    function addCourse() {
      console.log(vm.newCourseObj);
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
        vm.meal.$remove($state.go('meals.list'));
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
        $state.go('meals.view', {
          mealId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
