(function () {
  'use strict';

  angular
    .module('meals')
    .controller('MealsListController', MealsListController);

  MealsListController.$inject = ['MealsService'];

  function MealsListController(MealsService) {
    var vm = this;

    vm.meals = MealsService.query();
  }
})();
