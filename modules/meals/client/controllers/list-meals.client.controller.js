(function () {
  'use strict';

  angular
    .module('meals')
    .controller('MealsListController', MealsListController);

  MealsListController.$inject = ['$scope', 'MealsService', 'CoursesService'];

  function MealsListController($scope, MealsService, CoursesService) {
    $scope.meals = MealsService.query(function(data) {
      console.log(data);
      $scope.courses = CoursesService.query(function(data) {
        angular.forEach(data, function(course) {
          $scope.courseOrdinals[course._id] = course.ordinal;
        });
      });
    });

    $scope.courseOrdinals = {};
    $scope.courses = CoursesService.query(function(data) {
      angular.forEach(data, function(course) {
        $scope.courseOrdinals[course._id] = course.ordinal;
      });
    });
  }
})();
