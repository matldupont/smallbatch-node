(function () {
  'use strict';

  angular
    .module('menuItems')
    .controller('MenuItemsListController', MenuItemsListController);

  MenuItemsListController.$inject = ['$rootScope', '$scope', 'MenuItemsService', 'MealsService', 'CoursesService'];

  function MenuItemsListController($rootScope, $scope, MenuItemsService, MealsService, CoursesService) {
    $scope.currentFilter = null;
    $scope.menuItems = MenuItemsService.query();
    $scope.meals = MealsService.query();
    $scope.addons = [];
    $scope.courses = CoursesService.query(function(courses) {
      var matches = courses.filter(function(course) {
        return course.addon;
      });

      angular.forEach(matches, function(course) {
        $scope.addons = $scope.addons.concat(course.menuItems);
      });
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
      if ($scope.currentFilter && $scope.currentFilter.courses) {
        var match = $scope.currentFilter.courses.filter(function(filterCourse) {
          return filterCourse.id === course._id;
        });
        return match.length > 0;
      } else if ($scope.currentFilter) {
        return $scope.currentFilter._id === course._id;
      }
      return true;
    };

    $scope.addToCart = function(item) {
      $rootScope.$emit('cart-popup', item);
    };
  }

})();
