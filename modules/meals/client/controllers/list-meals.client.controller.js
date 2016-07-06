(function () {
  'use strict';

  angular
    .module('meals')
    .controller('MealsListController', MealsListController);

  MealsListController.$inject = ['$scope', 'MealsService', 'CoursesService'];

  function MealsListController($scope, MealsService, CoursesService) {
    $scope.meals = MealsService.query(function(meals) {
      $scope.courses = CoursesService.query(function(courses) {
        angular.forEach(courses, function(course) {
          $scope.courseOrdinals[course._id] = course.ordinal;
        });
      });

      $scope.meals = meals.filter(function(meal) {
        return meal.enabled === true;
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
