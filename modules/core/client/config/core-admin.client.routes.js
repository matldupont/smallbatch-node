'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'modules/core/client/views/admin.client.view.html',
        data: {
          pageTitle: 'Admin'
        }
      });
      //.state('admin.authentication', {
      //  //abstract: true,
      //  url: '/authentication',
      //  templateUrl: 'modules/users/client/views/authentication/authentication.client.view.html',
      //  controller: 'AuthenticationController',
      //  controllerAs: 'vm'
      //});
  }
]);
