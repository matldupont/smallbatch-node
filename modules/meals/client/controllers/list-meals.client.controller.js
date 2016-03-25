(function () {
  'use strict';

  angular
    .module('meals')
    .controller('MealsListController', MealsListController);

  MealsListController.$inject = ['MealsService', 'Authentication'];

  function MealsListController(MealsService, Authentication) {
    var vm = this;

    vm.meals = MealsService.query();

    if (Authentication.user) {
      var match = Authentication.user.roles.filter(function(role) {
        return role === 'admin';
      });

      vm.isAdmin = match.length > 0;
    }
  }
})();
