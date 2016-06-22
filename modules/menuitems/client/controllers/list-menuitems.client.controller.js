(function () {
  'use strict';

  angular
    .module('menuItems')
    .controller('MenuItemsListController', MenuItemsListController)
      //.filter('menuFilter', menuFilter);

  MenuItemsListController.$inject = ['$scope', 'MenuItemsService', 'MealsService', 'CoursesService'];

  function MenuItemsListController($scope, MenuItemsService, MealsService, CoursesService) {
    $scope.currentFilter = null;
    $scope.menuItems = MenuItemsService.query();
    $scope.meals = MealsService.query();
    $scope.courses = CoursesService.query(function(data) {
      console.log(data)
    });

    $scope.getFilters = function() {
      var addons = $scope.courses.filter(function(course) {
          return course.addon;
      });

      return $scope.meals.concat(addons);
    };

    $scope.applyFilter = function(filter) {
      $scope.currentFilter = filter;
    };

    $scope.menuFilter = function(course) {
      console.log(course)
      if ($scope.currentFilter && $scope.currentFilter.courses) {
        var match = $scope.currentFilter.courses.filter(function(filterCourse) {
          return filterCourse.id == course._id;
        });
        return match.length > 0;
      } else if ($scope.currentFilter) {
        return $scope.currentFilter._id == course._id;
      }
      return true;
    }
  }

})();
