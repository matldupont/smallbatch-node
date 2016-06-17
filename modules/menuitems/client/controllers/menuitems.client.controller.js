(function () {
  'use strict';

  // MenuItems controller
  angular
    .module('menuItems')
    .controller('MenuItemsController', MenuItemsController);

  MenuItemsController.$inject = ['$scope', '$state', 'Authentication', 'menuItemResolve', 'CoursesService'];

  function MenuItemsController ($scope, $state, Authentication, menuItem, CoursesService) {
    var vm = this;

    vm.authentication = Authentication;
    vm.menuItem = menuItem;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;



    if (!vm.menuItem._id) {
      vm.menuItem.enabled = true;
      if ($state.params && $state.params.course) {
        vm.courseId = $state.params.course;
        vm.menuItem.course = { id: $state.params.course };
      }
    }

    vm.courses = CoursesService.query(function(courses) {
      if ($state.params && $state.params.course) {
        angular.forEach(courses, function(course) {
          if (course._id === $state.params.course) {
            vm.courseName = course.name;
          }
        });
      }
    });


    // Remove existing MenuItem
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.menuItem.$remove($state.go('admin.menuitems.list'));
      }
    }

    // Save MenuItem
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.menuItemForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.menuItem._id) {
        vm.menuItem.$update(successCallback, errorCallback);
      } else {
        vm.menuItem.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('admin.menuitems.list');
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
