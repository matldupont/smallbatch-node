(function () {
  'use strict';

  // Courses controller
  angular
    .module('courses')
    .controller('CoursesController', CoursesController);

  CoursesController.$inject = ['$scope', '$state', 'Authentication', 'courseResolve'];

  function CoursesController ($scope, $state, Authentication, course) {
    var vm = this;

    $scope.authentication = Authentication;
    $scope.course = course;
    $scope.error = null;
    $scope.form = {};
    $scope.remove = remove;
    $scope.save = save;

    if (!$scope.course._id) {
      $scope.course.enabled = true;
    }

    // Remove existing Course
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        $scope.course.$remove($state.go('courses.list'));
      }
    }

    // Save Course
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', '$scope.form.courseForm');
        return false;
      }

      // TODO: move create/update logic to service
      if ($scope.course._id) {
        $scope.course.$update(successCallback, errorCallback);
      } else {
        $scope.course.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('courses.view', {
          courseId: res._id
        });
      }

      function errorCallback(res) {
        $scope.error = res.data.message;
      }
    }

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function(role) {
        return role === 'admin';
      });

      $scope.isAdmin = match.length > 0;
    }
  }
})();
