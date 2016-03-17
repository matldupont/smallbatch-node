//Meals service used to communicate Meals REST endpoints
(function () {
  'use strict';

  angular
    .module('meals')
    .factory('MealsService', MealsService);

  MealsService.$inject = ['$resource'];

  function MealsService($resource) {
    return $resource('api/meals/:mealId', {
      mealId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
