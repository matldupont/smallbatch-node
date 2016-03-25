(function () {
  'use strict';

  angular
    .module('meals')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('meals', {
        abstract: true,
        url: '/meals',
        template: '<ui-view/>'
      })
      .state('meals.list', {
        url: '',
        templateUrl: 'modules/meals/client/views/list-meals.client.view.html',
        controller: 'MealsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Meals List'
        }
      })
      .state('meals.create', {
        url: '/create',
        templateUrl: 'modules/meals/client/views/form-meal.client.view.html',
        controller: 'MealsController',
        controllerAs: 'vm',
        resolve: {
          mealResolve: newMeal
        },
        data: {
          roles: ['admin'],
          pageTitle : 'Meals Create'
        }
      })
      .state('meals.edit', {
        url: '/:mealId/edit',
        templateUrl: 'modules/meals/client/views/form-meal.client.view.html',
        controller: 'MealsController',
        controllerAs: 'vm',
        resolve: {
          mealResolve: getMeal
        },
        data: {
          roles: ['admin'],
          pageTitle: 'Edit Meal {{ mealResolve.name }}'
        }
      })
      .state('meals.view', {
        url: '/:mealId',
        templateUrl: 'modules/meals/client/views/view-meal.client.view.html',
        controller: 'MealsController',
        controllerAs: 'vm',
        resolve: {
          mealResolve: getMeal
        },
        data:{
          pageTitle: 'Meal {{ articleResolve.name }}'
        }
      });
  }

  getMeal.$inject = ['$stateParams', 'MealsService'];

  function getMeal($stateParams, MealsService) {
    return MealsService.get({
      mealId: $stateParams.mealId
    }).$promise;
  }

  newMeal.$inject = ['MealsService'];

  function newMeal(MealsService) {
    return new MealsService();
  }
})();
