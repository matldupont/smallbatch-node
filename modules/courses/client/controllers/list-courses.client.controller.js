(function () {
  'use strict';

  angular
    .module('courses')
    .controller('CoursesListController', CoursesListController);

  CoursesListController.$inject = ['$scope', 'CoursesService', 'Authentication'];

  function CoursesListController($scope, CoursesService, Authentication) {
    $scope.authentication = Authentication;

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function(role) {
        return role === 'admin';
      });

      $scope.isAdmin = match.length > 0;
    }

    $scope.courses = CoursesService.query();
  }
})();
