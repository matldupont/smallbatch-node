(function () {
  'use strict';

  angular
    .module('meals')
    .controller('MealsListController', MealsListController);

  MealsListController.$inject = ['$scope', 'MealsService', 'Authentication'];

  function MealsListController($scope, MealsService, Authentication) {
    $scope.test = "MEALS";
    $scope.meals = MealsService.query(function(data) {

    });
  }
})();
