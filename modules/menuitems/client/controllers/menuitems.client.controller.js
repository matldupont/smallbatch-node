(function () {
  'use strict';

  // MenuItems controller
  angular
    .module('menuItems')
    .controller('MenuItemsController', MenuItemsController);

  MenuItemsController.$inject = ['$scope', '$state', 'Authentication', 'menuItemResolve', 'CoursesService'];

  function MenuItemsController ($scope, $state, Authentication, menuItem, CoursesService) {
    $scope.authentication = Authentication;
    $scope.menuItem = menuItem;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;



    if (!$scope.menuItem._id) {
      $scope.menuItem.enabled = true;
      if ($state.params && $state.params.course) {
        $scope.courseId = $state.params.course;
        $scope.menuItem.course = { id: $state.params.course };
      }
    }

    $scope.courses = CoursesService.query(function(courses) {
      if ($state.params && $state.params.course) {
        angular.forEach(courses, function(course) {
          if (course._id === $state.params.course) {
            $scope.courseName = course.name;
          }
        });
      }
    });


    // Remove existing MenuItem
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        $scope.menuItem.$remove($state.go('menuitems.list'));
      }
    }

    // Save MenuItem
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.menuItemForm');
        return false;
      }
      console.log(menuItem);

      // TODO: move create/update logic to service
      if ($scope.menuItem._id) {console.log($scope.menuItem);
        $scope.menuItem.$update(successCallback, errorCallback);
      } else {
        $scope.menuItem.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('menuitems.view', {
          menuItemId: res._id
        });
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    }

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function (role) {
        return role === 'admin';
      });

      $scope.isAdmin = match.length > 0;
    }
  }
})();
